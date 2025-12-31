'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Aphorism } from '@/types/aphorism'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { TagPill } from '@/components/ui/TagPill'
import { AphorismModal } from '@/components/ui/AphorismModal'
import { Lightbox } from '@/components/gallery/Lightbox'
import { ThumbsUp, Facebook, Twitter } from 'lucide-react'
import { likeAphorism, unlikeAphorism } from '@/lib/instant'
import { useEffect } from 'react'

interface AphorismCardProps {
  aphorism: Aphorism
}

export function AphorismCard({ aphorism }: AphorismCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  
  const currentLikes = optimisticLikes !== null ? optimisticLikes : (aphorism.likes || 0)

  useEffect(() => {
    const likedAphorisms = JSON.parse(localStorage.getItem('liked_aphorisms') || '[]')
    setIsLiked(likedAphorisms.includes(aphorism.id))
  }, [aphorism.id])

  const handleLike = async () => {
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
    
    // Optimistic update
    setOptimisticLikes(newLikes)
    setIsLiked(newIsLiked)

    // Update Local Storage
    const likedAphorisms = JSON.parse(localStorage.getItem('liked_aphorisms') || '[]')
    if (newIsLiked) {
      if (!likedAphorisms.includes(aphorism.id)) {
        likedAphorisms.push(aphorism.id)
      }
      try {
        await likeAphorism(aphorism.id, currentLikes)
      } catch (error) {
        console.error('Failed to like aphorism:', error)
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
        console.error('Failed to unlike aphorism:', error)
        setOptimisticLikes(null)
        setIsLiked(!newIsLiked)
      }
    }
    localStorage.setItem('liked_aphorisms', JSON.stringify(likedAphorisms))
  }

  const handleShare = (platform: 'twitter' | 'facebook', e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/aphorisme/${aphorism.id}`
    // Use title or fallback text
    const text = aphorism.title || "Une pensée de Sens & Diversité"

    let shareUrl = ''
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    } else {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  // Truncation logic
  const WORD_LIMIT = 100
  const words = aphorism.text.trim().split(/\s+/)
  const shouldTruncate = words.length > WORD_LIMIT

  const displayText = !shouldTruncate
    ? aphorism.text
    : words.slice(0, WORD_LIMIT).join(' ') + '...'

  // Render Visual Card (Image Mode)
  if (aphorism.imageUrl) {
    return (
      <>
        <CineasticCard
          className="flex flex-col group cursor-pointer p-0"
          noPadding
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative w-full overflow-hidden">
            <Image
              src={aphorism.imageUrl}
              alt={aphorism.title || "Aphorisme"}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              className="w-full h-auto transition-all duration-1000 group-hover:scale-[1.02]"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Tags on hover */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {aphorism.tags?.slice(0, 3).map((tag) => (
                    <TagPill
                      key={tag}
                      href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}
                      className="bg-background/80 backdrop-blur-sm border-transparent text-foreground/80 text-[10px]"
                    >
                      {tag}
                    </TagPill>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShare('twitter', e)}
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground/80 hover:text-black hover:bg-white transition-colors duration-300"
                    title="Partager sur X"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleShare('facebook', e)}
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground/80 hover:text-blue-600 hover:bg-white transition-colors duration-300"
                     title="Partager sur Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    className="flex items-center gap-1.5 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground/80 hover:text-primary transition-colors duration-300 group/like relative z-20"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 transition-transform duration-300 group-hover/like:scale-110 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium tabular-nums">{currentLikes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CineasticCard>

        {isModalOpen && (
          <Lightbox
            aphorism={aphorism}
            aphorismes={[aphorism]}
            onClose={() => setIsModalOpen(false)}
            onNavigate={() => { }}
          />
        )}
      </>
    )
  }

  // Render Text Card (Standard Mode)
  return (
    <>
      <CineasticCard
        className="flex flex-col group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col justify-center flex-grow">
          {aphorism.title && (
            <h3 className="font-display text-xl sm:text-2xl text-foreground font-normal mb-4 group-hover:text-primary transition-colors duration-500">
              {aphorism.title}
            </h3>
          )}

          <blockquote className="font-display text-lg leading-[1.7] text-foreground/70 mb-6">
            {displayText}
          </blockquote>

          <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border/30">
            <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {aphorism.tags?.map((tag) => (
                <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                  {tag}
                </TagPill>
              ))}
            </div>

            <div className="flex items-center gap-2">
               {shouldTruncate && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[10px] font-body uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors duration-300 mr-2"
                >
                  Lire
                </button>
              )}
              
              <button
                onClick={(e) => handleShare('twitter', e)}
                className="p-1.5 text-foreground/50 hover:text-black transition-colors duration-300"
                title="Partager sur X"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleShare('facebook', e)}
                className="p-1.5 text-foreground/50 hover:text-blue-600 transition-colors duration-300"
                title="Partager sur Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center gap-1.5 text-foreground/50 hover:text-primary transition-colors duration-300 group/like relative z-20"
              >
                <ThumbsUp className={`w-4 h-4 transition-transform duration-300 group-hover/like:scale-110 ${isLiked ? 'fill-current text-primary' : ''}`} />
                <span className="text-xs font-medium tabular-nums">{currentLikes}</span>
              </button>
            </div>
          </div>
        </div>
      </CineasticCard>

       <AphorismModal
        aphorism={aphorism}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
