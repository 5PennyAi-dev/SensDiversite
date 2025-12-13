'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAphorismes } from '@/lib/instant'
import { PaperCard } from '@/components/ui/PaperCard'
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
    <section className="relative max-w-3xl mx-auto px-6 mb-8">
      
      <div className="text-center mb-6">
         <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">En vedette</span>
      </div>

      <div className="relative overflow-hidden min-h-[400px]"> {/* Fixed min-height to prevent layout jumps */}
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
            <PaperCard className="w-full h-full flex flex-col items-center justify-center text-center p-8 md:p-12">
               <div className="flex-1 flex flex-col justify-center items-center w-full">
                  <blockquote className="font-serif text-2xl sm:text-3xl md:text-3xl leading-relaxed text-[var(--ink)] mb-8">
                    "{currentAphorism.text}"
                  </blockquote>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {currentAphorism.tags.map((tag: string) => (
                      <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                        {tag}
                      </TagPill>
                    ))}
                  </div>

                  <Link href={`/theme/all`} className="text-sm font-sans uppercase tracking-widest border-b border-[var(--accent)] text-[var(--accent)] pb-1 hover:opacity-70 transition-opacity">
                    Voir la collection
                  </Link>
               </div>
            </PaperCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden md:flex items-center justify-center -ml-12 z-10">
         <button onClick={prevSlide} className="p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--paper-2)] transition-colors">
            <ChevronLeft size={32} />
         </button>
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden md:flex items-center justify-center -mr-12 z-10">
         <button onClick={nextSlide} className="p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--paper-2)] transition-colors">
            <ChevronRight size={32} />
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
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              idx === currentIndex ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
