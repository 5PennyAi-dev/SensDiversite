'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Lightbox } from '@/components/gallery/Lightbox'
import type { Aphorism } from '@/types/aphorism'

const INITIAL_LOAD_COUNT = 20
const LOAD_MORE_COUNT = 20

export default function GalleryPage() {
  const { data, isLoading } = useAphorismes()
  const [selectedAphorism, setSelectedAphorism] = useState<Aphorism | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT)

  const aphorismes = (data?.aphorismes ?? []) as Aphorism[]

  // Filter aphorismes with images
  const aphorismsWithImages = useMemo(() => {
    return aphorismes.filter((a) => a.imageUrl)
  }, [aphorismes])

  // Get unique tags from aphorismes with images
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    aphorismsWithImages.forEach((a) => {
      a.tags.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [aphorismsWithImages])

  // Filter by selected tag
  const displayedAphorismes = useMemo(() => {
    if (!selectedTag) return aphorismsWithImages
    return aphorismsWithImages.filter((a) => a.tags.includes(selectedTag))
  }, [aphorismsWithImages, selectedTag])

  // Slice displayed aphorismes for infinite scroll
  const visibleAphorismes = useMemo(() => {
    return displayedAphorismes.slice(0, visibleCount)
  }, [displayedAphorismes, visibleCount])

  // Reset visible count when tag changes
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT)
  }, [selectedTag])

  const handleSelectAphorism = (aphorism: Aphorism) => {
    setSelectedAphorism(aphorism)
  }

  const handleNavigate = (aphorism: Aphorism) => {
    setSelectedAphorism(aphorism)
  }

  const loadMore = () => {
    if (visibleCount < displayedAphorismes.length) {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-card rounded w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-card rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-primary/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">
              Galerie visuelle
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight mb-6">
            Aphorismes
          </h1>

          <p className="text-lg text-muted-foreground/70 max-w-xl leading-relaxed">
            <span className="text-primary">{displayedAphorismes.length}</span> fragments visuels à explorer.
          </p>
        </motion.div>

        {/* Tag filter */}
        {availableTags.length > 0 && (
          <motion.div
            className="mb-12 pb-8 border-b border-border/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${
                  selectedTag === null
                    ? 'border-primary/50 text-primary bg-primary/5'
                    : 'border-border/30 text-muted-foreground/60 hover:border-primary/30 hover:text-foreground'
                }`}
              >
                Tous
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${
                    selectedTag === tag
                      ? 'border-primary/50 text-primary bg-primary/5'
                      : 'border-border/30 text-muted-foreground/60 hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery grid */}
        {visibleAphorismes.length > 0 ? (
          <>
            <GalleryGrid
              aphorismes={visibleAphorismes}
              onSelectAphorism={handleSelectAphorism}
            />
            
            {/* Infinite Scroll Sentinel */}
            {visibleCount < displayedAphorismes.length && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                onViewportEnter={loadMore}
                className="w-full py-12 flex justify-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-muted-foreground/60 font-display text-xl italic">
              Aucune image pour "{selectedTag}"
            </p>
            <button
              onClick={() => setSelectedTag(null)}
              className="mt-6 text-[11px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors"
            >
              Voir tous les thèmes
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox modal */}
      <Lightbox
        aphorism={selectedAphorism}
        aphorismes={displayedAphorismes}
        onClose={() => setSelectedAphorism(null)}
        onNavigate={handleNavigate}
      />
    </main>
  )
}
