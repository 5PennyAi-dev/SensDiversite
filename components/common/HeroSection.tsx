'use client'

import { motion } from 'framer-motion'
import { HeroTitle, LabelText } from '@/components/ui/Typography'

export function HeroSection() {
  return (
    <div className="relative w-full min-h-[45vh] flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95">
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="container mx-auto px-6 text-center max-w-5xl"
        >
          <LabelText className="mb-6 block">
            Philosophical Reflections
          </LabelText>
          
          <HeroTitle className="mb-8">
            Sens & Diversité
          </HeroTitle>
          
          <motion.p 
            className="font-body text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Une collection de fragments pour penser la complexité du monde.
          </motion.p>
       </motion.div>
    </div>
  )
}
