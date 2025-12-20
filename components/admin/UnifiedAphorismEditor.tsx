'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createAphorism, updateAphorism, useTags } from '@/lib/instant'
import type { Aphorism, AphorismCreate, AphorismUpdate, SavedImage } from '@/types/aphorism'
import type { Tag } from '@/types/tag'
import { Check, Wand2, MonitorPlay, Type, Image as ImageIcon, Loader2, Save, Sparkles, Layout, Info, Eye } from 'lucide-react'
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
  { id: "noir_blanc_argentique", name: "Noir & Blanc Argentique", value: "noir_blanc_argentique" },
  { id: "bauhaus_suisse", name: "Bauhaus / Suisse", value: "bauhaus_suisse" },
  { id: "aquarelle_lavis", name: "Aquarelle / Lavis", value: "aquarelle_lavis" },
  { id: "papier_decoupe_layer", name: "Papier Découpé (Layer)", value: "papier_decoupe_layer" },
  { id: "risographie_retro", name: "Risographie Rétro", value: "risographie_retro" },
  { id: "encre_zen", name: "Encre Zen (Sumi-e)", value: "encre_zen" },
];

const TYPO_STYLE_OPTIONS = [
  { id: "sans_serif_modern", name: "Sans Serif Modern", value: "sans_serif_modern", style: { fontFamily: "Inter, Helvetica, sans-serif" } },
  { id: "serif_editorial", name: "Serif Editorial", value: "serif_editorial", style: { fontFamily: "Georgia, 'Times New Roman', serif" } },
  { id: "slab_serif_strong", name: "Slab Serif (Fort)", value: "slab_serif_strong", style: { fontFamily: "'Rockwell', 'Courier New', serif", fontWeight: 'bold' } },
  { id: "script_elegant", name: "Script Élégant", value: "script_elegant", style: { fontFamily: "'Brush Script MT', cursive", fontStyle: 'italic' } },
  { id: "condensed_bold", name: "Condensed Bold", value: "condensed_bold", style: { fontFamily: "Impact, sans-serif-condensed, sans-serif", fontWeight: '900' } },
  { id: "monospace_typewriter", name: "Typewriter (Code/Retro)", value: "monospace_typewriter", style: { fontFamily: "'Courier New', monospace" } },
  { id: "handwritten_organic", name: "Manuscrit (Humain)", value: "handwritten_organic", style: { fontFamily: "'Comic Sans MS', 'Segoe Print', cursive" } },
  { id: "display_retro_70s", name: "Display Retro 70s", value: "display_retro_70s", style: { fontFamily: "Cooper Black, serif", fontWeight: '800' } },
  { id: "geometric_light", name: "Geometric Light", value: "geometric_light", style: { fontFamily: "Futura, sans-serif", fontWeight: '100' } },
  { id: "blackletter_gothic", name: "Gothic / Blackletter", value: "blackletter_gothic", style: { fontFamily: "fantasy" } },
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
    scene: "",
    auteur: "Dourliac", // Default author
    aspectRatio: "16:9",
    style_family: "minimal_abstrait",
    typo_style: "", // Empty = Libre / Aléatoire
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImageTemp, setGeneratedImageTemp] = useState<string | null>(null) // Base64 temp
  const [promptTemp, setPromptTemp] = useState<string | null>(null) // Prompt associated with temp image
  const [showPrompt, setShowPrompt] = useState(false)
  const [savedLibrary, setSavedLibrary] = useState<(string | SavedImage)[]>(aphorism?.images || []) // Persistent library

  
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
      setSavedLibrary(aphorism.images || [])
      
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
         scene: "",
      }))
    }
  }, [aphorism])
  
  // Update gen params when text/title changes in Edit tab
  useEffect(() => {
      setGenParams(prev => ({
          ...prev,
          citation: text,
          titre: title,
          scene: genParams.scene || "", // Preserve existing scene if any
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
    setPromptTemp(null)
    setShowPrompt(false)

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
      setPromptTemp(data.prompt || null)
      // Note: We don't auto-save to library anymore, user must click "Add to Library"

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!generatedImageTemp) return
    setIsLoading(true)
    try {
        // 1. Upload if it's a base64 string (starts with data:)
        let urlToSave = generatedImageTemp
        if (generatedImageTemp.startsWith('data:')) {
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
            urlToSave = url
        }

        // 2. Create SavedImage object
        const newSavedImage: SavedImage = {
            url: urlToSave,
            prompt: promptTemp || "",
            params: {
                aspectRatio: genParams.aspectRatio,
                style_family: genParams.style_family,
                typo_style: genParams.typo_style,
                scene: genParams.scene || undefined
            },
            createdAt: Date.now()
        }

        // 3. Update Library State & DB
        const newLibrary = [newSavedImage, ...savedLibrary].slice(0, 5)
        setSavedLibrary(newLibrary)
        
        if (aphorism) {
            await updateAphorism(aphorism.id, { images: newLibrary } as AphorismUpdate)
        }
        
        // 4. Set as current temp image (now a URL)
        setGeneratedImageTemp(urlToSave)
        
    } catch (err) {
        setError("Failed to save to library: " + (err instanceof Error ? err.message : "Unknown"))
    } finally {
        setIsLoading(false)
    }
  }

  const handleApplyImage = async (imgUrl: string) => {
      setCurrentImageUrl(imgUrl)
      setActiveTab('edit')
  }

  const handleSelectFromLibrary = (item: string | SavedImage) => {
      if (typeof item === 'string') {
          // Legacy string image
          setGeneratedImageTemp(item)
          setPromptTemp(null)
      } else {
          // Full metadata image
          setGeneratedImageTemp(item.url)
          setPromptTemp(item.prompt)
          // Restore params to UI
          setGenParams(prev => ({
              ...prev,
              aspectRatio: item.params.aspectRatio as AspectRatio,
              style_family: item.params.style_family,
              typo_style: item.params.typo_style,
              scene: item.params.scene || "",
          }))
      }
      setShowPrompt(false)
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
        images: savedLibrary,
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
          setSavedLibrary([])
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
                              <label className="text-xs font-medium text-foreground/70 mb-1 block">Scène / Métaphore (Optionnel)</label>
                              <textarea
                                  value={genParams.scene || ""}
                                  onChange={(e) => setGenParams({...genParams, scene: e.target.value})}
                                  placeholder="Décrivez une scène ou un objet spécifique..."
                                  className="w-full p-2 text-sm bg-background text-foreground border border-input rounded-sm min-h-[80px] resize-y placeholder:text-muted-foreground/50"
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
                                  <option value="">✨ Libre / Aléatoire (Recommandé)</option>
                                  {TYPO_STYLE_OPTIONS.map(o => (
                                      <option 
                                        key={o.id} 
                                        value={o.value}
                                        style={o.style as React.CSSProperties}
                                      >
                                          {o.name}
                                      </option>
                                  ))}
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
                  <div className="lg:col-span-8 bg-muted/20 rounded-lg border border-border/50 p-6 flex flex-col items-center relative min-h-[600px]">
                      
                      {/* Main Preview Stage */}
                      <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px]">
                        {generatedImageTemp ? (
                            <div className="relative w-full flex flex-col items-center animate-in fade-in duration-500">
                                <div className="relative shadow-2xl rounded-sm overflow-hidden max-h-[400px] border border-border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={generatedImageTemp} 
                                        alt="Generated preview" 
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                </div>
                                
                                    {/* Prompt Overlay */}
                                    {showPrompt && promptTemp && (
                                        <div className="absolute inset-0 bg-black/80 p-6 overflow-y-auto text-left animate-in fade-in z-20">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Prompt Utilisé</h4>
                                                <button onClick={() => setShowPrompt(false)} className="text-white/70 hover:text-white">✕</button>
                                            </div>
                                            <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
                                                {promptTemp}
                                            </pre>
                                        </div>
                                    )}
                                
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
                                    {/* Action Group: Secondary */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setGeneratedImageTemp(null)}
                                            className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                                        >
                                            Fermer
                                        </button>

                                        {promptTemp && (
                                            <button
                                                onClick={() => setShowPrompt(!showPrompt)}
                                                className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 border border-border/50 rounded-sm hover:bg-muted/50"
                                            >
                                                <Eye className="w-3 h-3" />
                                                {showPrompt ? 'Masquer' : 'Voir Prompt'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="h-4 w-px bg-border hidden sm:block"></div>

                                    {/* Action Group: Primary */}
                                    <div className="flex flex-wrap items-center gap-2 justify-center">
                                        {!savedLibrary.some(item => (typeof item === 'string' ? item : item.url) === generatedImageTemp) && (
                                            <button
                                                onClick={handleSaveToLibrary}
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-sm text-sm font-medium hover:bg-secondary/80 flex items-center gap-2 transition-all whitespace-nowrap shadow-sm"
                                            >
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Sauvegarder
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleApplyImage(generatedImageTemp)}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 transition-all whitespace-nowrap"
                                        >
                                            <Check className="w-4 h-4" />
                                            Choisir cette image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground/50">
                                {currentImageUrl ? (
                                     <div className='flex flex-col items-center'> 
                                        <p className="mb-4 text-sm font-medium text-foreground">Image Actuelle</p>
                                        <div className='max-h-[250px] rounded overflow-hidden opacity-80 border border-border mb-4 shadow-lg'>
                                            <Image src={currentImageUrl} alt="Current" width={400} height={250} className="object-contain" />
                                        </div>
                                        <p className="max-w-xs text-xs">Cette image est actuellement utilisée.</p>
                                     </div>
                                ) : (
                                    <>
                                        <MonitorPlay className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-serif">Le studio est prêt</p>
                                        <p className="text-sm mt-2">Générez une image ou sélectionnez-en une dans la bibliothèque ci-dessous.</p>
                                    </>
                                )}
                            </div>
                        )}
                      </div>

                      {/* Persistent Library Section */}
                      <div className="mt-8 w-full border-t border-border/50 pt-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
                              <span>Bibliothèque de l'aphorisme</span>
                              <span className="text-[10px] font-normal normal-case opacity-50">{savedLibrary.length} / 5</span>
                          </h4>
                          
                          {savedLibrary.length === 0 ? (
                              <div className="text-center py-8 bg-black/20 rounded-sm border border-dashed border-white/5">
                                  <p className="text-xs text-muted-foreground italic">Aucune image sauvegardée pour cet aphorisme.</p>
                              </div>
                          ) : (
                              <div className="grid grid-cols-5 gap-3">
                                  {savedLibrary.map((item, idx) => {
                                      const url = typeof item === 'string' ? item : item.url;
                                      return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectFromLibrary(item)}
                                            className={`relative aspect-video rounded-sm overflow-hidden border-2 transition-all group ${
                                                generatedImageTemp === url 
                                                ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-lg z-10' 
                                                : 'border-transparent border-white/5 opacity-70 hover:opacity-100 hover:scale-105 hover:z-10'
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Lib ${idx}`} className="w-full h-full object-cover" />
                                            {generatedImageTemp !== url && (
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            )}
                                            {typeof item !== 'string' && (
                                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded-sm">
                                                    Info
                                                </div>
                                            )}
                                        </button>
                                      )
                                  })}
                              </div>
                          )}
                      </div>
                  </div>

              </div>
          )}
      </div>
    </div>
  )
}
