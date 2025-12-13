'use client'

import { useState } from 'react'
import { AphorismForm } from '@/components/admin/AphorismForm'
import { TagManager } from '@/components/admin/TagManager'
import { useAphorismes, deleteAphorism } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const { data } = useAphorismes()
  const [editingId, setEditingId] = useState<string | null>(null)

  const aphorismes = data?.aphorismes as Aphorism[] | undefined
  const editingAphorism = aphorismes?.find((a) => a.id === editingId)

  const handleSuccess = () => {
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this aphorism?')) return
    try {
      await deleteAphorism(id)
      handleSuccess()
    } catch (err) {
      alert('Error deleting: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* List Column */}
      <div className="lg:col-span-7 space-y-8">
        <h2 className="font-serif text-2xl border-b border-border pb-4">
          Collection ({aphorismes?.length || 0})
        </h2>
        
        <div className="space-y-4">
          {aphorismes && aphorismes.length > 0 ? (
            aphorismes.map((aphorism) => (
              <div
                key={aphorism.id}
                className="group relative p-6 bg-card rounded-sm border border-transparent hover:border-border transition-all duration-300 hover:shadow-sm"
              >
                <p className="font-serif text-lg mb-4 text-foreground/90 leading-relaxed">
                  {aphorism.text.substring(0, 150)}
                  {aphorism.text.length > 150 && "..."}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {aphorism.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {aphorism.featured && (
                      <span className="text-[10px] uppercase tracking-widest text-primary/80 bg-primary/5 px-2 py-1 rounded-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(aphorism.id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-sm transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(aphorism.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-12 italic font-serif">
              No aphorismes yet. Create your first one.
            </p>
          )}
        </div>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-8">
          <div className="bg-card p-8 rounded-sm border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">
                {editingId ? 'Edit Aphorism' : 'New Aphorism'}
              </h2>
              {editingId && (
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              )}
            </div>
            
            <AphorismForm
              aphorism={editingAphorism}
              onSuccess={handleSuccess}
              onCancel={() => setEditingId(null)}
            />
          </div>

          <div className="bg-card p-8 rounded-sm border border-border/50 shadow-sm">
            <TagManager />
          </div>
        </div>
      </div>
    </div>
  )
}
