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
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  if (isLoading) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <div className="animate-pulse h-64 bg-white/5 ring-1 ring-white/10 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 border border-red-500/20 bg-red-500/10 rounded-xl">
        <p className="font-display italic">Une erreur est survenue lors du chargement.</p>
      </div>
    )
  }

  const aphorismes = data?.aphorismes as Aphorism[] | undefined

  if (!aphorismes || aphorismes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground font-display italic text-lg">
        La collection est vide pour le moment.
      </div>
    )
  }

  return (
    <motion.div 
      className="columns-1 md:columns-2 lg:columns-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {aphorismes.map((aphorism) => (
        <motion.div 
          key={aphorism.id} 
          variants={itemVariants}
          className="mb-6 break-inside-avoid"
        >
          <AphorismCard aphorism={aphorism} />
        </motion.div>
      ))}
    </motion.div>
  )
}
