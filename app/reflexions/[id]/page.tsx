'use client'

import { useReflection, likeReflection, unlikeReflection, dislikeReflection, undislikeReflection } from '@/lib/instant'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { useState, useEffect } from 'react'
import rehypeRaw from 'rehype-raw'
import { Loader2, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroSection } from '@/components/common/HeroSection'
import { SectionTitle } from '@/components/ui/Typography'
import Image from 'next/image'
import { CommentSection } from '@/components/reflection/CommentSection'

export default function ReflectionDetailPage() {
  const { id } = useParams()
  const { data, isLoading } = useReflection(id as string)
  
  const reflection = data?.reflections?.[0]
  
  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null)
  const [optimisticDislikes, setOptimisticDislikes] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const currentLikes = optimisticLikes !== null ? optimisticLikes : (reflection ? (reflection.likes || 0) : 0)
  const currentDislikes = optimisticDislikes !== null ? optimisticDislikes : (reflection ? (reflection.dislikes || 0) : 0)

  useEffect(() => {
    if (reflection?.id) {
      const likedReflections = JSON.parse(localStorage.getItem('liked_reflections') || '[]')
      const dislikedReflections = JSON.parse(localStorage.getItem('disliked_reflections') || '[]')
      
      setIsLiked(likedReflections.includes(reflection.id))
      setIsDisliked(dislikedReflections.includes(reflection.id))
    }
  }, [reflection?.id])

  const handleLike = async () => {
    if (!reflection) return
    
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
    
    setOptimisticLikes(newLikes)
    setIsLiked(newIsLiked)

    // Update Local Storage immediately to avoid race conditions with optimistic UI updates
    const likedReflections = JSON.parse(localStorage.getItem('liked_reflections') || '[]')
    
    if (newIsLiked) {
      if (!likedReflections.includes(reflection.id)) {
        likedReflections.push(reflection.id)
      }
    } else {
      const index = likedReflections.indexOf(reflection.id)
      if (index > -1) {
        likedReflections.splice(index, 1)
      }
    }
    localStorage.setItem('liked_reflections', JSON.stringify(likedReflections))
    
    // Perform mutation
    if (newIsLiked) {
      try {
        await likeReflection(reflection.id, currentLikes)
      } catch (error) {
        console.error('Failed to like reflection:', error)
        // Revert on error could be added here, but simplicity first
      }
    } else {
      try {
        await unlikeReflection(reflection.id, currentLikes)
      } catch (error) {
        console.error('Failed to unlike reflection:', error)
      }
    }
  }

  const handleDislike = async () => {
    if (!reflection) return
    
    const newIsDisliked = !isDisliked
    const newDislikes = newIsDisliked ? currentDislikes + 1 : Math.max(0, currentDislikes - 1)
    
    setOptimisticDislikes(newDislikes)
    setIsDisliked(newIsDisliked)

    // Update Local Storage immediately
    const dislikedReflections = JSON.parse(localStorage.getItem('disliked_reflections') || '[]')
    
    if (newIsDisliked) {
      if (!dislikedReflections.includes(reflection.id)) {
        dislikedReflections.push(reflection.id)
      }
    } else {
      const index = dislikedReflections.indexOf(reflection.id)
      if (index > -1) {
        dislikedReflections.splice(index, 1)
      }
    }
    localStorage.setItem('disliked_reflections', JSON.stringify(dislikedReflections))
    
    // Perform mutation
    if (newIsDisliked) {
      try {
        await dislikeReflection(reflection.id, currentDislikes)
      } catch (error) {
        console.error('Failed to dislike reflection:', error)
      }
    } else {
      try {
        await undislikeReflection(reflection.id, currentDislikes)
      } catch (error) {
        console.error('Failed to undislike reflection:', error)
      }
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    )
  }

  if (!reflection) {
     return (
        <div className="min-h-screen pt-32 text-center bg-background px-4">
             <h1 className="text-3xl font-serif text-foreground mb-4">Réflexion introuvable</h1>
             <Link href="/reflexions" className="text-primary hover:underline">
                Retour à la liste
             </Link>
        </div>
     )
  }

  return (
    <main className="min-h-screen bg-background">
       <div className="h-[22vh] relative flex items-center justify-center bg-muted overflow-hidden">
            {/* Background Image if available - using first image or a pattern */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            
            {reflection.images && reflection.images.length > 0 && (
                <Image 
                    src={reflection.images[0]} 
                    alt="Cover" 
                    fill 
                    className="object-cover opacity-50 blur-sm scale-110" 
                />
            )}

            <div className="relative z-20 text-center max-w-4xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-primary/80 text-sm font-mono tracking-widest uppercase mb-4">
                        {new Date(reflection.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                        })}
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                        {reflection.title}
                    </h1>
                </motion.div>
            </div>
       </div>

       {/* Reading Zone - Theme-aware with comfortable contrast */}
       <div className="relative bg-[#f8f5f0] dark:bg-[#1a1816] min-h-screen transition-colors duration-500">
            {/* Subtle paper texture */}
            <div className="absolute inset-0 opacity-30 dark:opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }} />

            <div className="relative max-w-2xl mx-auto px-6 sm:px-8 py-12 lg:py-20">
                <Link href="/reflexions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux réflexions</span>
                </Link>

                <motion.article
                    className="prose prose-lg max-w-none
                        prose-headings:font-display prose-headings:tracking-tight
                        prose-headings:text-[#2a2418] dark:prose-headings:text-[#e8e0d4]
                        prose-h2:text-3xl prose-h2:sm:text-4xl prose-h2:md:text-5xl prose-h2:mt-12 prose-h2:mb-6
                        prose-h3:text-2xl prose-h3:sm:text-3xl prose-h3:md:text-4xl prose-h3:mt-10 prose-h3:mb-4
                        prose-p:text-[#3d3428] dark:prose-p:text-[#c5bba8]
                        prose-p:text-lg prose-p:sm:text-xl prose-p:md:text-2xl prose-p:leading-relaxed
                        prose-strong:text-[#2a2418] dark:prose-strong:text-[#d4c9b8] prose-strong:font-semibold
                        prose-em:text-[#4a3f30] dark:prose-em:text-[#b8a892]
                        prose-li:text-[#3d3428] dark:prose-li:text-[#c5bba8]
                        prose-li:text-lg prose-li:sm:text-xl prose-li:md:text-2xl prose-li:leading-relaxed
                        prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
                        prose-blockquote:border-l-primary prose-blockquote:border-l-4
                        prose-blockquote:bg-[#f0ebe3] dark:prose-blockquote:bg-[#242220]
                        prose-blockquote:text-[#4a3f30] dark:prose-blockquote:text-[#b8a892]
                        prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:my-8
                        prose-img:rounded-lg prose-img:my-10 prose-img:shadow-lg
                        first-letter:text-6xl first-letter:md:text-7xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1
                        [&_p]:font-[Georgia,_serif] [&_li]:font-[Georgia,_serif] [&_blockquote]:font-[Georgia,_serif]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            img: ({node, ...props}) => {
                                const alt = props.alt?.toLowerCase() || ""
                                const isLeft = alt.includes("left") || alt.includes("gauche")
                                const isRight = alt.includes("right") || alt.includes("droite")

                                if (isLeft) {
                                    return (
                                        <span className="float-left mr-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-lg overflow-hidden border border-border shadow-lg clear-left">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                {...props}
                                                className="w-full h-auto block !m-0"
                                                alt={props.alt || "Illustration"}
                                            />
                                        </span>
                                    )
                                }

                                if (isRight) {
                                    return (
                                        <span className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-lg overflow-hidden border border-border shadow-lg clear-right">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                {...props}
                                                className="w-full h-auto block !m-0"
                                                alt={props.alt || "Illustration"}
                                            />
                                        </span>
                                    )
                                }

                                // Default center/full width
                                return (
                                    <span className="block my-12 rounded-lg overflow-hidden border border-border shadow-lg clear-both">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            {...props}
                                            className="w-full h-auto block !m-0"
                                            alt={props.alt || "Illustration"}
                                        />
                                    </span>
                                )
                            }
                        }}
                    >
                        {reflection.content}
                    </ReactMarkdown>
                </motion.article>

                <div className="py-12 flex justify-center">
                  <div className="flex gap-8">
                    <button 
                      onClick={handleLike}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={`p-4 rounded-full transition-colors ${isLiked ? 'bg-primary/10 text-primary' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {currentLikes}
                      </span>
                    </button>

                    <button 
                      onClick={handleDislike}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={`p-4 rounded-full transition-colors ${isDisliked ? 'bg-destructive/10 text-destructive' : 'bg-muted group-hover:bg-destructive/10 group-hover:text-destructive'}`}>
                        <ThumbsDown className={`w-6 h-6 ${isDisliked ? 'fill-current' : ''}`} />
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {currentDislikes}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-12">
                   <CommentSection reflectionId={reflection.id} />
                </div>


            </div>
       </div>
    </main>
  )
}
