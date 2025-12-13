'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAphorismes } from '@/lib/instant'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { PaperCard } from '@/components/ui/PaperCard'
import { TagPill } from '@/components/ui/TagPill'
import { AphorismCard } from '@/components/aphorism/AphorismCard'
import type { Aphorism } from '@/types/aphorism'

interface ThemePageProps {
  params: {
    slug: string
  }
}

export default function ThemePage({ params }: ThemePageProps) {
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase()
  const { data } = useAphorismes() // Fetch all to filter locally (case insensitive)
  const [displayCount, setDisplayCount] = useState(10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const allAphorismes = (data?.aphorismes as Aphorism[] | undefined) ?? []
  
  // Filter client-side to handle case sensitivity (e.g. "Amour" in DB vs "amour" in URL)
  // If slug is 'all', show everything.
  const isAll = decodedSlug === 'all'
  const filteredAphorismes = isAll 
    ? allAphorismes 
    : allAphorismes.filter(aphorism => 
        aphorism.tags.some((tag: string) => tag.toLowerCase() === decodedSlug)
      )

  const displayedAphorismes = filteredAphorismes.slice(0, displayCount)
  const hasMore = displayCount < filteredAphorismes.length

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true)
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 10, filteredAphorismes.length))
            setIsLoadingMore(false)
          }, 300)
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, filteredAphorismes.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const capitalizedTag = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)

  return (
    <main className="min-h-screen bg-[var(--paper)] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--accent)] mb-8 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            <span>Tous les thèmes</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-[var(--accent)] font-serif italic text-lg">{isAll ? 'Collection complète' : 'Filtré par'}</span>
            <div className="inline-block px-6 py-2 border border-[var(--accent)] rounded-full text-[var(--accent)] font-serif text-3xl sm:text-4xl bg-[var(--paper-2)]">
               {isAll ? 'Tous les fragments' : capitalizedTag}
            </div>
            <p className="text-[var(--muted-foreground)] text-sm tracking-wide mt-2">
              {filteredAphorismes.length} fragment{filteredAphorismes.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>

        {/* Empty state */}
        {filteredAphorismes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--muted-foreground)] italic font-serif text-xl mb-6">
              Aucun aphorisme trouvé.
            </p>
          </div>
        ) : (
          <>
            {/* List */}
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedAphorismes.map((aphorism) => (
                <motion.div key={aphorism.id} variants={itemVariants}>
                  <AphorismCard aphorism={aphorism} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            {hasMore && (
              <div ref={sentinelRef} className="py-12 flex justify-center">
                {isLoadingMore && (
                   <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     <span className="text-xs uppercase tracking-widest">Chargement...</span>
                   </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
