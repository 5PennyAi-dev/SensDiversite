'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { TagPill } from './TagPill'
import type { Aphorism } from '@/types/aphorism'

interface AphorismModalProps {
  aphorism: Aphorism | null
  isOpen: boolean
  onClose: () => void
}

export function AphorismModal({ aphorism, isOpen, onClose }: AphorismModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!aphorism) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
          />

          {/* Close button - top right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 rounded-full text-muted-foreground/40 hover:text-primary transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col px-6 sm:px-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image header if present */}
            {aphorism.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative w-full aspect-[16/10] mb-10 rounded-lg overflow-hidden"
              >
                <Image
                  src={aphorism.imageUrl}
                  alt={aphorism.title || "Aphorisme"}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {/* Subtle vignette on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </motion.div>
            )}

            {/* Title */}
            {aphorism.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-6"
              >
                {aphorism.title}
              </motion.h2>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="font-display text-xl sm:text-2xl leading-[1.9] text-foreground/80"
            >
              {aphorism.text.split(/\n\s*\n/).map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-8 text-justify last:mb-0 first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:pt-1 first-letter:font-display first-letter:text-primary/80 first-letter:leading-[0.8]"
                >
                  {paragraph.replace(/\n/g, ' ')}
                </p>
              ))}
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/20"
            >
              {aphorism.tags?.map((tag) => (
                <TagPill
                  key={tag}
                  href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}
                  className="text-muted-foreground/60 hover:text-primary"
                >
                  {tag}
                </TagPill>
              ))}
            </motion.div>

            {/* Decorative end */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="flex justify-center mt-12 mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                <div className="w-8 h-px bg-primary/30" />
                <div className="w-1 h-1 rounded-full bg-primary/30" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
