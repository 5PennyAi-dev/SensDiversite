'use client'

import { useReflections, deleteReflection } from '@/lib/instant'
import type { Reflection } from '@/types/reflection'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function ReflectionsPage() {
  const { data, isLoading } = useReflections()
  
  const reflections = data?.reflections as Reflection[] | undefined

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réflexion ?")) {
        await deleteReflection(id)
    }
  }

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
                <h1 className="text-3xl font-serif">Réflexions</h1>
                <p className="text-muted-foreground mt-1">Articles longs et pensées approfondies</p>
            </div>
            <Link 
                href="/admin/reflections/nouveau"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:opacity-90"
            >
                <Plus className="w-4 h-4" />
                Nouvelle Réflexion
            </Link>
        </div>

        <div className="grid gap-4">
            {reflections && reflections.length > 0 ? (
                reflections.map((ref) => (
                    <div key={ref.id} className="bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border rounded-lg hover:border-primary/20 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-serif font-medium">{ref.title}</h3>
                                {(ref.published === false) && (
                                    <span className="text-[10px] uppercase bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">Brouillon</span>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2 font-mono">
                                {ref.slug}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <Link 
                                href={`/admin/reflections/edit/${ref.id}`}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded"
                                title="Modifier"
                             >
                                <Pencil className="w-4 h-4" />
                             </Link>
                             <button
                                onClick={() => handleDelete(ref.id)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded"
                                title="Supprimer"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground mb-4">Aucune réflexion publiée.</p>
                    <Link 
                        href="/admin/reflections/nouveau"
                        className="text-primary hover:underline font-medium"
                    >
                        Créer la première
                    </Link>
                </div>
            )}
        </div>
    </div>
  )
}
