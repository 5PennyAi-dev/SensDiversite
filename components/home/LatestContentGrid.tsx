'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAphorismes, useReflections } from '@/lib/instant'
import { AphorismCard } from '@/components/aphorism/AphorismCard'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

// Define a unified interface for display
interface ContentItem {
  type: 'aphorism' | 'reflection'
  id: string
  title?: string
  content: string // text for aphorism, excerpt/content for reflection
  tags: string[]
  date: number
  imageUrl?: string | null
}

import { motion, AnimatePresence } from 'framer-motion'

export function LatestContentGrid() {
  const { data: aphorismData } = useAphorismes()
  const { data: reflectionData } = useReflections()

  const [aphorismPage, setAphorismPage] = useState(0)
  const [reflectionPage, setReflectionPage] = useState(0)
  // 1 for right (next), -1 for left (prev)
  const [aphorismDirection, setAphorismDirection] = useState(0)
  const [reflectionDirection, setReflectionDirection] = useState(0)
  
  const ITEMS_PER_PAGE = 6

  const { latestAphorisms, latestReflections } = useMemo(() => {
    const aphorisms = (aphorismData?.aphorismes ?? []).map((a: any) => ({
      type: 'aphorism' as const,
      id: a.id,
      title: a.title,
      content: a.text,
      tags: a.tags || [],
      date: a.createdAt,
      imageUrl: a.imageUrl
    })).sort((a: any, b: any) => b.date - a.date).slice(0, 24)
    
    // Filter only published reflections
    const reflections = (reflectionData?.reflections ?? [])
        .filter((r: any) => r.published)
        .map((r: any) => ({
            type: 'reflection' as const,
            id: r.id,
            title: r.title,
            content: r.content, // We will truncate this
            tags: r.tags || [],
            date: r.createdAt,
            imageUrl: null // Reflections might have images embedded but for now we focus on text/title
        }))
        .sort((a: any, b: any) => b.date - a.date)
        .slice(0, 24)

    return { latestAphorisms: aphorisms, latestReflections: reflections }
  }, [aphorismData, reflectionData])

  if (!latestAphorisms.length && !latestReflections.length) {
    return null
  }

  const handlePageChange = (
    newPage: number, 
    currentPage: number, 
    setPage: (p: number) => void, 
    setDirection: (d: number) => void
  ) => {
    setDirection(newPage > currentPage ? 1 : -1)
    setPage(newPage)
  }

  const PaginationControls = ({ 
    currentPage, 
    totalItems, 
    setPage, 
    setDirection,
    itemsPerPage 
  }: { 
    currentPage: number, 
    totalItems: number, 
    setPage: (p: number) => void,
    setDirection: (d: number) => void,
    itemsPerPage: number
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (totalPages <= 1) return null

    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-0 -mx-4 sm:-mx-12 z-10">
        <button 
          onClick={() => handlePageChange(Math.max(0, currentPage - 1), currentPage, setPage, setDirection)}
          disabled={currentPage === 0}
          className="pointer-events-auto p-2 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1), currentPage, setPage, setDirection)}
          disabled={currentPage >= totalPages - 1}
          className="pointer-events-auto p-2 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    )
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-24">
        
        {/* Aphorismes Section */}
        {latestAphorisms.length > 0 && (
          <div className="relative group/section">
            <h2 className="font-display text-4xl text-center mb-12 text-foreground">
                Aphorismes
            </h2>
            
            <div className="relative">
                <div className="min-h-[400px]">
                    <AnimatePresence initial={false} custom={aphorismDirection} mode="wait">
                        <motion.div
                            key={aphorismPage}
                            custom={aphorismDirection}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                        >
                            {latestAphorisms
                                .slice(aphorismPage * ITEMS_PER_PAGE, (aphorismPage + 1) * ITEMS_PER_PAGE)
                                .map((item: any) => (
                                <div key={`${item.type}-${item.id}`} className="break-inside-avoid">
                                <AphorismCard aphorism={{
                                    id: item.id,
                                    text: item.content,
                                    title: item.title,
                                    tags: item.tags,
                                    imageUrl: item.imageUrl || null,
                                    featured: false,
                                    createdAt: item.date,
                                    updatedAt: item.date
                                }} />
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <PaginationControls 
                    currentPage={aphorismPage}
                    totalItems={latestAphorisms.length}
                    setPage={setAphorismPage}
                    setDirection={setAphorismDirection}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            <div className="flex justify-center mt-12">
                 <Link href="/theme/all" className="hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                    Tous les aphorismes <ArrowUpRight className="w-4 h-4" />
                 </Link>
            </div>
          </div>
        )}

        {/* Réflexions Section */}
        {latestReflections.length > 0 && (
          <div className="relative group/section">
            <h2 className="font-display text-4xl text-center mb-12 text-foreground">
                Réflexions
            </h2>
            
            <div className="relative">
                <div className="min-h-[400px]">
                    <AnimatePresence initial={false} custom={reflectionDirection} mode="wait">
                        <motion.div
                            key={reflectionPage}
                            custom={reflectionDirection}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                        >
                            {latestReflections
                                .slice(reflectionPage * ITEMS_PER_PAGE, (reflectionPage + 1) * ITEMS_PER_PAGE)
                                .map((item: any) => (
                                <div key={`${item.type}-${item.id}`} className="break-inside-avoid">
                                <ReflectionCard item={item} />
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <PaginationControls 
                    currentPage={reflectionPage}
                    totalItems={latestReflections.length}
                    setPage={setReflectionPage}
                    setDirection={setReflectionDirection}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            <div className="flex justify-center mt-12">
                 <Link href="/reflexions" className="hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                    Toutes les réflexions <ArrowUpRight className="w-4 h-4" />
                 </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

// function AphorismCard removed

function ReflectionCard({ item }: { item: ContentItem }) {
    return (
        <Link href={`/reflexions/${item.id}`} className="block group">
            <CineasticCard className="flex flex-col h-full bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors border-white/5 group-hover:border-primary/20">
                <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground uppercase tracking-wider">
                    <span>{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                    <span className="text-primary/70">Réflexion</span>
                </div>
                
                <h3 className="font-display text-2xl mb-4 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>
                
                <p className="font-body text-muted-foreground leading-relaxed line-clamp-4 text-sm mb-6">
                    {item.content
                      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove standard markdown images
                      .replace(/!left\(.*?\)/g, '')    // Remove custom !left() images
                      .replace(/!right\(.*?\)/g, '')   // Remove custom !right() images
                      .replace(/\[.*?\]\(.*?\)/g, '$1') // Remove links but keep text
                      .replace(/[#*`_]/g, '')           // Remove formatting chars
                      .trim()
                      .substring(0, 150)}...
                </p>
                
                <div className="mt-auto flex items-center text-primary text-xs uppercase tracking-widest font-bold group-hover:translate-x-1 transition-transform">
                    Lire la suite <ArrowUpRight className="w-3 h-3 ml-1" />
                </div>
            </CineasticCard>
        </Link>
    )
}
