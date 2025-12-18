'use client'

import { useState } from 'react'
import { useReflections, useTags } from '@/lib/instant'
import type { Reflection } from '@/types/reflection'
import type { Tag } from '@/types/tag'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CineasticCard } from '@/components/ui/CineasticCard'

export default function ReflectionsPublicPage() {
  const { data, isLoading } = useReflections()
  const { data: tagData } = useTags()
  
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const reflections = data?.reflections as Reflection[] | undefined
  const tags = (tagData?.tags as Tag[] | undefined) || []

  // Filter published reflections
  const publishedReflections = reflections?.filter(r => r.published) || []

  // Apply Tag Filter
  const filteredReflections = activeTag 
    ? publishedReflections.filter(r => r.tags?.includes(activeTag))
    : publishedReflections

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="pt-12 lg:pt-16 pb-12 px-6 sm:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 relative"
          >
             <h1 className="font-serif text-6xl lg:text-7xl mb-6 text-foreground relative z-10">
                Réflexions
             </h1>
             <div className="w-24 h-1 bg-primary/30 mx-auto mb-6 rounded-full" />
             <p className="max-w-xl mx-auto text-muted-foreground font-light font-serif text-lg leading-relaxed relative z-10">
                Une collection de fragments pour penser la complexité du monde.
             </p>
             
             {/* Subtle background element */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>

          {/* Tag Filter Bar */}
          <div className="mb-16 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-hide">
              <div className="flex justify-center min-w-max space-x-3">
                  <button
                      onClick={() => setActiveTag(null)}
                      className={`px-5 py-2 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 border ${
                          activeTag === null
                              ? 'border-primary text-primary bg-primary/5 shadow-[0_0_15px_-5px_theme(colors.primary)]'
                              : 'border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-white/5'
                      }`}
                  >
                      Tous
                  </button>
                  {tags.map(tag => (
                      <button
                          key={tag.id}
                          onClick={() => setActiveTag(activeTag === tag.label ? null : tag.label)}
                          className={`px-5 py-2 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
                              activeTag === tag.label
                                  ? 'border-primary text-primary bg-primary/5 shadow-[0_0_15px_-5px_theme(colors.primary)]'
                                  : 'border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-white/5'
                          }`}
                      >
                          #{tag.label}
                      </button>
                  ))}
              </div>
          </div>

          {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3].map(i => (
                      <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl" />
                  ))}
              </div>
          ) : filteredReflections.length === 0 ? (
              <div className="text-center py-24 border border-white/5 rounded-xl bg-white/5">
                  <p className="text-muted-foreground italic font-serif text-xl">
                      {activeTag 
                        ? `Aucune réflexion pour le tag #${activeTag}`
                        : "Aucune réflexion publiée pour le moment."}
                  </p>
                  {activeTag && (
                      <button 
                        onClick={() => setActiveTag(null)}
                        className="mt-4 text-sm text-primary hover:underline"
                      >
                        Voir toutes les réflexions
                      </button>
                  )}
              </div>
          ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeTag || "all"} // Force re-animation on filter change
              >
                  {filteredReflections.map((ref) => (
                      <motion.div key={ref.id} variants={itemVariants}>
                          <Link href={`/reflexions/${ref.id}`} className="group block h-full">
                              <CineasticCard className="h-full flex flex-col hover:border-primary/30 transition-colors">
                                  <div className="mb-6">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-primary/70 uppercase tracking-widest block">
                                            {new Date(ref.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long', 
                                                day: 'numeric'
                                            })}
                                        </span>
                                        {/* Display first tag as categorization hint */}
                                        {ref.tags && ref.tags.length > 0 && (
                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-muted-foreground uppercase tracking-wider">
                                                #{ref.tags[0]}
                                            </span>
                                        )}
                                      </div>
                                      <h3 className="font-serif text-2xl text-foreground font-medium group-hover:text-primary transition-colors mb-4 line-clamp-2">
                                          {ref.title}
                                      </h3>
                                      <p className="text-muted-foreground line-clamp-4 font-serif leading-relaxed">
                                          {/* Simple way to get excerpt from markdown: remove special chars or just take substring */}
                                          {ref.content
                                              .replace(/!\[.*?\]\(.*?\)/g, '') // Remove standard markdown images
                                              .replace(/!left\(.*?\)/g, '')    // Remove custom !left() images
                                              .replace(/!right\(.*?\)/g, '')   // Remove custom !right() images
                                              .replace(/\[.*?\]\(.*?\)/g, '$1') // Remove links but keep text
                                              .replace(/[#*`_]/g, '')           // Remove formatting chars
                                              .trim()
                                              .substring(0, 150)}...
                                      </p>
                                  </div>
                                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                                      <span className="text-primary uppercase tracking-widest text-xs font-bold group-hover:underline">Lire la suite</span>
                                  </div>
                              </CineasticCard>
                          </Link>
                      </motion.div>
                  ))}
              </motion.div>
          )}
        </div>
    </main>
  )
}
