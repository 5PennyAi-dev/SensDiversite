'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Aphorism } from '@/types/aphorism'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { TagPill } from '@/components/ui/TagPill'
import { AphorismModal } from '@/components/ui/AphorismModal'
import { Lightbox } from '@/components/gallery/Lightbox'

interface AphorismCardProps {
  aphorism: Aphorism
}

export function AphorismCard({ aphorism }: AphorismCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            <div className="relative w-full">
              <Image
                src={aphorism.imageUrl}
                alt={aphorism.title || "Aphorisme"}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay Gradient & Tags */}
              <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {aphorism.tags?.slice(0, 3).map((tag) => (
                        <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`} className="bg-white/10 hover:bg-white/20 border-white/10 text-white/90">
                            {tag}
                        </TagPill>
                    ))}
                  </div>
              </div>
            </div>
        </CineasticCard>

        {isModalOpen && (
             <Lightbox 
               aphorism={aphorism}
               aphorismes={[aphorism]} 
               onClose={() => setIsModalOpen(false)}
               onNavigate={() => {}}
             />
        )}
      </>
    )
  }

  // Render Text Card (Standard Mode)
  return (
    <>
      <CineasticCard 
        className="flex flex-col gap-6 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col justify-center flex-grow">
          {aphorism.title && (
            <h3 className="font-display text-xl sm:text-2xl text-foreground/90 font-medium mb-4">
              {aphorism.title}
            </h3>
          )}
          
          <blockquote className="font-display text-lg sm:text-xl leading-relaxed text-foreground/80 mb-6">
            {displayText}
          </blockquote>

          <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              {aphorism.tags?.map((tag) => (
                <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                  {tag}
                </TagPill>
              ))}
            </div>
            
            <div className="flex gap-4">
              {shouldTruncate && (
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="text-xs font-body uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors"
                 >
                   Voir plus
                 </button>
              )}
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
