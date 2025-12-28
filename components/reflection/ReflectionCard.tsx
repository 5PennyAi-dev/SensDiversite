import Link from 'next/link'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { Reflection } from '@/types/reflection'

interface ReflectionCardProps {
  reflection: {
    id: string
    title: string
    content: string
    date: number
    tags?: string[]
    likes?: number
    dislikes?: number
  }
}

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  return (
    <Link href={`/reflexions/${reflection.id}`} className="block group">
      <CineasticCard className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
            {new Date(reflection.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
          </span>
          {reflection.tags && reflection.tags.length > 0 && (
            <>
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-primary/60">
                {reflection.tags[0]}
              </span>
            </>
          )}
        </div>

        <h3 className="font-display text-xl md:text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500 line-clamp-2">
          {reflection.title}
        </h3>

        <p className="font-body text-sm text-muted-foreground/70 leading-relaxed line-clamp-4 mb-6 flex-grow">
          {reflection.content
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/!left\(.*?\)/g, '')
            .replace(/!right\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '$1')
            .replace(/[#*`_]/g, '')
            .trim()
            .substring(0, 150)}...
        </p>

        {/* Footer with Read More + Likes (Read-Only) */}
        <div className="mt-auto flex items-center justify-between border-t border-border/30 pt-4">
          <div className="flex items-center text-[10px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors duration-300">
            Lire
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          <div className="flex items-center gap-3 text-muted-foreground/50">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span className="text-[10px] tabular-nums">{reflection.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-3 h-3" />
              <span className="text-[10px] tabular-nums">{reflection.dislikes || 0}</span>
            </div>
          </div>
        </div>
      </CineasticCard>
    </Link>
  )
}
