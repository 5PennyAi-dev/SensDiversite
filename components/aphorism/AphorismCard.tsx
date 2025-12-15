'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Aphorism } from '@/types/aphorism'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { TagPill } from '@/components/ui/TagPill'
import { AphorismModal } from '@/components/ui/AphorismModal'

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

  return (
    <>
      <CineasticCard className="flex flex-col gap-6 group">
        {/* Image (Optional) */}
        {aphorism.imageUrl && (
          <div className="w-full -mx-6 -mt-6 sm:-mx-8 sm:-mt-8">
            <div className="relative w-full overflow-hidden">
              <Image
                src={aphorism.imageUrl}
                alt={aphorism.text.substring(0, 50)}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-center flex-grow">
          {/* Content - Hide text/title if image is present as it is embedded in the image */ }
          {!aphorism.imageUrl && (
            <>
              {aphorism.title && (
                <h3 className="font-display text-xl sm:text-2xl text-foreground/90 font-medium mb-4">
                  {aphorism.title}
                </h3>
              )}
              
              <blockquote className="font-display text-lg sm:text-xl leading-relaxed text-foreground/80 mb-6">
                {displayText}
              </blockquote>
            </>
          )}

          <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {aphorism.tags?.map((tag) => (
                <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                  {tag}
                </TagPill>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              {shouldTruncate && !aphorism.imageUrl && (
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
