'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Aphorism } from '@/types/aphorism'

interface GalleryGridProps {
  aphorismes: Aphorism[]
  onSelectAphorism: (aphorism: Aphorism) => void
}

export function GalleryGrid({ aphorismes, onSelectAphorism }: GalleryGridProps) {
  // Only show aphorismes with images in gallery
  const aphorismesWithImages = aphorismes.filter(a => a.imageUrl)

  if (aphorismesWithImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aucune image disponible dans la galerie
        </p>
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px] sm:auto-rows-[250px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {aphorismesWithImages.map((aphorism, index) => {
        // Vary grid item sizes for visual interest
        const span = index % 7 === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
        const rowSpan = index % 5 === 2 ? 'row-span-2' : ''

        return (
          <motion.div
            key={aphorism.id}
            variants={itemVariants}
            className={`relative rounded-lg overflow-hidden cursor-pointer group ${span} ${rowSpan}`}
            onClick={() => onSelectAphorism(aphorism)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image */}
            <Image
              src={aphorism.imageUrl || ''}
              alt={aphorism.text.substring(0, 100)}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-serif line-clamp-3">
                "{aphorism.text}"
              </p>
            </div>

            {/* Focus outline for accessibility */}
            <div className="absolute inset-0 rounded-lg ring-0 group-focus-within:ring-2 ring-ring transition-all pointer-events-none" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
