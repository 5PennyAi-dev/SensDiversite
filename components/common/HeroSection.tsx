'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="relative w-full py-10 lg:py-12 text-center bg-[var(--paper)]">
       <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--ink)] mb-4 tracking-tight">
            Sens & Diversité
          </h1>
          <p className="font-sans text-[var(--muted-foreground)] text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Une collection de fragments pour penser la complexité du monde.
          </p>
       </motion.div>
    </div>
  )
}
