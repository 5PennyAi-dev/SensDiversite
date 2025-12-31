'use client'

import { useAphorismes } from '@/lib/instant'
import { AphorismCard } from '@/components/aphorism/AphorismCard'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Aphorism } from '@/types/aphorism'
import { useEffect, useState } from 'react'

export function AphorismView({ id }: { id: string }) {
  // We can't easily query by ID directly with the current hooks if they don't support it, 
  // but useAphorismes fetches all. 
  // Let's modify lib/instant.ts later to add useAphorism(id), or just find it here.
  // Actually, for a single item, fetching all is inefficient but acceptable for MVP if dataset is small.
  // Ideally we implemented useAphorism(id) in the plan? No, but I can add it.
  
  // Actually, I can use a direct query here or correct the hook usage.
  // Let's assume for now I'll filter from all.
  const { data, isLoading } = useAphorismes()
  const aphorism = data?.aphorismes?.find((a: any) => a.id === id) as Aphorism | undefined

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!aphorism) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-xl font-serif">Aphorisme introuvable</p>
        <Link href="/" className="text-primary hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <AphorismCard aphorism={aphorism} />
    </div>
  )
}
