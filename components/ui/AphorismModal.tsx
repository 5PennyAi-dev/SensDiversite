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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Main Card Container */}
             <div className="w-full flex flex-col bg-card border border-white/5 rounded-xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] overflow-hidden max-h-full ring-1 ring-white/10 relative">
                
                {/* Paper texture overlay for the modal */}
                <div className="absolute inset-0 opacity-[0.03] bg-noise pointer-events-none mix-blend-overlay z-0" />
                
                {/* Top Shine Gradient */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between p-8 sm:p-10 pb-4 shrink-0">
                    <div className="pr-8 space-y-3">
                        {aphorism.title && (
                            <h2 className="font-display font-medium text-3xl sm:text-4xl text-foreground tracking-tight">
                                {aphorism.title}
                            </h2>
                        )}
                        <div className="flex flex-wrap gap-3">
                           {aphorism.tags?.map((tag) => (
                                <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`} className="text-muted-foreground hover:text-primary">
                                    {tag}
                                </TagPill>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/5 text-muted-foreground/50 hover:text-primary transition-all duration-300 group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                {/* Scrollable Body - Optimized Contrast */}
                <div className="relative z-10 overflow-y-auto px-8 sm:px-10 pb-8 custom-scrollbar min-h-0">
                    <div className="font-display text-xl sm:text-2xl leading-[1.8] text-foreground/85">
                        {aphorism.text.split(/\n\s*\n/).map((paragraph, index) => (
                            <p key={index} className="mb-6 text-justify last:mb-0 first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-serif first-letter:text-primary">
                                {paragraph.replace(/\n/g, ' ')}
                            </p>
                        ))}
                    </div>
                    
                    {/* Decorative End Mark */}
                    <div className="w-full flex justify-center mt-12 mb-4 opacity-30">
                        <div className="w-16 h-px bg-primary" />
                    </div>
                </div>

                {/* Footer - Minimalist */}
                <div className="relative z-10 px-8 py-6 border-t border-white/5 flex justify-between items-center bg-black/20 shrink-0">
                    <span className="text-xs text-muted-foreground/40 font-mono">
                        REF: {aphorism.id.slice(0, 8)}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary rounded-sm transition-all duration-300 font-body text-xs uppercase tracking-[0.2em] border border-white/5 hover:border-primary/20"
                    >
                        Fermer la lecture
                    </button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
