'use client'

import { useState } from 'react'
import { AphorismForm } from '@/components/admin/AphorismForm'
import { AphorismList } from '@/components/aphorism/AphorismList'
import { useAphorismes, deleteAphorism } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'

export default function AdminTestPage() {
  const { data } = useAphorismes()
  const [editingId, setEditingId] = useState<string | null>(null)

  const aphorismes = data?.aphorismes as Aphorism[] | undefined
  const editingAphorism = aphorismes?.find((a) => a.id === editingId)

  const handleSuccess = () => {
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteAphorism(id)
      handleSuccess()
    } catch (err) {
      alert('Error deleting: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-serif mb-8">Admin Test Page</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AphorismForm
              aphorism={editingAphorism}
              onSuccess={handleSuccess}
              onCancel={() => setEditingId(null)}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-4">All Aphorismes</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {aphorismes && aphorismes.length > 0 ? (
                  aphorismes.map((aphorism) => (
                    <div
                      key={aphorism.id}
                      className="p-3 bg-background rounded border border-border hover:border-ring transition-colors"
                    >
                      <p className="font-serif text-sm mb-2">{aphorism.text}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {aphorism.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {aphorism.featured && (
                          <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        <button
                          onClick={() => setEditingId(aphorism.id)}
                          className="px-2 py-0.5 bg-primary text-primary-foreground rounded hover:opacity-90"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(aphorism.id)}
                          className="px-2 py-0.5 bg-destructive text-destructive-foreground rounded hover:opacity-90"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No aphorismes yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
