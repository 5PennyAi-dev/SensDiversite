'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { Aphorism } from '@/types/aphorism'

interface HeroFeatureCardProps {
  aphorism: Aphorism
}

export function HeroFeatureCard({ aphorism }: HeroFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative w-full max-w-sm sm:max-w-md ml-auto mt-8 lg:mt-0"
    >
      {/* Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card/10 backdrop-blur-sm border border-white/5 p-6 sm:p-8 shadow-2xl group transition-all duration-500 hover:bg-card/20">
        
        {/* Decorative quote icon */}
        <Quote className="absolute top-4 left-4 w-6 h-6 text-primary/30 rotate-180" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {aphorism.title && (
            <div className="mb-6 flex flex-col items-center">
              <cite className="font-body text-xs tracking-[0.25em] text-muted-foreground uppercase not-italic">
                {aphorism.title}
              </cite>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-4" />
            </div>
          )}

          <blockquote className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90 italic">
            "{aphorism.text}"
          </blockquote>

          {/* Prompt to read more (subtle) */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-[9px] uppercase tracking-widest text-primary/60">
                 Lire la suite
             </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  )
}
