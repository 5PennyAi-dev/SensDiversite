'use client'

import { useReflection } from '@/lib/instant'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroSection } from '@/components/common/HeroSection'
import { SectionTitle } from '@/components/ui/Typography'
import Image from 'next/image'

export default function ReflectionDetailPage() {
  const { id } = useParams()
  const { data, isLoading } = useReflection(id as string)
  
  const reflection = data?.reflections?.[0]

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

       <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
            <Link href="/reflexions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour aux réflexions</span>
            </Link>

            <motion.article 
                className="prose prose-invert prose-lg !text-gray-200 prose-headings:!text-white prose-p:!text-gray-200 prose-strong:!text-white prose-li:!text-gray-200 prose-headings:font-serif prose-p:font-serif prose-p:leading-loose prose-a:text-primary prose-img:rounded-xl prose-img:my-8 prose-img:shadow-2xl prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:!text-gray-300 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic [&_*]:!text-gray-200 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_strong]:!text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <ReactMarkdown
                    components={{
                        img: ({node, ...props}) => {
                            const alt = props.alt?.toLowerCase() || ""
                            const isLeft = alt.includes("left") || alt.includes("gauche")
                            const isRight = alt.includes("right") || alt.includes("droite")
                            
                            if (isLeft) {
                                return (
                                    <span className="float-left mr-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-left">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            {...props} 
                                            className="w-full h-auto object-contain" 
                                            alt={props.alt || "Illustration"} 
                                        />
                                    </span>
                                )
                            }

                            if (isRight) {
                                return (
                                    <span className="float-right ml-8 mb-6 w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-right">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            {...props} 
                                            className="w-full h-auto object-contain" 
                                            alt={props.alt || "Illustration"} 
                                        />
                                    </span>
                                )
                            }

                            // Default center/full width
                            return (
                                <span className="block my-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl clear-both">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        {...props} 
                                        className="w-full h-auto object-contain" 
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
            
            <div className="border-t border-white/10 mt-16 pt-12 flex justify-between items-center text-sm text-muted-foreground">
                 <span>Partager cette réflexion</span>
                 {/* Social links placeholder */}
                 <div className="flex gap-4">
                     <button className="hover:text-foreground">X</button>
                     <button className="hover:text-foreground">LinkedIn</button>
                     <button className="hover:text-foreground">Facebook</button>
                 </div>
            </div>
       </div>
    </main>
  )
}
