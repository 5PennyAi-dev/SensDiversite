'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="relative w-full min-h-[70vh] flex items-center overflow-hidden">
      {/* Ambient warm glow - left side */}
      <motion.div
        className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Ambient rose glow - right side */}
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      <div className="container mx-auto px-6 sm:px-8 max-w-7xl relative z-10">
        <div className="max-w-4xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">
              Fragments philosophiques
            </span>
          </motion.div>

          {/* Main Title - Dramatic Typography */}
          <motion.h1
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tight mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <motion.span
              className="block text-foreground"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Le Sens
            </motion.span>
            <motion.span
              className="block text-foreground/40 ml-4 sm:ml-8 md:ml-16"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              et la
            </motion.span>
            <motion.span
              className="block text-primary italic"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Diversité
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="font-body text-lg md:text-xl text-muted-foreground/80 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Une collection de pensées et de réflexions pour explorer la complexité du monde.
          </motion.p>

          {/* Decorative element */}
          <motion.div
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <div className="w-1 h-1 rounded-full bg-primary/20" />
          </motion.div>
        </div>
      </div>

      {/* Vertical line decoration */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent hidden md:block"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </div>
  )
}
