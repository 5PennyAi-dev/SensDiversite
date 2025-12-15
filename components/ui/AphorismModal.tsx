'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CineasticCard } from './CineasticCard'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
             <div className="w-full flex flex-col bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-full">
                {/* Header */}
                <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/10 shrink-0">
                    <div className="pr-8">
                        {aphorism.title && (
                            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">
                                {aphorism.title}
                            </h2>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {aphorism.tags?.map((tag) => (
                                <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                                    {tag}
                                </TagPill>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar min-h-0">
                    <div className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground/90">
                        {aphorism.text.split(/\n\s*\n/).map((paragraph, index) => (
                            <p key={index} className="mb-6 text-justify last:mb-0">
                                {paragraph.replace(/\n/g, ' ')}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 border-t border-white/10 flex justify-end bg-white/5 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-border/30 hover:border-[var(--accent)] hover:text-[var(--accent)] text-muted-foreground rounded-sm transition-all duration-300 font-serif text-sm uppercase tracking-widest"
                    >
                        Fermer
                    </button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
