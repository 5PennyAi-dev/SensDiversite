'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAphorismes } from '@/lib/instant'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { TagPill } from '@/components/ui/TagPill'

export function HomeCarousel() {
  const { data } = useAphorismes()
  const aphorismes = data?.aphorismes ?? []
  
  const [randomAphorismes, setRandomAphorismes] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Select 5 random aphorisms on mount
  useEffect(() => {
    if (aphorismes.length > 0) {
      const shuffled = [...aphorismes].sort(() => 0.5 - Math.random())
      setRandomAphorismes(shuffled.slice(0, 5))
    }
  }, [aphorismes])

  // Autoplay
  useEffect(() => {
    if (randomAphorismes.length === 0) return
    const timer = setInterval(() => {
      nextSlide()
    }, 8000)
    return () => clearInterval(timer)
  }, [currentIndex, randomAphorismes])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % randomAphorismes.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + randomAphorismes.length) % randomAphorismes.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  if (randomAphorismes.length === 0) return null

  const currentAphorism = randomAphorismes[currentIndex]

  return (
    <section className="relative max-w-4xl mx-auto px-6 mb-8">
      
      <div className="relative overflow-hidden min-h-[350px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-full h-full flex items-center justify-center p-1"
          >
            <CineasticCard className="w-full h-full flex flex-col items-center justify-center text-center">
               <div className="flex-1 flex flex-col justify-center items-center w-full">
                  {currentAphorism.title && (
                    <h3 className="font-display text-xl sm:text-2xl text-foreground/90 font-medium mb-4">
                      {currentAphorism.title}
                    </h3>
                  )}
                  <blockquote className="font-display text-lg sm:text-xl md:text-2xl leading-relaxed text-foreground/80 mb-6 max-w-2xl">
                    {(() => {
                      const words = currentAphorism.text.trim().split(/\s+/)
                      if (words.length > 40) {
                        return words.slice(0, 40).join(' ') + '...'
                      }
                      return currentAphorism.text
                    })()}
                  </blockquote>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {currentAphorism.tags.map((tag: string) => (
                      <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                        {tag}
                      </TagPill>
                    ))}
                  </div>

                  <Link href={`/theme/all`} className="text-xs font-body uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors">
                    Voir la collection
                  </Link>
               </div>
            </CineasticCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden md:flex items-center justify-center -ml-12 z-10">
         <button onClick={prevSlide} className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-white/5 transition-all">
            <ChevronLeft size={24} />
         </button>
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden md:flex items-center justify-center -mr-12 z-10">
         <button onClick={nextSlide} className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-white/5 transition-all">
            <ChevronRight size={24} />
         </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {randomAphorismes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1)
              setCurrentIndex(idx)
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-primary w-6' : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
