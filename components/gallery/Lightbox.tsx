'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Aphorism } from '@/types/aphorism'

interface LightboxProps {
  aphorism: Aphorism | null
  aphorismes: Aphorism[]
  onClose: () => void
  onNavigate: (aphorism: Aphorism) => void
}

export function Lightbox({ aphorism, aphorismes, onClose, onNavigate }: LightboxProps) {
  const focusTrapRef = useRef<HTMLDivElement>(null)

  const currentIndex = aphorism ? aphorismes.findIndex((a) => a.id === aphorism.id) : -1
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex !== -1 && currentIndex < aphorismes.length - 1

  const handlePrevious = () => {
    if (canGoPrev) {
      onNavigate(aphorismes[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(aphorismes[currentIndex + 1])
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!aphorism) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [aphorism, canGoPrev, canGoNext, currentIndex]) // Added aphorism dependency

  // Focus trap
  useEffect(() => {
    if (!aphorism) return

    const prevActiveElement = document.activeElement as HTMLElement
    // Use a timeout to ensure element is mounted and focused
    const timer = setTimeout(() => {
      focusTrapRef.current?.focus()
    }, 50)

    return () => {
      clearTimeout(timer)
      prevActiveElement?.focus()
    }
  }, [aphorism]) // Added aphorism dependency

  if (!aphorism) return null

  const lightboxVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Lightbox"
      >
        <motion.div
          className="relative w-fit max-w-[95vw] mx-auto px-4 py-8 pointer-events-none flex flex-col items-center"
          variants={lightboxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          ref={focusTrapRef}
          tabIndex={-1}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors pointer-events-auto"
            aria-label="Fermer le lightbox"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Main content */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 pointer-events-auto"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Image */}
            {aphorism.imageUrl && (
              <div className="relative flex items-center justify-center w-full">
                <Image
                  src={aphorism.imageUrl}
                  alt={aphorism.text.substring(0, 100)}
                  width={0}
                  height={0}
                  sizes="90vw"
                  style={{ width: 'auto', height: 'auto', maxHeight: '80vh', maxWidth: '100%' }}
                  className="rounded-sm shadow-2xl object-contain"
                  priority
                />
              </div>
            )}

            {/* Footer: Date & Close Button */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <div className="text-sm text-white/50 font-serif tracking-wider">
                {new Date(aphorism.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all text-xs uppercase tracking-widest hover:scale-105 active:scale-95 border border-white/10"
              >
                Fermer
              </button>
            </div>
          </motion.div>

          {/* Navigation */}
          {aphorismes.length > 1 && (
            <div className="absolute inset-y-0 flex items-center justify-between pointer-events-none px-4 w-full">
              <motion.button
                onClick={handlePrevious}
                disabled={!canGoPrev}
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Image précédente"
                whileHover={canGoPrev ? { scale: 1.1 } : {}}
                whileTap={canGoPrev ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={!canGoNext}
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Image suivante"
                whileHover={canGoNext ? { scale: 1.1 } : {}}
                whileTap={canGoNext ? { scale: 0.95 } : {}}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          )}

          {/* Counter */}
          {aphorismes.length > 1 && (
            <div className="absolute bottom-4 left-4 text-sm text-white/80">
              {currentIndex + 1} / {aphorismes.length}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
