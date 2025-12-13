'use client'

import { useAphorismes } from '@/lib/instant'
import type { Aphorism } from '@/types/aphorism'
import { motion } from 'framer-motion'
import { AphorismCard } from './AphorismCard'

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
          <AphorismCard aphorism={aphorism} />
        </motion.div>
      ))}
    </motion.div>
  )
}
