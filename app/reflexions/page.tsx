'use client'

import { useReflections } from '@/lib/instant'
import type { Reflection } from '@/types/reflection'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CineasticCard } from '@/components/ui/CineasticCard'
import { LabelText, SectionTitle } from '@/components/ui/Typography'
import { SectionSeparator } from '@/components/ui/SectionSeparator'
import { HeroSection } from '@/components/common/HeroSection'

export default function ReflectionsPublicPage() {
  const { data, isLoading } = useReflections()
  
  const reflections = data?.reflections as Reflection[] | undefined
  const publishedReflections = reflections?.filter(r => r.published)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
       {/* Reusing HeroSection for consistent look OR simpler header */}
       <HeroSection />

       <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12">
          <SectionSeparator className="mb-8" />
          
          <div className="text-center mb-16">
             <LabelText className="mb-2 block">Exploration Longue</LabelText>
             <SectionTitle>Réflexions</SectionTitle>
             <p className="max-w-2xl mx-auto mt-4 text-muted-foreground font-serif text-lg">
                Pensées approfondies, articles et essais sur le sens et la diversité.
             </p>
          </div>

          {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3].map(i => (
                      <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl" />
                  ))}
              </div>
          ) : !publishedReflections || publishedReflections.length === 0 ? (
              <div className="text-center py-24 border border-white/5 rounded-xl bg-white/5">
                  <p className="text-muted-foreground italic font-serif text-xl">
                      Aucune réflexion publiée pour le moment.
                  </p>
              </div>
          ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                  {publishedReflections.map((ref) => (
                      <motion.div key={ref.id} variants={itemVariants}>
                          <Link href={`/reflexions/${ref.id}`} className="group block h-full">
                              <CineasticCard className="h-full flex flex-col hover:border-primary/30 transition-colors">
                                  <div className="mb-6">
                                      <span className="text-xs font-mono text-primary/70 uppercase tracking-widest block mb-2">
                                          {new Date(ref.createdAt).toLocaleDateString('fr-FR', {
                                              year: 'numeric',
                                              month: 'long', 
                                              day: 'numeric'
                                          })}
                                      </span>
                                      <h3 className="font-serif text-2xl text-foreground font-medium group-hover:text-primary transition-colors mb-4 line-clamp-2">
                                          {ref.title}
                                      </h3>
                                      <p className="text-muted-foreground line-clamp-4 font-serif leading-relaxed">
                                          {/* Simple way to get excerpt from markdown: remove special chars or just take substring */}
                                          {ref.content.replace(/[#*`_]/g, '').substring(0, 150)}...
                                      </p>
                                  </div>
                                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                                      <span className="text-primary uppercase tracking-widest text-xs font-bold group-hover:underline">Lire la suite</span>
                                  </div>
                              </CineasticCard>
                          </Link>
                      </motion.div>
                  ))}
              </motion.div>
          )}
       </div>
    </main>
  )
}
