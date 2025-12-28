'use client'

import { useState } from 'react'
import { UnifiedAphorismEditor } from '@/components/admin/UnifiedAphorismEditor'
import { TagManager } from '@/components/admin/TagManager'
import { useAphorismes, deleteAphorism } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'
import { Pencil, Trash2, Plus, LayoutGrid } from 'lucide-react'

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
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      {/* Left Column: Collection & Tools (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="font-serif text-xl flex items-center gap-2 text-foreground">
            <LayoutGrid className="w-5 h-5" />
            Aphorismes
            <span className="text-sm font-sans text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {aphorismes?.length || 0}
            </span>
          </h2>
          <button
              onClick={() => setEditingId(null)}
              className="text-xs uppercase tracking-widest font-bold text-primary hover:text-primary/80 flex items-center gap-1 border border-primary/20 px-3 py-1.5 rounded-sm bg-primary/5 transition-colors"
          >
              <Plus className="w-3 h-3" /> Nouveau
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
          {aphorismes && aphorismes.length > 0 ? (
            aphorismes.map((aphorism) => (
              <div
                key={aphorism.id}
                onClick={() => setEditingId(aphorism.id)}
                className={`group cursor-pointer p-4 rounded-sm border transition-all duration-200 ${
                    editingId === aphorism.id 
                    ? 'bg-primary/5 border-primary shadow-sm' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex gap-3">
                  {aphorism.imageUrl ? (
                    <div className="w-12 h-12 relative flex-shrink-0 rounded-sm overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={aphorism.imageUrl} 
                        alt="Thumb" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-sm flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground font-serif">
                        Aa
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-serif text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                          {aphorism.text}
                        </p>
                        {aphorism.featured && (
                          <span className="shrink-0 text-yellow-500" title="Featured">
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-foreground/70 truncate">
                              {aphorism.title || "Sans titre"}
                          </p>
                          <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(aphorism.id)
                            }}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Supprimer"
                          >
                             <Trash2 className="w-3 h-3" />
                          </button>
                      </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-sm">
                <p className="text-muted-foreground italic text-sm">Votre collection est vide.</p>
            </div>
          )}
        </div>

        {/* Tag Manager Footer - MOVED */}
      </div>

      {/* Right Column: Unified Editor (70%) */}
      <div className="lg:col-span-8 h-full flex flex-col min-h-0 gap-6">
         <div className="flex-1 min-h-0">
             <UnifiedAphorismEditor
                key={editingId || 'new'} // Force remount on id change
                aphorism={editingAphorism}
                onSuccess={handleSuccess}
                onCancel={() => setEditingId(null)}
             />
         </div>
         
         <div className="bg-card p-4 rounded-sm border border-border/50 shrink-0">
             <TagManager />
         </div>
      </div>
    </div>
  )
}
