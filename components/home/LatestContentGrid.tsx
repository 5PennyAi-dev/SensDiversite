'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAphorismes, useReflections } from '@/lib/instant'
import { AphorismCard } from '@/components/aphorism/AphorismCard'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentItem {
  type: 'aphorism' | 'reflection'
  id: string
  title?: string
  content: string
  tags: string[]
  date: number
  imageUrl?: string | null
}

export function LatestContentGrid() {
  const { data: aphorismData } = useAphorismes()
  const { data: reflectionData } = useReflections()

  const [aphorismPage, setAphorismPage] = useState(0)
  const [reflectionPage, setReflectionPage] = useState(0)
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

    const reflections = (reflectionData?.reflections ?? [])
      .filter((r: any) => r.published)
      .map((r: any) => ({
        type: 'reflection' as const,
        id: r.id,
        title: r.title,
        content: r.content,
        tags: r.tags || [],
        date: r.createdAt,
        imageUrl: null
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
    currentPage: number
    totalItems: number
    setPage: (p: number) => void
    setDirection: (d: number) => void
    itemsPerPage: number
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (totalPages <= 1) return null

    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-0 -mx-4 sm:-mx-14 z-10">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1), currentPage, setPage, setDirection)}
          disabled={currentPage === 0}
          className="pointer-events-auto p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/30 text-muted-foreground/60 hover:text-primary hover:border-primary/30 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1), currentPage, setPage, setDirection)}
          disabled={currentPage >= totalPages - 1}
          className="pointer-events-auto p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/30 text-muted-foreground/60 hover:text-primary hover:border-primary/30 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 600 : -600,
      opacity: 0
    })
  }

  // Section header component
  const SectionHeader = ({ title, linkHref, linkText }: { title: string; linkHref: string; linkText: string }) => (
    <div className="flex items-end justify-between mb-12">
      <div className="flex items-center gap-4">
        <div className="w-8 h-px bg-primary/40" />
        <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      <Link
        href={linkHref}
        className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-primary transition-colors duration-500 group"
      >
        {linkText}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  )

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-32">

        {/* Aphorismes Section */}
        {latestAphorisms.length > 0 && (
          <div className="relative">
            <SectionHeader title="Aphorismes" linkHref="/galerie" linkText="Voir tout" />

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
                    className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
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

            {/* Mobile link */}
            <div className="flex justify-center mt-10 sm:hidden">
              <Link href="/galerie" className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Réflexions Section */}
        {latestReflections.length > 0 && (
          <div className="relative">
            <SectionHeader title="Réflexions" linkHref="/reflexions" linkText="Voir tout" />

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
                    className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
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

            {/* Mobile link */}
            <div className="flex justify-center mt-10 sm:hidden">
              <Link href="/reflexions" className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

function ReflectionCard({ item }: { item: ContentItem }) {
  return (
    <Link href={`/reflexions/${item.id}`} className="block group">
      <CineasticCard className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
            {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
          </span>
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <span className="text-[10px] tracking-[0.15em] uppercase text-primary/60">{item.tags?.[0] || 'Réflexion'}</span>
        </div>

        <h3 className="font-display text-xl md:text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
          {item.title}
        </h3>

        <p className="font-body text-sm text-muted-foreground/70 leading-relaxed line-clamp-4 mb-6">
          {item.content
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
  )
}
