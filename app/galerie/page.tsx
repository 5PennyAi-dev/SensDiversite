'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Lightbox } from '@/components/gallery/Lightbox'
import type { Aphorism } from '@/types/aphorism'

export default function GalleryPage() {
  const { data, isLoading } = useAphorismes()
  const [selectedAphorism, setSelectedAphorism] = useState<Aphorism | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const aphorismes = data?.aphorismes ?? []

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

  const handleSelectAphorism = (aphorism: Aphorism) => {
    setSelectedAphorism(aphorism)
  }

  const handleNavigate = (aphorism: Aphorism) => {
    setSelectedAphorism(aphorism)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-serif text-5xl lg:text-6xl mb-4">Galerie Visuelle</h1>
          <p className="text-lg text-muted-foreground">
            {displayedAphorismes.length} image{displayedAphorismes.length !== 1 ? 's' : ''} découvertes
          </p>
        </motion.div>

        {/* Tag filter */}
        {availableTags.length > 0 && (
          <motion.div
            className="mb-12 pb-8 border-b border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Tous les thèmes
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery grid */}
        {displayedAphorismes.length > 0 ? (
          <GalleryGrid
            aphorismes={displayedAphorismes}
            onSelectAphorism={handleSelectAphorism}
          />
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-muted-foreground text-lg">
              Aucune image trouvée pour le thème "{selectedTag}"
            </p>
            <button
              onClick={() => setSelectedTag(null)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
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
