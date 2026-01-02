'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Aphorism } from '@/types/aphorism'
import { ThumbsUp, Facebook, Twitter } from 'lucide-react'
import { likeAphorism, unlikeAphorism } from '@/lib/instant'
import { useState, useEffect } from 'react'

interface GalleryGridProps {
  aphorismes: Aphorism[]
  onSelectAphorism: (aphorism: Aphorism) => void
}

export function GalleryGrid({ aphorismes, onSelectAphorism }: GalleryGridProps) {
  // Only show aphorismes with images in gallery
  const aphorismesWithImages = aphorismes.filter(a => a.imageUrl)

  if (aphorismesWithImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aucune image disponible dans la galerie
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className="columns-1 sm:columns-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {aphorismesWithImages.map((aphorism) => (
        <GalleryItem key={aphorism.id} aphorism={aphorism} onSelectAphorism={onSelectAphorism} />
      ))}
    </motion.div>
  )
}

function GalleryItem({ aphorism, onSelectAphorism }: { aphorism: Aphorism, onSelectAphorism: (a: Aphorism) => void }) {
  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  
  const currentLikes = optimisticLikes !== null ? optimisticLikes : (aphorism.likes || 0)

  useEffect(() => {
    const likedAphorisms = JSON.parse(localStorage.getItem('liked_aphorisms') || '[]')
    setIsLiked(likedAphorisms.includes(aphorism.id))
  }, [aphorism.id])

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
    
    setOptimisticLikes(newLikes)
    setIsLiked(newIsLiked)

    const likedAphorisms = JSON.parse(localStorage.getItem('liked_aphorisms') || '[]')
    
    if (newIsLiked) {
      if (!likedAphorisms.includes(aphorism.id)) {
        likedAphorisms.push(aphorism.id)
      }
      try {
        await likeAphorism(aphorism.id, currentLikes)
      } catch (error) {
        console.error('Failed to like:', error)
        setOptimisticLikes(null)
        setIsLiked(!newIsLiked)
      }
    } else {
      const index = likedAphorisms.indexOf(aphorism.id)
      if (index > -1) {
        likedAphorisms.splice(index, 1)
      }
      try {
        await unlikeAphorism(aphorism.id, currentLikes)
      } catch (error) {
        console.error('Failed to unlike:', error)
        setOptimisticLikes(null)
        setIsLiked(!newIsLiked)
      }
    }
    localStorage.setItem('liked_aphorisms', JSON.stringify(likedAphorisms))
  }

  const handleShare = (platform: 'twitter' | 'facebook', e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/aphorisme/${aphorism.id}`
    const text = aphorism.title || "Une pensée de Sens & Diversité"

    let shareUrl = ''
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    } else {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' as const }
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className="break-inside-avoid mb-4 relative rounded-lg overflow-hidden cursor-pointer group"
      onClick={() => onSelectAphorism(aphorism)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <Image
        src={aphorism.imageUrl || ''}
        alt={aphorism.text.substring(0, 100)}
        width={0}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{ width: '100%', height: 'auto' }}
        className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-end justify-between gap-4">
          <p className="text-white text-sm font-serif line-clamp-3 flex-grow">
            "{aphorism.text}"
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleShare('twitter', e)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 hover:text-white transition-all duration-300"
              title="Partager sur X"
            >
              <Twitter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleShare('facebook', e)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 hover:text-white transition-all duration-300"
               title="Partager sur Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 hover:text-white transition-all duration-300 group/like shrink-0 z-10"
              aria-label={isLiked ? "Je n'aime plus" : "J'aime"}
            >
              <ThumbsUp className={`w-3.5 h-3.5 transition-transform duration-300 group-hover/like:scale-110 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium tabular-nums">{currentLikes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Focus outline for accessibility */}
      <div className="absolute inset-0 rounded-lg ring-0 group-focus-within:ring-2 ring-ring transition-all pointer-events-none" />
    </motion.div>
  )
}
