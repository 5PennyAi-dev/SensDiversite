'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Aphorism } from '@/types/aphorism'
import { PaperCard } from '@/components/ui/PaperCard'
import { TagPill } from '@/components/ui/TagPill'

interface AphorismCardProps {
  aphorism: Aphorism
}

export function AphorismCard({ aphorism }: AphorismCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Truncation logic
  const WORD_LIMIT = 100 // Reduced from 150 to ensure button appears for moderately long texts
  const words = aphorism.text.trim().split(/\s+/)
  const shouldTruncate = words.length > WORD_LIMIT
  
  const displayText = isExpanded || !shouldTruncate
    ? aphorism.text
    : words.slice(0, WORD_LIMIT).join(' ') + '...'

  return (
    <PaperCard className="flex flex-col md:flex-row gap-6 md:gap-8 group">
      {/* Image (Optional) */}
      {aphorism.imageUrl && (
        <div className="w-full md:w-1/3 shrink-0">
          <div className="relative aspect-[4/5] md:aspect-square w-full rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
            <Image
              src={aphorism.imageUrl}
              alt={aphorism.text.substring(0, 50)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-center flex-grow py-2">
        {aphorism.title && (
          <h3 className="font-serif text-xl text-[var(--ink)] font-semibold mb-3">
            {aphorism.title}
          </h3>
        )}
        
        <blockquote className="font-serif text-xl sm:text-2xl leading-relaxed text-[var(--ink)] mb-6">
          {displayText}
        </blockquote>

        <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)]/50">
          <div className="flex flex-wrap gap-2">
            {aphorism.tags?.map((tag) => (
              <TagPill key={tag} href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}>
                {tag}
              </TagPill>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex gap-4">
            {shouldTruncate && (
               <button 
                 onClick={() => setIsExpanded(!isExpanded)}
                 className="text-xs font-sans uppercase tracking-widest text-[var(--accent)] hover:underline"
               >
                 {isExpanded ? 'Voir moins...' : 'Voir plus...'}
               </button>
            )}
            
            {/* "Lire" label removed or replaced behavior as requested? 
                User said: "Il y a actuellement un label 'LIRE' sur les cartes. Il faudrait le changer pour, par exemple, 'Voir plus...', ou qqch dans le genre, et ne l'afficher que dans le cas où tout le texte n'est pas affiché."
                So if not truncated, we show nothing? Or keep "Lire" for short ones?
                "ne l'afficher que dans le cas où tout le texte n'est pas affiché" -> Show nothing if full text is visible.
            */}
          </div>
        </div>
      </div>
    </PaperCard>
  )
}
