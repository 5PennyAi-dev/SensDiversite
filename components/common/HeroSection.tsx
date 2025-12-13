'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useFeaturedAphorismes } from '@/lib/instant'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HeroSection() {
  const { data } = useFeaturedAphorismes()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const aphorismes = data?.aphorismes ?? []

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (!isAutoPlay || aphorismes.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aphorismes.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlay, aphorismes.length])

  // Don't show hero if no featured aphorismes
  if (aphorismes.length === 0) {
    return null
  }

  const currentAphorism = aphorismes[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + aphorismes.length) % aphorismes.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % aphorismes.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const fadeSlideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  }

  return (
    <div className="relative w-full min-h-screen lg:min-h-screen md:min-h-[80vh] min-h-[60vh] bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={fadeSlideVariants.initial}
          animate={fadeSlideVariants.animate}
          exit={fadeSlideVariants.exit}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Background image if exists */}
          {currentAphorism.imageUrl && (
            <div className="absolute inset-0">
              <Image
                src={currentAphorism.imageUrl}
                alt={currentAphorism.text.substring(0, 100)}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center flex flex-col items-center justify-center h-full">
            {/* Aphorism text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 ${
                currentAphorism.imageUrl
                  ? 'text-white drop-shadow-lg'
                  : 'text-foreground'
              }`}
            >
              "{currentAphorism.text}"
            </motion.p>

            {/* Tags */}
            {currentAphorism.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-2 justify-center mt-6"
              >
                {currentAphorism.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 text-sm rounded-full ${
                      currentAphorism.imageUrl
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows (visible on hover) */}
      {aphorismes.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-300 group"
            aria-label="Previous aphorism"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={goToNext}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-300 group"
            aria-label="Next aphorism"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Carousel indicators (dots) */}
      {aphorismes.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {aphorismes.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8 h-2'
                  : 'bg-white/50 w-2 h-2 hover:bg-white/75'
              }`}
              style={{ borderRadius: '1px' }}
              aria-label={`Go to slide ${index + 1}`}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground text-sm z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="hidden lg:inline text-xs">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
