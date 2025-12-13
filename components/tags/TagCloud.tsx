'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import Link from 'next/link'

export function TagCloud() {
  const { data } = useAphorismes()
  const [sortByPopularity, setSortByPopularity] = useState(true)

  const aphorismes = data?.aphorismes ?? []

  // Aggregate tags with counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}

    aphorismes.forEach((aphorism) => {
      aphorism.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })

    return counts
  }, [aphorismes])

  // Calculate proportional font sizes
  const tagsWithSize = useMemo(() => {
    const tags = Object.entries(tagCounts)

    if (tags.length === 0) return []

    const counts = tags.map(([, count]) => count)
    const minCount = Math.min(...counts)
    const maxCount = Math.max(...counts)

    const minSize = 14 // text-sm in px
    const maxSize = 36 // text-4xl in px

    return tags
      .map(([tag, count]) => {
        const size =
          minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
        return { tag, count, size }
      })
      .sort((a, b) =>
        sortByPopularity ? b.count - a.count : a.tag.localeCompare(b.tag)
      )
  }, [tagCounts, sortByPopularity])

  if (tagsWithSize.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun thème disponible pour le moment</p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }

  const tagHoverVariants = {
    rest: { scale: 1, opacity: 0.7 },
    hover: { scale: 1.08, opacity: 1 }
  }

  return (
    <div className="space-y-6">
      {/* Sort toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setSortByPopularity(!sortByPopularity)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors duration-300"
          aria-label={sortByPopularity ? 'Sort alphabetically' : 'Sort by popularity'}
        >
          {sortByPopularity ? 'Par popularité' : 'Alphabétique'} ↔
        </button>
      </div>

      {/* Tag cloud */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 sm:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tagsWithSize.map(({ tag, count, size }) => (
          <motion.div
            key={tag}
            variants={tagVariants}
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            <Link href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
              <motion.a
                className="inline-block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors duration-300 cursor-pointer group"
                variants={tagHoverVariants}
                style={{
                  fontSize: `${size}px`,
                  lineHeight: '1.2',
                  fontWeight: size > 24 ? '600' : '500'
                }}
              >
                <span className="group-hover:underline">{tag}</span>
                <span className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ({count})
                </span>
              </motion.a>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        {tagsWithSize.length} thème{tagsWithSize.length > 1 ? 's' : ''}
      </div>
    </div>
  )
}
