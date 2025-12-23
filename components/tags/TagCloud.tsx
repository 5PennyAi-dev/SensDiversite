'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import Link from 'next/link'

export function TagCloud() {
  const { data } = useAphorismes()
  const aphorismes = data?.aphorismes ?? []

  // Aggregate tags with counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    aphorismes.forEach((aphorism) => {
      aphorism.tags.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return counts
  }, [aphorismes])

  // Convert to array and sort by count (desc) then alpha
  const tags = useMemo(() => {
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  }, [tagCounts])

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground/40 italic font-display">
        Aucun thème disponible
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <motion.div
      className="flex flex-wrap gap-3 justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tags.map(({ tag, count }) => (
        <motion.div key={tag} variants={itemVariants}>
          <Link
            href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-card/60 border border-border/30 rounded-full transition-all duration-500 hover:bg-card hover:border-primary/30"
          >
            <span className="font-display text-sm text-foreground/80 group-hover:text-primary transition-colors duration-300">
              {tag}
            </span>
            <span className="text-[10px] font-body text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-300">
              {count}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
