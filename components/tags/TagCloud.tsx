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
      <div className="text-center py-8 text-muted-foreground/60 italic">
        ...
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tags.map(({ tag, count }) => (
        <motion.div key={tag} variants={itemVariants}>
          <Link href={`/theme/${encodeURIComponent(tag.toLowerCase())}`} className="block h-full">
            <div className="group flex items-center justify-between p-4 bg-white/5 ring-1 ring-white/10 rounded-xl transition-all duration-300 hover:ring-primary/40 hover:bg-white/10 hover:scale-[1.02] cursor-pointer h-full">
               <span className="font-display text-base sm:text-lg text-foreground/90 group-hover:text-primary transition-colors truncate mr-2">
                  {tag}
               </span>
               <span className="font-body text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-full ring-1 ring-white/10 group-hover:ring-primary/30 group-hover:text-primary transition-all">
                  {count}
               </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
