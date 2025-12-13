'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAphorismesByTag } from '@/lib/instant'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface ThemePageProps {
  params: {
    slug: string
  }
}

export default function ThemePage({ params }: ThemePageProps) {
  const decodedSlug = decodeURIComponent(params.slug).toLowerCase()
  const { data } = useAphorismesByTag(decodedSlug)
  const [displayCount, setDisplayCount] = useState(10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const allAphorismes = data?.aphorismes ?? []
  const displayedAphorismes = allAphorismes.slice(0, displayCount)
  const hasMore = displayCount < allAphorismes.length

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true)
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 10, allAphorismes.length))
            setIsLoadingMore(false)
          }, 300)
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [hasMore, isLoadingMore, allAphorismes.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (idx: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: idx * 0.05 }
    })
  }

  const capitalizedTag = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)

  return (
    <main className="min-h-screen bg-background py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tous les thèmes</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-4xl lg:text-5xl mb-2">{capitalizedTag}</h1>
            <p className="text-lg text-muted-foreground">
              {allAphorismes.length} aphorisme{allAphorismes.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>

        {/* Empty state */}
        {allAphorismes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg mb-6">
              Aucun aphorisme trouvé pour le thème "{capitalizedTag}"
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Retour à l'accueil
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Aphorisms list with stagger animation */}
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedAphorismes.map((aphorism) => (
                <motion.article
                  key={aphorism.id}
                  variants={itemVariants}
                  className="overflow-hidden bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  {aphorism.imageUrl && (
                    <div className="relative w-full h-56">
                      <Image
                        src={aphorism.imageUrl}
                        alt={aphorism.text.substring(0, 100)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                  )}

                  {/* Text content */}
                  <div className="p-6">
                    <blockquote className="font-serif text-lg leading-relaxed mb-4 text-foreground">
                      "{aphorism.text}"
                    </blockquote>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {aphorism.tags.map((tag: string) => (
                        <Link key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                          <span className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer">
                            {tag}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground">
                      {new Date(aphorism.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Lazy loading sentinel & loading indicator */}
            {hasMore && (
              <div ref={sentinelRef} className="py-12 flex justify-center">
                {isLoadingMore ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Chargement...</span>
                  </motion.div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Faites défiler pour charger plus d'aphorismes
                  </p>
                )}
              </div>
            )}

            {/* All loaded message */}
            {!hasMore && displayedAphorismes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-sm text-muted-foreground">
                  Vous avez consulté tous les aphorismes pour le thème "{capitalizedTag}"
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
