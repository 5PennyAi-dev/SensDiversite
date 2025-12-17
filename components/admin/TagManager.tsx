'use client'

import { useState } from 'react'
import { useTags, createTag, deleteTag } from '@/lib/instant'
import { Tag } from '@/types/tag'
import { Plus, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface TagManagerProps {
  title?: string
}

export function TagManager({ title = "Gestion des thèmes" }: TagManagerProps) {
  const { data, isLoading } = useTags()
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isListOpen, setIsListOpen] = useState(false)

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
        <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
      </div>

      <form onSubmit={handleAddTag} className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Nouveau thème..."
          className="flex-1 px-3 py-2 border border-input rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
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

      <div className="relative">
        <button
            type="button"
            onClick={() => setIsListOpen(!isListOpen)}
            className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors w-full justify-between p-2 border border-input rounded-sm bg-background/50"
        >
            <span>Voir les {tags?.length || 0} tags existants</span>
            {isListOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isListOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-card border border-border rounded-sm shadow-xl max-h-60 overflow-y-auto">
                {tags && tags.length > 0 ? (
                    <div className="divide-y divide-border">
                        {tags.map((tag) => (
                            <div key={tag.id} className="flex items-center justify-between p-2.5 hover:bg-muted/50 transition-colors group text-sm">
                                <span className="font-medium text-foreground">{tag.label}</span>
                                <button
                                    onClick={() => handleDeleteTag(tag.id, tag.label)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                    title="Supprimer le tag"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                        Aucun tag créé.
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  )
}
