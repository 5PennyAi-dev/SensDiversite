'use client'

import { useState, useEffect, useMemo } from 'react'
import { useReflections, useTags } from '@/lib/instant'
import type { Reflection } from '@/types/reflection'
import type { Tag } from '@/types/tag'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { ArrowRight } from 'lucide-react'

const INITIAL_LOAD_COUNT = 20
const LOAD_MORE_COUNT = 20

export default function ReflectionsPublicPage() {
  const { data, isLoading } = useReflections()
  const { data: tagData } = useTags()

  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT)

  const reflections = data?.reflections as Reflection[] | undefined
  const tags = (tagData?.tags as Tag[] | undefined) || []

  // Filter published reflections
  const publishedReflections = useMemo(() => {
    return reflections?.filter(r => r.published) || []
  }, [reflections])

  // Apply Tag Filter
  const filteredReflections = useMemo(() => {
    return activeTag
      ? publishedReflections.filter(r => r.tags?.includes(activeTag))
      : publishedReflections
  }, [activeTag, publishedReflections])

  // Slice for infinite scroll
  const visibleReflections = useMemo(() => {
    return filteredReflections.slice(0, visibleCount)
  }, [filteredReflections, visibleCount])

  // Reset visible count when tag changes
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT)
  }, [activeTag])

  const loadMore = () => {
    if (visibleCount < filteredReflections.length) {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="pt-16 pb-12 px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-primary/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">
              Textes longs
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight mb-6">
            Réflexions
          </h1>

          <p className="text-lg text-muted-foreground/70 max-w-xl leading-relaxed">
            Une collection de fragments pour penser la complexité du monde.
          </p>
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          className="mb-12 pb-8 border-b border-border/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${
                activeTag === null
                  ? 'border-primary/50 text-primary bg-primary/5'
                  : 'border-border/30 text-muted-foreground/60 hover:border-primary/30 hover:text-foreground'
              }`}
            >
              Tous
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.label ? null : tag.label)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${
                  activeTag === tag.label
                    ? 'border-primary/50 text-primary bg-primary/5'
                    : 'border-border/30 text-muted-foreground/60 hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-card/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredReflections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground/60 font-display text-xl italic">
              {activeTag
                ? `Aucune réflexion pour "${activeTag}"`
                : "Aucune réflexion publiée pour le moment."}
            </p>
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="mt-6 text-[11px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors"
              >
                Voir toutes les réflexions
              </button>
            )}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeTag || "all"}
            >
              {visibleReflections.map((ref) => (
                <motion.div key={ref.id} variants={itemVariants}>
                  <Link href={`/reflexions/${ref.id}`} className="group block h-full">
                    <CineasticCard className="h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
                          {new Date(ref.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                        {ref.tags && ref.tags.length > 0 && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                            <span className="text-[10px] tracking-[0.15em] uppercase text-primary/60">
                              {ref.tags[0]}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-xl md:text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500 line-clamp-2">
                        {ref.title}
                      </h3>

                      <p className="font-body text-sm text-muted-foreground/70 leading-relaxed line-clamp-4 mb-6">
                        {ref.content
                          .replace(/!\[.*?\]\(.*?\)/g, '')
                          .replace(/!left\(.*?\)/g, '')
                          .replace(/!right\(.*?\)/g, '')
                          .replace(/\[.*?\]\(.*?\)/g, '$1')
                          .replace(/[#*`_]/g, '')
                          .trim()
                          .substring(0, 150)}...
                      </p>

                      <div className="mt-auto flex items-center text-[10px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors duration-300">
                        Lire
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CineasticCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Infinite Scroll Sentinel */}
            {visibleCount < filteredReflections.length && (
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
        )}
      </div>
    </main>
  )
}
