'use client'

import { motion } from 'framer-motion'
import { HeroTitle, LabelText } from '@/components/ui/Typography'

export function HeroSection() {
  return (
    <div className="relative w-full min-h-[50vh] flex flex-col items-center justify-center overflow-hidden py-12">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

       <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 text-center max-w-7xl relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <LabelText className="mb-6 block text-primary/80 tracking-[0.4em] text-xs md:text-sm font-semibold">
              RÉFLEXIONS PHILOSOPHIQUES
            </LabelText>
          </motion.div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-8 text-foreground tracking-tight leading-[0.9]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
              Le Sens et la
            </span>
            <span className="block text-primary/90 italic mt-1">
              Diversité
            </span>
          </h1>
          
          <motion.div
             className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-8"
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ delay: 0.8, duration: 1.5 }}
          />
          
          <motion.p 
            className="font-display text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            "Une collection de fragments pour penser la complexité du monde."
          </motion.p>
       </motion.div>
    </div>
  )
}
