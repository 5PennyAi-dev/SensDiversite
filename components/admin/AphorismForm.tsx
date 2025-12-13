'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createAphorism, updateAphorism, useTags } from '@/lib/instant'
import type { Aphorism, AphorismCreate, AphorismUpdate } from '@/types/aphorism'
import type { Tag } from '@/types/tag'
import { Check, X } from 'lucide-react'

interface AphorismFormProps {
  aphorism?: Aphorism
  onSuccess?: () => void
  onCancel?: () => void
}

export function AphorismForm({
  aphorism,
  onSuccess,
  onCancel,
}: AphorismFormProps) {
  const [text, setText] = useState(aphorism?.text || '')
  const [title, setTitle] = useState(aphorism?.title || '')
  // Store selected tag labels as strings to match Aphorism type
  const [selectedTags, setSelectedTags] = useState<string[]>(aphorism?.tags || [])
  const [featured, setFeatured] = useState(aphorism?.featured || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available tags
  const { data: tagData } = useTags()
  const availableTags = (tagData?.tags as Tag[] | undefined) || []

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(aphorism?.imageUrl || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Preview state
  const [showPreview, setShowPreview] = useState(false)

  // Update form when aphorism changes
  useEffect(() => {
    if (aphorism) {
      setText(aphorism.text)
      setTitle(aphorism.title || '')
      setSelectedTags(aphorism.tags || [])
      setFeatured(aphorism.featured)
      setImagePreview(aphorism.imageUrl || null)
    } else {
      setText('')
      setTitle('')
      setSelectedTags([])
      setFeatured(false)
      setImagePreview(null)
    }
    setImageFile(null)
    setError(null)
    setUploadError(null)
  }, [aphorism])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format invalide. Utilisez JPEG, PNG ou WebP.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux. Maximum 5MB.')
      return
    }

    setImageFile(file)
    setUploadError(null)

    // Create local preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview // Keep existing URL if no new file

    setIsUploadingImage(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du téléchargement')
      }

      const { url } = await response.json()
      return url
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur de téléchargement')
      return null
    } finally {
      setIsUploadingImage(false)
    }
  }

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : [...prev, label]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Upload image first if there's a new file
      let finalImageUrl = imagePreview
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          throw new Error('Échec du téléchargement de l\'image')
        }
        finalImageUrl = uploadedUrl
      }

      const formData = {
        text,
        title: title.trim() || undefined,
        tags: selectedTags,
        featured,
        imageUrl: finalImageUrl,
      }

      if (aphorism) {
        // Update
        await updateAphorism(aphorism.id, formData as AphorismUpdate)
      } else {
        // Create
        await createAphorism(formData as AphorismCreate)
      }

      // Reset form
      setText('')
      setTitle('')
      setSelectedTags([])
      setFeatured(false)
      setImageFile(null)
      setImagePreview(null)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold">
          {aphorism ? 'Edit Aphorism' : 'Create New Aphorism'}
        </h2>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Titre (optionnel)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: La Nature..."
            className="w-full p-3 border border-input rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Aphorism Text *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="Enter the aphorism text..."
            className="w-full p-3 border border-input rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={15}
            maxLength={50000}
            disabled={isLoading}
          />
          <div className="text-right text-xs text-muted-foreground mt-1">
            {text.length}/50000 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2 p-3 border border-input rounded bg-background min-h-[42px]">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.label)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.label)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-transparent hover:border-border'
                  }`}
                >
                  {tag.label}
                  {isSelected && <Check className="inline-block w-3 h-3 ml-1" />}
                </button>
              )
            })}
            {availableTags.length === 0 && (
              <span className="text-sm text-muted-foreground italic">
                No tags available. Create tags in the Tag Manager below.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Select tags from the list. Manage tags in the dashboard.
          </p>
        </div>

        {/* Image upload section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Image (optionnelle)
          </label>

          {/* File input */}
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-input rounded bg-background hover:bg-muted/50 transition-colors">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : 'Choisir une image'}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isLoading || isUploadingImage}
                className="sr-only"
              />
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                }}
                disabled={isLoading || isUploadingImage}
                className="px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>

          {/* Upload progress */}
          {isUploadingImage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Téléchargement en cours...</span>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {uploadError}
            </div>
          )}

          {/* Image preview */}
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted border border-border">
              <Image
                src={imagePreview}
                alt="Aperçu"
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Format: JPEG, PNG ou WebP • Taille max: 5MB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border border-input"
            disabled={isLoading}
          />
          <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
            Featured (show in hero section)
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            disabled={!text.trim()}
            className="px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
          </button>
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading
              ? 'Saving...'
              : aphorism
                ? 'Update'
                : 'Create'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-muted text-muted-foreground rounded font-medium hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && text.trim() && (
        <div className="mt-6 p-6 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-sm font-medium mb-4 text-muted-foreground">APERÇU</h3>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {imagePreview && (
              <div className="relative w-full h-64">
                <Image
                  src={imagePreview}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                  sizes="600px"
                />
                {/* Text overlay like in hero */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex flex-col items-center justify-center p-6 text-center">
                  {title && (
                    <h4 className="font-serif text-xl sm:text-2xl text-white/90 mb-3 font-medium drop-shadow-md">
                      {title}
                    </h4>
                  )}
                  <p className="font-serif text-2xl text-white drop-shadow-lg">
                    {text}
                  </p>
                </div>
              </div>
            )}

            {!imagePreview && (
              <div className="p-6">
                {title && (
                  <h4 className="font-serif text-lg text-[var(--accent)] font-medium mb-3">
                    {title}
                  </h4>
                )}
                <p className="font-serif text-xl text-foreground leading-relaxed mb-4">
                  {text}
                </p>
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="p-4 border-t border-border flex flex-wrap gap-2">
                {selectedTags.map((tag, idx) => {
                  const trimmed = tag.trim()
                  return trimmed ? (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                    >
                      {trimmed}
                    </span>
                  ) : null
                })}
              </div>
            )}

            {featured && (
              <div className="px-4 pb-4">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs rounded-full">
                  <span>⭐</span> Featured
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
