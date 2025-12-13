'use client'

import { useAphorismes } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'

export function AphorismList() {
  const { data, isLoading, error } = useAphorismes()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-muted rounded-lg h-32"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
        Error loading aphorismes: {error.message}
      </div>
    )
  }

  const aphorismes = data?.aphorismes as Aphorism[] | undefined

  if (!aphorismes || aphorismes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No aphorismes yet. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {aphorismes.map((aphorism) => (
        <div
          key={aphorism.id}
          className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
        >
          <p className="font-serif text-lg mb-3 text-foreground">
            {aphorism.text}
          </p>
          {aphorism.tags && aphorism.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aphorism.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {aphorism.featured && (
            <div className="mt-3 text-xs font-semibold text-accent-foreground bg-accent px-2 py-1 w-fit rounded">
              Featured
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
