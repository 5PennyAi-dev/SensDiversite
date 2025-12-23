'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { AphorismCard } from '@/components/aphorism/AphorismCard'
import type { Aphorism } from '@/types/aphorism'

interface ThemePageProps {
  params: {
    slug: string
  }
}

export default function ThemePage({ params }: ThemePageProps) {
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase()
  const { data } = useAphorismes()
  const [displayCount, setDisplayCount] = useState(10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const allAphorismes = (data?.aphorismes as Aphorism[] | undefined) ?? []

  const isAll = decodedSlug === 'all'
  const filteredAphorismes = isAll
    ? allAphorismes
    : allAphorismes.filter(aphorism =>
      aphorism.tags.some((tag: string) => tag.toLowerCase() === decodedSlug)
    )

  const displayedAphorismes = filteredAphorismes.slice(0, displayCount)
  const hasMore = displayCount < filteredAphorismes.length

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
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  }

  const capitalizedTag = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Retour</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-primary/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">
              {isAll ? 'Collection complète' : 'Filtré par thème'}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mb-4">
            {isAll ? 'Tous les fragments' : capitalizedTag}
          </h1>

          <p className="text-muted-foreground/60 text-sm">
            {filteredAphorismes.length} fragment{filteredAphorismes.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Empty state */}
        {filteredAphorismes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-muted-foreground/60 italic font-display text-xl mb-6">
              Aucun aphorisme trouvé.
            </p>
            <Link
              href="/galerie"
              className="text-[11px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors"
            >
              Voir tous les aphorismes
            </Link>
          </motion.div>
        ) : (
          <>
            {/* List */}
            <motion.div
              className="space-y-6"
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
              <div ref={sentinelRef} className="py-16 flex justify-center">
                {isLoadingMore && (
                  <div className="flex items-center gap-3 text-muted-foreground/50">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[10px] tracking-[0.2em] uppercase">Chargement</span>
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
