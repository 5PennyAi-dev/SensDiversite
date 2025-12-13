'use client'

import Image from 'next/image'
import { useAphorismes } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'
import { PaperCard } from '@/components/ui/PaperCard'
import { TagPill } from '@/components/ui/TagPill'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function AphorismList() {
  const { data, isLoading, error } = useAphorismes()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-64 bg-[var(--paper-2)] border border-[var(--border)] rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-800 border border-red-200 bg-red-50 rounded-lg">
        <p className="font-serif italic">Une erreur est survenue lors du chargement.</p>
      </div>
    )
  }

  const aphorismes = data?.aphorismes as Aphorism[] | undefined

  if (!aphorismes || aphorismes.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--muted-foreground)] font-serif italic text-lg">
        La collection est vide pour le moment.
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {aphorismes.map((aphorism) => (
        <motion.div key={aphorism.id} variants={itemVariants}>
          <PaperCard className="flex flex-col md:flex-row gap-6 md:gap-8 group">
            {/* Image (Optional) */}
            {aphorism.imageUrl && (
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative aspect-[4/5] md:aspect-square w-full rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                   <Image
                     src={aphorism.imageUrl}
                     alt={aphorism.text.substring(0, 50)}
                     fill
                     className="object-cover"
                     sizes="(max-width: 768px) 100vw, 300px"
                   />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col justify-center flex-grow py-2">
              <blockquote className="font-serif text-xl sm:text-2xl leading-relaxed text-[var(--ink)] mb-6">
                "{aphorism.text}"
              </blockquote>

              <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)]/50">
                 <div className="flex flex-wrap gap-2">
                    {aphorism.tags?.map((tag) => (
                      <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                        {tag}
                      </TagPill>
                    ))}
                 </div>
                 
                 {/* Action placeholders */}
                 <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="text-xs font-sans uppercase tracking-widest text-[var(--accent)] hover:underline">
                      Lire
                    </button>
                 </div>
              </div>
            </div>
          </PaperCard>
        </motion.div>
      ))}
    </motion.div>
  )
}
