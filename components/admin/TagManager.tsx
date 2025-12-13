'use client'

import { useState } from 'react'
import { useTags, createTag, deleteTag } from '@/lib/instant'
import { Tag } from '@/types/tag'
import { Plus, X, Loader2 } from 'lucide-react'

export function TagManager() {
  const { data, isLoading } = useTags()
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tags = data?.tags as Tag[] | undefined

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return

    setIsSubmitting(true)
    try {
      await createTag(newTag.trim())
      setNewTag('')
    } catch (err) {
      console.error('Failed to create tag', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTag = async (id: string, label: string) => {
    if (!confirm(`Delete tag "${label}"? This will not remove it from existing aphorisms.`)) return
    try {
      await deleteTag(id)
    } catch (err) {
      console.error('Failed to delete tag', err)
    }
  }

  if (isLoading) {
    return <div className="py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium">Manage Tags</h3>
      </div>

      <form onSubmit={handleAddTag} className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag label..."
          className="flex-1 px-3 py-2 border border-input rounded-sm bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!newTag.trim() || isSubmitting}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-transparent hover:border-border transition-colors"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => handleDeleteTag(tag.id, tag.label)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all"
                title="Delete tag"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No tags created yet.</p>
        )}
      </div>
    </div>
  )
}
