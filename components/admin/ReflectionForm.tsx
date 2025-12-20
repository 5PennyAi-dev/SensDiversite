'use client'

import { useState, useEffect, useRef } from 'react'
import { createReflection, updateReflection, useTags } from '@/lib/instant'
import { MetaPromptParams, AspectRatio } from "@/types/image-generation"
import Image from "next/image"
import { Loader2, Wand2, Plus, X, Save, Eraser, Image as ImageIcon, Check } from 'lucide-react'
import type { Reflection, ReflectionCreate, ReflectionUpdate } from '@/types/reflection'
import type { Tag } from '@/types/tag'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { MarkdownToolbar } from './MarkdownToolbar'
import { TagManager } from './TagManager'

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

interface ReflectionFormProps {
  reflection?: Reflection
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReflectionForm({ reflection, onSuccess, onCancel }: ReflectionFormProps) {
  // Form State
  const [title, setTitle] = useState(reflection?.title || '')
  const [content, setContent] = useState(reflection?.content || '')
  const [images, setImages] = useState<string[]>(reflection?.images || [])
  const [slug, setSlug] = useState(reflection?.slug || '')
  const [published, setPublished] = useState(reflection?.published || false)
  const [selectedTags, setSelectedTags] = useState<string[]>(reflection?.tags || [])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Fetch available tags
  const { data: tagData } = useTags()
  const availableTags = (tagData?.tags as Tag[] | undefined) || []

  // Image Gen State
  const [genParams, setGenParams] = useState<MetaPromptParams>({
    citation: "", // Will serve as the "Passage" prompt
    titre: "",
    auteur: "", 
    aspectRatio: "16:9",
    style_family: "minimal_abstrait",
    typo_style: "sans_serif_modern",
  })
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)

  useEffect(() => {
    if (reflection) {
      setTitle(reflection.title)
      setContent(reflection.content)
      setImages(reflection.images || [])
      setSlug(reflection.slug)
      setPublished(reflection.published)
      setSelectedTags(reflection.tags || [])
    }
  }, [reflection])

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (!reflection) { // Only auto-update slug on creation
        setSlug(generateSlug(e.target.value))
    }
  }

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : [...prev, label]
    )
  }

  const handleInsertText = (textToInsert: string, cursorOffset: number = 0) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentText = textarea.value
    
    // Si du texte est sélectionné et qu'on insère des marqueurs (comme ** ou *)
    // on entoure la sélection
    if (start !== end && textToInsert.includes('texte')) {
        const selectedText = currentText.substring(start, end)
        const [prefix, suffix] = textToInsert.split('texte')
        const newText = currentText.substring(0, start) + prefix + selectedText + suffix + currentText.substring(end)
        
        setContent(newText)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, end + prefix.length)
        }, 0)
        return
    }

    // Comportement standard : insertion
    const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end)
    setContent(newText)

    setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + textToInsert.length + cursorOffset
        textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleGenerateImage = async () => {
    if (!genParams.citation) {
        setGenError("Veuillez saisir un passage de texte à illustrer.")
        return
    }

    setIsGenerating(true)
    setGenError(null)
    setGeneratedPreview(null)

    try {
        const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(genParams),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Erreur de génération")
        }

        setGeneratedPreview(data.imageUrl)
    } catch (err) {
        setGenError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
        setIsGenerating(false)
    }
  }

  const handleSaveImage = async () => {
    if (!generatedPreview) return
    if (images.length >= 4) {
        setGenError("Maximum 4 images par réflexion.")
        return
    }

    setIsSavingImage(true)
    setGenError(null)

    try {
        // 1. Convert Base64 to Blob
        const base64Response = await fetch(generatedPreview)
        const blob = await base64Response.blob()
        const file = new File([blob], `reflection-img-${Date.now()}.png`, { type: "image/png" })

        // 2. Upload
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
        })

        if (!uploadRes.ok) throw new Error("Erreur d'upload")

        const { url } = await uploadRes.json()
        
        setImages(prev => [...prev, url])
        setGeneratedPreview(null) // Clear preview
        setGenParams(prev => ({ ...prev, citation: "" })) // Reset text
    } catch (err) {
        setGenError("Erreur lors de la sauvegarde de l'image")
    } finally {
        setIsSavingImage(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, imageUrl: string, align: 'left' | 'center' | 'right' = 'center') => {
    let markdown = `![Image décorative](${imageUrl})`
    if (align === 'left') markdown = `![left](${imageUrl})`
    if (align === 'right') markdown = `![right](${imageUrl})`
    
    e.dataTransfer.setData("text/plain", markdown)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!title || !slug) {
        setError("Titre et Slug sont requis")
        return
    }

    try {
        const data = {
            title,
            content,
            slug,
            images,
            published,
            tags: selectedTags
        }

        if (reflection) {
             await updateReflection(reflection.id, data as ReflectionUpdate)
        } else {
             await createReflection(data as ReflectionCreate)
        }
        onSuccess?.()
    } catch (err) {
        setError("Erreur lors de la sauvegarde")
    }
  }

  return (
    <div className={`grid grid-cols-1 gap-8 ${viewMode === 'preview' ? '' : 'lg:grid-cols-3'}`}>
        {/* Main Editor */}
        <div className={`${viewMode === 'preview' ? 'w-full' : 'lg:col-span-2'} space-y-6`}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
                {viewMode === 'edit' && (
                    <>
                        <div>
                             <label className="block text-sm font-medium mb-2 text-gray-200">Titre</label>
                             <input 
                                type="text" 
                                value={title} 
                                onChange={handleTitleChange}
                                className="w-full p-3 border border-input rounded bg-muted/20 text-white placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-serif text-xl"
                                placeholder="Le titre de la réflexion..."
                             />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium mb-2 text-gray-200">Slug URL</label>
                                <input 
                                    type="text" 
                                    value={slug} 
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full p-3 border border-input rounded bg-muted/20 text-white text-sm font-mono placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                />
                             </div>
                             <div className="flex items-center pt-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={published} 
                                        onChange={(e) => setPublished(e.target.checked)}
                                        className="w-4 h-4 rounded border-input bg-background"
                                    />
                                    <span className="text-sm font-medium text-gray-200">Publier immédiatement</span>
                                </label>
                             </div>
                        </div>
                    </>
                )}

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-200">
                            Contenu {viewMode === 'edit' ? '(Éditeur Riche)' : '(Prévisualisation)'}
                        </label>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode('edit')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'edit' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Éditer
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('preview')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Prévisualiser
                            </button>
                        </div>
                    </div>
                    
                    {viewMode === 'edit' ? (
                        <div className="border border-input rounded-lg overflow-hidden bg-muted/10 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
                            <MarkdownToolbar onInsert={handleInsertText} />
                            
                            <textarea 
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-6 bg-transparent text-white font-serif text-lg leading-relaxed min-h-[600px] placeholder:text-muted-foreground/50 border-none focus:ring-0 resize-y"
                                placeholder="# Commencez à écrire votre réflexion..."
                            />
                            <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between">
                                <span>Supporte le Markdown + HTML</span>
                                <span>{content.length} caractères</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full p-8 border border-input rounded bg-black min-h-[500px] overflow-y-auto max-h-[800px]">
                            <div className="max-w-3xl mx-auto">
                                <article className="prose prose-invert prose-lg !text-gray-200 prose-headings:!text-white prose-p:!text-gray-200 prose-strong:!text-white prose-li:!text-gray-200 prose-headings:font-display [&_p]:font-display [&_p]:text-lg [&_p]:sm:text-xl [&_p]:md:text-2xl [&_p]:leading-relaxed prose-a:text-primary prose-img:rounded-xl prose-img:my-8 prose-img:shadow-2xl prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:!text-gray-300 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic [&_*]:!text-gray-200 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_strong]:!text-white">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        img: ({node, ...props}) => {
                                            const alt = props.alt?.toLowerCase() || ""
                                            const isLeft = alt.includes("left") || alt.includes("gauche")
                                            const isRight = alt.includes("right") || alt.includes("droite")
                                            
                                            if (isLeft) {
                                                return (
                                                    <span className="float-left mr-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-left">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img 
                                                            {...props} 
                                                            className="w-full h-auto object-contain" 
                                                            alt={props.alt || "Illustration"} 
                                                        />
                                                    </span>
                                                )
                                            }

                                            if (isRight) {
                                                return (
                                                    <span className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-right">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img 
                                                            {...props} 
                                                            className="w-full h-auto object-contain" 
                                                            alt={props.alt || "Illustration"} 
                                                        />
                                                    </span>
                                                )
                                            }

                                            // Default center/full width
                                            return (
                                                <span className="block my-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-both">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        {...props} 
                                                        className="w-full h-auto object-contain" 
                                                        alt={props.alt || "Illustration"} 
                                                    />
                                                </span>
                                            )
                                        }
                                    }}
                                >
                                    {content || "*Aucun contenu à prévisualiser*"}
                                </ReactMarkdown>
                                {selectedTags.length > 0 && (
                                  <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                                     {selectedTags.map((tag) => (
                                         <span key={tag} className="px-3 py-1 bg-white/5 text-primary/80 font-mono text-xs uppercase tracking-wider rounded-full">
                                            #{tag}
                                         </span>
                                     ))}
                                  </div>
                                )}
                            </article>
                            </div>
                        </div>
                    )}
                </div>

                {error && <div className="text-destructive text-sm">{error}</div>}

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-muted-foreground hover:text-foreground">
                            Annuler
                        </button>
                    )}
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
                        {reflection ? 'Mettre à jour' : 'Créer la réflexion'}
                    </button>
                </div>
            </form>
        </div>

        {/* Sidebar: Image Gen & Gallery */}
        {viewMode === 'edit' && (
        <div className="space-y-8">
            {/* Gallery */}
            <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="text-sm font-medium mb-4 flex items-center justify-between text-gray-200">
                    <span>Bibliothèque d'images ({images.length}/4)</span>
                </h3>
                
                {images.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs italic bg-muted/30 rounded">
                        Aucune image pour cette réflexion
                    </div>
                ) : (
                    <div className="space-y-4">
                        {images.map((url, idx) => (
                            <div key={idx} className="bg-muted/10 rounded-lg p-3 border border-border flex gap-4 items-start group relative">
                                <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                                     <Image src={url} alt={`Img ${idx}`} fill className="object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Glisser pour insérer :</p>
                                    <div className="flex flex-wrap gap-2">
                                        <div 
                                            className="px-2 py-1 bg-background border border-border rounded text-[10px] cursor-grab hover:bg-primary/10 hover:border-primary transition-colors flex items-center gap-1 min-w-[65px]"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, url, 'left')}
                                        >
                                            <span className="block w-2 h-2 border-r border-b border-foreground/50" />
                                            Gauche
                                        </div>
                                        <div 
                                            className="px-2 py-1 bg-background border border-border rounded text-[10px] cursor-grab hover:bg-primary/10 hover:border-primary transition-colors flex items-center gap-1 min-w-[65px]"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, url, 'center')}
                                        >
                                            <span className="block w-2 h-2 bg-foreground/50" />
                                            Centre
                                        </div>
                                        <div 
                                            className="px-2 py-1 bg-background border border-border rounded text-[10px] cursor-grab hover:bg-primary/10 hover:border-primary transition-colors flex items-center gap-1 min-w-[65px]"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, url, 'right')}
                                        >
                                            <span className="block w-2 h-2 border-l border-b border-foreground/50" />
                                            Droite
                                        </div>
                                    </div>
                                    {content.includes(url) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const regex = new RegExp(`!\\[[^\\]]*\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
                                                setContent(prev => prev.replace(regex, ''));
                                            }}
                                            className="mt-2 text-[10px] flex items-center gap-1 text-muted-foreground hover:text-red-400 transition-colors"
                                        >
                                            <Eraser className="w-3 h-3" />
                                            Retirer du texte
                                        </button>
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                    title="Supprimer l'image de la médiathèque"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-3 text-[10px] text-muted-foreground">
                    Astuce: Glissez l'un des boutons (Gauche/Centre/Droite) dans le texte pour placer l'image.
                </div>
            </div>

            {/* Generator */}
            <div className="bg-card p-4 rounded-lg border border-border border-yellow-500/10">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-yellow-500">
                    <Wand2 className="w-4 h-4" />
                    Générateur IA
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium block mb-1 text-gray-300">Passage à illustrer</label>
                        <textarea
                            value={genParams.citation}
                            onChange={(e) => setGenParams(prev => ({ ...prev, citation: e.target.value }))}
                            className="w-full p-2 text-sm border border-input rounded bg-muted/20 text-white h-24 placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Copiez ici le passage du texte qui servira d'inspiration..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-medium block mb-1 text-gray-300">Format</label>
                            <select 
                                value={genParams.aspectRatio}
                                onChange={(e) => setGenParams(prev => ({ ...prev, aspectRatio: e.target.value as AspectRatio }))}
                                className="w-full p-1.5 text-xs border border-input rounded bg-muted/20 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            >
                                {ASPECT_RATIO_OPTIONS.map(o => <option key={o.id} value={o.value} className="bg-background text-foreground">{o.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="text-xs font-medium block mb-1 text-gray-300">Style</label>
                            <select 
                                value={genParams.style_family}
                                onChange={(e) => setGenParams(prev => ({ ...prev, style_family: e.target.value }))}
                                className="w-full p-1.5 text-xs border border-input rounded bg-muted/20 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            >
                                {STYLE_FAMILY_OPTIONS.map(o => <option key={o.id} value={o.value} className="bg-background text-foreground">{o.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground italic">
                        Note: Le visuel sera généré sans titre ni auteur visible, optimisé pour l'inclusion dans le texte.
                    </p>

                    <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={isGenerating || !genParams.citation}
                        className="w-full py-2 bg-secondary text-secondary-foreground text-xs font-medium rounded hover:bg-secondary/80 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        Générer
                    </button>

                    {genError && <div className="text-destructive text-xs">{genError}</div>}
                </div>

                {/* Preview */}
                {generatedPreview && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <label className="text-xs font-medium block mb-2 text-gray-300">Aperçu du résultat</label>
                        <div className="relative aspect-video bg-muted rounded overflow-hidden mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={generatedPreview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveImage}
                            disabled={isSavingImage}
                            className="w-full py-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            {isSavingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Ajouter à la bibliothèque
                        </button>
                    </div>
                )}
            </div>

            {/* Tags Section - Moved to Bottom */}
            <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="text-sm font-medium mb-4 flex items-center justify-between text-gray-200">
                    <span>Gestion des thèmes</span>
                </h3>
                 <div className="flex flex-wrap gap-2 mb-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.label)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.label)}
                          className={`px-3 py-1 text-[10px] rounded-full border transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary text-secondary-foreground border-transparent hover:border-border'
                          }`}
                        >
                          {tag.label}
                          {isSelected && <Check className="inline-block w-2 h-2 ml-1" />}
                        </button>
                      )
                    })}
                    {availableTags.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">Aucun tag disponible.</span>
                    )}
                  </div>

                  
                  <div className="pt-4 border-t border-white/10 mt-4">
                      <TagManager title="" />
                  </div>
            </div>
        </div>
        )}
    </div>
  )
}
