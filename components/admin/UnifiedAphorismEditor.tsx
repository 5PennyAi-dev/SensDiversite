'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createAphorism, updateAphorism, useTags } from '@/lib/instant'
import type { Aphorism, AphorismCreate, AphorismUpdate } from '@/types/aphorism'
import type { Tag } from '@/types/tag'
import { Check, Wand2, MonitorPlay, Type, Image as ImageIcon, Loader2, Save, Sparkles, Layout } from 'lucide-react'
import { MetaPromptParams, AspectRatio } from "@/types/image-generation"
import { constructMetaPrompt } from "@/lib/meta-prompt"

// --- Constants from ImageGenerator ---
const ASPECT_RATIO_OPTIONS = [
  { id: "16:9", name: "16:9 (Paysage)", value: "16:9" },
  { id: "1:1", name: "1:1 (Carré)", value: "1:1" },
  { id: "4:5", name: "4:5 (Portrait Court)", value: "4:5" },
  { id: "9:16", name: "9:16 (Story)", value: "9:16" },
];

const STYLE_FAMILY_OPTIONS = [
  { id: "minimal_abstrait", name: "Minimal Abstrait", value: "minimal_abstrait" },
  { id: "photo_cinematique", name: "Photo Cinématique", value: "photo_cinematique" },
  { id: "typographie_poster", name: "Typographie Poster", value: "typographie_poster" },
  { id: "illustration_lineart", name: "Illustration Line Art", value: "illustration_lineart" },
  { id: "collage_editorial", name: "Collage Éditorial", value: "collage_editorial" },
  { id: "art_digital_onirique", name: "Art Digital Onirique", value: "art_digital_onirique" },
  { id: "papier_decoupe_layer", name: "Papier Découpé (Layer)", value: "papier_decoupe_layer" },
  { id: "risographie_retro", name: "Risographie Rétro", value: "risographie_retro" },
  { id: "encre_zen", name: "Encre Zen (Sumi-e)", value: "encre_zen" },
  { id: "architecture_brutaliste", name: "Architecture Brutaliste", value: "architecture_brutaliste" },
];

const TYPO_STYLE_OPTIONS = [
  { id: "sans_serif_modern", name: "Sans Serif Modern", value: "sans_serif_modern" },
  { id: "serif_editorial", name: "Serif Editorial", value: "serif_editorial" },
  { id: "script_brush", name: "Script Brush", value: "script_brush" },
  { id: "condensed_bold", name: "Condensed Bold", value: "condensed_bold" },
];

interface UnifiedAphorismEditorProps {
  aphorism?: Aphorism
  onSuccess?: () => void
  onCancel?: () => void
}

export function UnifiedAphorismEditor({
  aphorism,
  onSuccess,
  onCancel,
}: UnifiedAphorismEditorProps) {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState<'edit' | 'visual'>('edit')

  // --- Form State ---
  const [text, setText] = useState(aphorism?.text || '')
  const [title, setTitle] = useState(aphorism?.title || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(aphorism?.tags || [])
  const [featured, setFeatured] = useState(aphorism?.featured || false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(aphorism?.imageUrl || null)
  
  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // --- Image Gen State ---
  const [genParams, setGenParams] = useState<MetaPromptParams>({
    citation: aphorism?.text || "",
    titre: aphorism?.title || "",
    auteur: "Dourliac", // Default author
    aspectRatio: "16:9",
    style_family: "minimal_abstrait",
    typo_style: "sans_serif_modern",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImageTemp, setGeneratedImageTemp] = useState<string | null>(null) // Base64 temp
  
  // Fetch tags
  const { data: tagData } = useTags()
  const availableTags = (tagData?.tags as Tag[] | undefined) || []

  // Sync effect when aphorism prop changes
  useEffect(() => {
    if (aphorism) {
      setText(aphorism.text)
      setTitle(aphorism.title || '')
      setSelectedTags(aphorism.tags || [])
      setFeatured(aphorism.featured || false)
      setCurrentImageUrl(aphorism.imageUrl || null)
      
      // Sync Gen Params
      setGenParams(prev => ({
        ...prev,
        citation: aphorism.text,
        titre: aphorism.title || "",
      }))
    } else {
      // Reset for new creation
      setText('')
      setTitle('')
      setSelectedTags([])
      setFeatured(false)
      setCurrentImageUrl(null)
      setGenParams(prev => ({
         ...prev,
         citation: "",
         titre: "",
      }))
    }
  }, [aphorism])
  
  // Update gen params when text/title changes in Edit tab
  useEffect(() => {
      setGenParams(prev => ({
          ...prev,
          citation: text,
          titre: title,
      }))
  }, [text, title])

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : [...prev, label]
    )
  }

  const handleGenerateImage = async () => {
    if (!genParams.citation || !genParams.auteur) {
      setError("Le texte et l'auteur sont requis pour la génération.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImageTemp(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(genParams),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setGeneratedImageTemp(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyGeneratedImage = async () => {
      if (!generatedImageTemp) return
      
      // Upload temp image to permanent storage immediately or on save? 
      // User flow suggests we want to "keep" this image.
      // Let's upload it now to get a permanent URL.
      
      setIsLoading(true)
      try {
          const base64Response = await fetch(generatedImageTemp)
          const blob = await base64Response.blob()
          const file = new File([blob], `gen-${Date.now()}.png`, { type: "image/png" })
          
          const formData = new FormData()
          formData.append("file", file)
          
          const uploadRes = await fetch("/api/upload-image", {
              method: "POST",
              body: formData,
          })
          
          if (!uploadRes.ok) throw new Error("Upload failed")
          
          const { url } = await uploadRes.json()
          setCurrentImageUrl(url)
          setGeneratedImageTemp(null) // Clear temp
          setActiveTab('edit') // Switch back to see result
      } catch (err) {
          setError("Failed to apply image: " + (err instanceof Error ? err.message : "Unknown"))
      } finally {
          setIsLoading(false)
      }
  }

  const handleSaveAphorism = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const formData = {
        text,
        title: title.trim() || undefined,
        tags: selectedTags,
        featured: featured,
        imageUrl: currentImageUrl,
      }

      if (aphorism) {
        await updateAphorism(aphorism.id, formData as AphorismUpdate)
      } else {
        await createAphorism(formData as AphorismCreate)
      }

      // Reset form if it was a new creation, or just notify success
      if (!aphorism) {
          setText('')
          setTitle('')
          setSelectedTags([])
          setCurrentImageUrl(null)
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-sm shadow-sm border border-border/50">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex gap-4">
              <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                      activeTab === 'edit' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                  <Type className="w-4 h-4" />
                  Édition
              </button>
              <button
                  onClick={() => setActiveTab('visual')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                      activeTab === 'visual' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                  <Sparkles className="w-4 h-4" />
                  Studio Visuel
              </button>
          </div>
          
          <div className="flex items-center gap-2">
              {onCancel && (
                  <button onClick={onCancel} className="text-muted-foreground text-sm hover:text-foreground px-3">
                      Annuler
                  </button>
              )}
              <button
                  onClick={handleSaveAphorism}
                  disabled={isLoading || !text.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {aphorism ? 'Mettre à jour' : 'Enregistrer'}
              </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 scrollbar-thin">
          {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-sm text-sm">
                  {error}
              </div>
          )}

          {activeTab === 'edit' ? (
              <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Image Preview Banner if exists */}
                  {currentImageUrl && (
                      <div className="relative w-full aspect-[21/9] bg-muted rounded-md overflow-hidden group">
                          <Image src={currentImageUrl} alt="Current" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                  onClick={() => setActiveTab('visual')}
                                  className="bg-background/90 text-foreground px-3 py-1.5 rounded-sm text-xs font-medium"
                              >
                                  Modifier l'image
                              </button>
                               <button 
                                  onClick={() => setCurrentImageUrl(null)}
                                  className="bg-destructive/90 text-white px-3 py-1.5 rounded-sm text-xs font-medium"
                              >
                                  Supprimer
                              </button>
                          </div>
                      </div>
                  )}

                  <div className="grid gap-6">
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Titre (Optionnel)</label>
                          <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Titre de l'oeuvre..."
                                className="w-full p-3 bg-background text-foreground border border-input rounded-sm focus:ring-1 focus:ring-primary"
                          />
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Contenu de l'aphorisme</label>
                          <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Écrivez votre pensée ici..."
                                className="w-full p-4 bg-background text-foreground border border-input rounded-sm min-h-[200px] font-serif text-lg leading-relaxed focus:ring-1 focus:ring-primary resize-y"
                          />
                      </div>

                      <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground">Thèmes</label>
                          <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => (
                                <button
                                  key={tag.id}
                                  onClick={() => toggleTag(tag.label)}
                                  className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                                      selectedTags.includes(tag.label)
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-muted/30 text-muted-foreground border-transparent hover:border-border hover:bg-muted/50 hover:text-foreground'
                                  }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                          </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                          <input 
                              type="checkbox" 
                              id="featured" 
                              checked={featured} 
                              onChange={(e) => setFeatured(e.target.checked)}
                              className="rounded border-input text-primary focus:ring-primary"
                          />
                          <label htmlFor="featured" className="text-sm cursor-pointer select-none text-foreground">
                              Mettre à la une (Featured)
                          </label>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                  {/* STUDIO: Controls (Left) */}
                  <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
                      <div className="space-y-4">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Paramètres de Génération</h3>
                          
                          <div>
                              <label className="text-xs font-medium text-foreground/70 mb-1 block">Auteur</label>
                              <input
                                  value={genParams.auteur}
                                  onChange={(e) => setGenParams({...genParams, auteur: e.target.value})}
                                  className="w-full p-2 text-sm bg-background text-foreground border border-input rounded-sm"
                              />
                          </div>
                          
                          <div>
                              <label className="text-xs font-medium text-foreground/70 mb-1 block">Format</label>
                              <select 
                                  value={genParams.aspectRatio}
                                  onChange={(e) => setGenParams({...genParams, aspectRatio: e.target.value as AspectRatio})}
                                  className="w-full p-2 text-sm bg-background text-foreground border border-input rounded-sm"
                              >
                                  {ASPECT_RATIO_OPTIONS.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                              </select>
                          </div>

                          <div>
                              <label className="text-xs font-medium text-foreground/70 mb-1 block">Direction Artistique</label>
                              <select 
                                  value={genParams.style_family}
                                  onChange={(e) => setGenParams({...genParams, style_family: e.target.value})}
                                  className="w-full p-2 text-sm bg-background text-foreground border border-input rounded-sm"
                              >
                                  {STYLE_FAMILY_OPTIONS.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                              </select>
                          </div>
                          
                           <div>
                              <label className="text-xs font-medium text-foreground/70 mb-1 block">Typographie</label>
                              <select 
                                  value={genParams.typo_style}
                                  onChange={(e) => setGenParams({...genParams, typo_style: e.target.value})}
                                  className="w-full p-2 text-sm bg-background text-foreground border border-input rounded-sm"
                              >
                                  {TYPO_STYLE_OPTIONS.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                              </select>
                          </div>
                          
                          <button
                              onClick={handleGenerateImage}
                              disabled={isGenerating || !text.trim()}
                              className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm flex items-center justify-center gap-2 text-sm font-medium transition-all"
                          >
                              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                              Générer une proposition
                          </button>
                      </div>
                  </div>

                  {/* STUDIO: Preview Area (Right/Center) */}
                  <div className="lg:col-span-8 bg-muted/20 rounded-lg border border-border/50 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                      {generatedImageTemp ? (
                          <div className="relative w-full h-full flex flex-col items-center animate-in fade-in duration-500">
                             <div className="relative shadow-2xl rounded-sm overflow-hidden max-h-[500px] border border-border">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                      src={generatedImageTemp} 
                                      alt="Generated preview" 
                                      className="max-w-full max-h-[500px] object-contain"
                                  />
                             </div>
                             
                             <div className="mt-8 flex gap-4">
                                  <button
                                      onClick={() => setGeneratedImageTemp(null)}
                                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                  >
                                      Ignorer
                                  </button>
                                  <button
                                      onClick={handleApplyGeneratedImage}
                                      className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                  >
                                      <Check className="w-4 h-4" />
                                      Choisir cette image
                                  </button>
                             </div>
                          </div>
                      ) : (
                          <div className="text-center text-muted-foreground/50">
                              {currentImageUrl ? (
                                   <div className='flex flex-col items-center'> 
                                      <p className="mb-4 text-sm font-medium text-foreground">Image Actuelle</p>
                                      <div className='max-h-[300px] rounded overflow-hidden opacity-50 border border-dashed border-border mb-4'>
                                          <Image src={currentImageUrl} alt="Current" width={300} height={200} className="object-cover" />
                                      </div>
                                      <p className="max-w-xs text-sm">Une image est déjà définie. Générer une nouvelle image remplacera l'existante après validation.</p>
                                   </div>
                              ) : (
                                  <>
                                      <MonitorPlay className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                      <p className="text-lg font-serif">Le studio est prêt</p>
                                      <p className="text-sm mt-2">Configurez le style à gauche et lancez la magie.</p>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          )}
      </div>
    </div>
  )
}
