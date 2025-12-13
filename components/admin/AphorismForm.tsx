'use client'

import { useState, useEffect } from 'react'
import { createAphorism, updateAphorism } from '@/lib/instant'
import type { Aphorism, AphorismCreate, AphorismUpdate } from '@/types/aphorism'

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
  const [tagsInput, setTagsInput] = useState(aphorism?.tags?.join(', ') || '')
  const [featured, setFeatured] = useState(aphorism?.featured || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form when aphorism changes
  useEffect(() => {
    if (aphorism) {
      setText(aphorism.text)
      setTagsInput(aphorism.tags?.join(', ') || '')
      setFeatured(aphorism.featured)
    } else {
      setText('')
      setTagsInput('')
      setFeatured(false)
    }
    setError(null)
  }, [aphorism])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const formData = {
        text,
        tags,
        featured,
        imageUrl: null,
      }

      if (aphorism) {
        // Update
        await updateAphorism(aphorism.id, formData as AphorismUpdate)
      } else {
        // Create
        await createAphorism(formData as AphorismCreate)
      }

      setText('')
      setTagsInput('')
      setFeatured(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          Aphorism Text *
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          placeholder="Enter the aphorism text..."
          className="w-full p-3 border border-input rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., liberté, amour, sagesse"
          className="w-full p-3 border border-input rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={isLoading}
        />
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
  )
}
