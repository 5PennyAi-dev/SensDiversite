'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createAphorism, updateAphorism, useTags } from '@/lib/instant'
import type { Aphorism, AphorismCreate, AphorismUpdate, SavedImage } from '@/types/aphorism'
import type { Tag } from '@/types/tag'
import { Check, Wand2, MonitorPlay, Type, Image as ImageIcon, Loader2, Save, Sparkles, Layout, Info, Eye } from 'lucide-react'
import { MetaPromptParams, AspectRatio } from "@/types/image-generation"
import { constructMetaPrompt } from "@/lib/meta-prompt"
import { STYLE_DEFINITIONS } from "@/lib/visual-styles-data"
import { motion, AnimatePresence } from "framer-motion"

// --- Constants from ImageGenerator ---
const ASPECT_RATIO_OPTIONS = [
  { id: "16:9", name: "16:9 (Paysage)", value: "16:9" },
  { id: "1:1", name: "1:1 (Carré)", value: "1:1" },
  { id: "4:5", name: "4:5 (Portrait Court)", value: "4:5" },
  { id: "9:16", name: "9:16 (Story)", value: "9:16" },
];

// Generate options from the definitions to ensure consistency
const STYLE_FAMILY_OPTIONS = Object.values(STYLE_DEFINITIONS).map(def => ({
  id: def.id,
  name: def.name,
  value: def.id
})).sort((a, b) => a.name.localeCompare(b.name));

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
              <div className="flex flex-col h-full overflow-hidden">
                  {/* CONTROL DECK (Top) - Compacted */}
                  {/* CONTROL DECK (Top) - Ultra Wide Style */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-border/50 shrink-0 bg-card/50">
                      
                      {/* Column 1: Context (3/12 = 25%) */}
                      <div className="lg:col-span-3 space-y-3">
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">1. Contexte</h3>
                          <div>
                              <label className="text-[10px] font-medium text-foreground/70 mb-1 block">Auteur</label>
                              <input
                                  value={genParams.auteur}
                                  onChange={(e) => setGenParams({...genParams, auteur: e.target.value})}
                                  className="w-full p-1.5 text-xs bg-background text-foreground border border-input rounded-sm"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-medium text-foreground/70 mb-1 block">Scène / Métaphore</label>
                              <textarea
                                  value={genParams.scene || ""}
                                  onChange={(e) => setGenParams({...genParams, scene: e.target.value})}
                                  placeholder="Décrivez une scène..."
                                  className="w-full p-1.5 text-xs bg-background text-foreground border border-input rounded-sm min-h-[60px] resize-y placeholder:text-muted-foreground/50 leading-tight"
                              />
                          </div>
                      </div>

                      {/* Column 2: Visual Style (6/12 = 50%) - WIDE */}
                      <div className="lg:col-span-6 space-y-3">
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">2. Style Visuel</h3>
                          <div className="flex flex-col h-full">
                              <label className="text-[10px] font-medium text-foreground/70 mb-1 block">Direction Artistique</label>
                              <select 
                                  value={genParams.style_family}
                                  onChange={(e) => setGenParams({...genParams, style_family: e.target.value})}
                                  className="w-full p-1.5 text-xs bg-background text-foreground border border-input rounded-sm mb-2"
                              >
                                  {STYLE_FAMILY_OPTIONS.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                              </select>

                              {/* Style Info Card - Expanded Width */}
                              <div className="relative flex-1 min-h-[140px]">
                                <AnimatePresence mode='wait'>
                                  {genParams.style_family && STYLE_DEFINITIONS[genParams.style_family] && (
                                    <motion.div
                                      key={genParams.style_family}
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      transition={{ duration: 0.2 }}
                                      className="bg-card border border-border/60 rounded-sm p-3 text-[10px] space-y-2 shadow-sm h-full overflow-y-auto scrollbar-thin"
                                    >
                                      <div>
                                        <h4 className="uppercase font-bold text-primary tracking-wider mb-0.5 opacity-80 text-[9px]">Quand l'utiliser</h4>
                                        <p className="text-muted-foreground leading-tight">
                                          {STYLE_DEFINITIONS[genParams.style_family].usage}
                                        </p>
                                      </div>
                                      
                                      <div className='w-full h-px bg-border/40 my-1' />

                                      <div>
                                        <h4 className="uppercase font-bold text-primary tracking-wider mb-0.5 opacity-80 text-[9px]">L'effet produit</h4>
                                        <p className="text-muted-foreground leading-tight">
                                          {STYLE_DEFINITIONS[genParams.style_family].effect}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                          </div>
                      </div>

                      {/* Column 3: Format & Action (3/12 = 25%) - Stacked */}
                      <div className="lg:col-span-3 space-y-3 flex flex-col h-full">
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">3. Rendu</h3>
                          
                          <div className="flex flex-col gap-2">
                              <div>
                                  <label className="text-[10px] font-medium text-foreground/70 mb-1 block">Format</label>
                                  <select 
                                      value={genParams.aspectRatio}
                                      onChange={(e) => setGenParams({...genParams, aspectRatio: e.target.value as AspectRatio})}
                                      className="w-full p-1.5 text-xs bg-background text-foreground border border-input rounded-sm"
                                  >
                                      {ASPECT_RATIO_OPTIONS.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-[10px] font-medium text-foreground/70 mb-1 block">Typographie</label>
                                  <select 
                                      value={genParams.typo_style}
                                      onChange={(e) => setGenParams({...genParams, typo_style: e.target.value})}
                                      className="w-full p-1.5 text-xs bg-background text-foreground border border-input rounded-sm"
                                  >
                                      <option value="">✨ Libre</option>
                                      {TYPO_STYLE_OPTIONS.map(o => (
                                          <option key={o.id} value={o.value}>{o.name}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>

                          <div className="flex-1 flex items-end pb-0">
                              <button
                                  onClick={handleGenerateImage}
                                  disabled={isGenerating || !text.trim()}
                                  className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm flex items-center justify-center gap-2 text-xs font-bold shadow-md transition-all active:scale-[0.98]"
                              >
                                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                  Générer
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* PREVIEW STAGE (Bottom - Fills remaining space) */}
                  <div className="flex-1 overflow-hidden relative bg-muted/20 flex flex-col">
                      
                      {/* Centered Preview - Minimized Padding */}
                      <div className="flex-1 w-full flex items-center justify-center p-2 overflow-hidden">
                        {generatedImageTemp ? (
                             <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                                 {/* Image Container - Flexible */}
                                 <div className="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img 
                                         src={generatedImageTemp} 
                                         alt="Generated preview" 
                                         className="max-w-full max-h-full object-contain shadow-lg rounded-sm border border-border"
                                     />
                                     
                                      {/* Prompt Overlay */}
                                      {showPrompt && promptTemp && (
                                         <div className="absolute inset-0 bg-black/80 p-4 overflow-y-auto text-left animate-in fade-in z-20 max-w-xl mx-auto rounded-lg backdrop-blur-sm border border-white/10 m-2 flex flex-col h-fit max-h-[90%] my-auto">
                                             <div className="flex justify-between items-center mb-2 shrink-0">
                                                 <h4 className="text-white font-bold text-[10px] uppercase tracking-wider">Prompt Utilisé</h4>
                                                 <button onClick={() => setShowPrompt(false)} className="text-white/70 hover:text-white">✕</button>
                                             </div>
                                             <pre className="text-[10px] text-white/80 whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto">
                                                 {promptTemp}
                                             </pre>
                                         </div>
                                     )}
                                 </div>

                                  {/* Action Bar - Static Below Image - Compact */}
                                 <div className="mt-2 shrink-0 flex items-center gap-2 bg-background/80 backdrop-blur-md p-1.5 rounded-full border border-border shadow-sm z-10 scale-90 origin-bottom">
                                     <button
                                         onClick={() => setGeneratedImageTemp(null)}
                                         className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
                                         title="Fermer"
                                     >
                                        <Layout className="w-3 h-3" />
                                     </button>

                                     <div className="h-3 w-px bg-border/50"></div>
                                     
                                     {promptTemp && (
                                        <button
                                            onClick={() => setShowPrompt(!showPrompt)}
                                            className="px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 rounded-full hover:bg-muted"
                                        >
                                            <Eye className="w-3 h-3" />
                                            {showPrompt ? 'Masquer' : 'Voir'}
                                        </button>
                                     )}

                                     <div className="h-3 w-px bg-border/50"></div>

                                     {!savedLibrary.some(item => (typeof item === 'string' ? item : item.url) === generatedImageTemp) && (
                                         <button
                                             onClick={handleSaveToLibrary}
                                             disabled={isLoading}
                                             className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-bold hover:bg-secondary/80 flex items-center gap-1.5 transition-all"
                                         >
                                             {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                             Sauver
                                         </button>
                                     )}

                                     <button
                                         onClick={() => handleApplyImage(generatedImageTemp)}
                                         className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-bold shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all"
                                     >
                                         <Check className="w-3 h-3" />
                                         Choisir
                                     </button>
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center text-muted-foreground/40 flex flex-col items-center justify-center h-full">
                                 {currentImageUrl ? (
                                     <div className='flex flex-col items-center animate-in fade-in duration-700'> 
                                        <div className="uppercase tracking-[0.2em] text-[10px] font-bold text-primary mb-2 p-1 border-b border-primary/20">Image Actuelle</div>
                                        <div className='max-h-[25vh] rounded-sm overflow-hidden shadow-xl border-4 border-background/50 ring-1 ring-border/20'>
                                            <Image src={currentImageUrl} alt="Current" width={300} height={200} className="object-contain" />
                                        </div>
                                     </div>
                                 ) : (
                                     <>
                                         <MonitorPlay className="w-16 h-16 mb-4 opacity-10" />
                                         <p className="text-xl font-serif text-muted-foreground/60">Le studio est prêt</p>
                                         <p className="text-xs mt-1 max-w-sm leading-relaxed opacity-70">Générez une image pour commencer.</p>
                                     </>
                                 )}
                             </div>
                         )}
                      </div>

                      {/* Library Strip (Bottom) - Compact */}
                      <div className="w-full border-t border-border/50 bg-background/50 backdrop-blur-sm p-3 shrink-0">
                          <div className="flex items-center justify-between mb-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bibliothèque</h4>
                             <span className="text-[9px] text-muted-foreground/50">{savedLibrary.length} / 5</span>
                          </div>
                          
                          {savedLibrary.length === 0 ? (
                              <div className="text-center py-2 border border-dashed border-border/40 rounded-sm">
                                  <p className="text-[9px] text-muted-foreground italic">Vide</p>
                              </div>
                          ) : (
                              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide h-14">
                                  {savedLibrary.map((item, idx) => {
                                      const url = typeof item === 'string' ? item : item.url;
                                      return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectFromLibrary(item)}
                                            className={`relative h-full aspect-video rounded-sm overflow-hidden border-2 transition-all shrink-0 hover:ring-2 hover:ring-primary/50 ${
                                                generatedImageTemp === url 
                                                ? 'border-primary ring-2 ring-primary scale-105 z-10' 
                                                : 'border-border/50 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Lib ${idx}`} className="w-full h-full object-cover" />
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
