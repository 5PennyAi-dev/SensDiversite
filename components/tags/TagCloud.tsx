'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tags.map(({ tag, count }) => (
        <motion.div key={tag} variants={itemVariants}>
          <Link href={`/theme/${encodeURIComponent(tag.toLowerCase())}`} className="block h-full">
            <div className="group flex items-center justify-between p-3 px-4 bg-[var(--paper-2)] border border-[var(--border)] rounded-lg transition-all duration-200 hover:border-[var(--accent)] hover:shadow-sm hover:-translate-y-0.5 cursor-pointer h-full">
               <span className="font-serif text-lg text-[var(--ink)] group-hover:text-[#6E1F2B] transition-colors truncate mr-2">
                  {tag}
               </span>
               <span className="font-sans text-xs font-medium text-[var(--muted-foreground)] bg-[var(--paper)] px-2 py-0.5 rounded-full border border-[var(--border)] group-hover:border-[var(--accent-soft)] group-hover:text-[var(--accent)] transition-colors">
                  {count}
               </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
