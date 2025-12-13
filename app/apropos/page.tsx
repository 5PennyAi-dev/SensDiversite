'use client'

import { motion } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SectionSeparator } from '@/components/ui/SectionSeparator'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] py-12 lg:py-20">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="font-serif text-4xl sm:text-5xl text-[var(--ink)]">À propos</h1>
          <h2 className="font-sans text-lg md:text-xl text-[var(--muted-foreground)] leading-relaxed">Le sens et la diversité</h2>
        </motion.div>

        {/* Exergue */}
        <motion.blockquote 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center font-serif text-xl sm:text-2xl leading-relaxed text-[var(--ink)] mb-16 italic opacity-80"
        >
          "Une pensée sans corps ? Cela n'existe pas."
        </motion.blockquote>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-8 font-sans text-lg md:text-xl leading-relaxed text-[var(--muted-foreground)]"
        >
          <p>
            Ce site rassemble des aphorismes et réflexions tirés de mon ouvrage <em className="text-[var(--accent-soft)]">Le sens et la diversité</em>, fruit de plusieurs années d'écriture, de notes prises au fil du temps, d'observations clarifiées peu à peu. Ces pensées s'inscrivent dans une philosophie de l'immanence qui affirme la primauté du corps — dans la pensée, dans notre élaboration de la réalité, dans notre relation à l'existence.
          </p>
          <p>
            La pensée ne va pas au-delà du corps et elle ne vaut que pour lui. Elle pense du sens, et puisque ce sens n'est pas perçu directement par les sens, c'est le corps lui-même qui en est le créateur. Penser est donc une activité créatrice, un art que l'on pratique avec son corps. La pensée est organique, tissée dans notre chair, évoluant à son rythme.
          </p>
          <p>
            Le corps produit les pensées dont il a besoin et façonne une vérité qui lui est propre. Mais tout n'est pas relatif pour autant : nous partageons un corps humain dont les similitudes dépassent les différences. De cette ressemblance fondamentale émerge l'objectivité du sens.
          </p>
          <p>
            Vous trouverez ici des réflexions sur l'existence, la matière, le sens, la réalité, la volonté, la pensée, le langage, le corps, la connaissance, l'homme, la vie — et bien d'autres thèmes qui se sont dégagés au fil du temps pour former une certaine cohérence.
          </p>
          <p className="text-center italic text-[var(--muted-foreground)] mt-8">
            À lire dans l'ordre ou dans le désordre.
          </p>
        </motion.div>

        <SectionSeparator />

        {/* Author Bio */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7, duration: 0.6 }}
        >
          <PaperCard className="bg-[var(--paper-2)] p-8 sm:p-10">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--accent)] mb-6 text-center">L'Auteur</h3>
            <p className="font-serif text-lg leading-relaxed text-[var(--ink)]">
              <span className="font-bold text-[var(--accent)] text-xl small-caps mr-1">Dourliac</span> est originaire de la région de Québec. Après des études en philosophie à l'Université Laval, il a poursuivi une carrière en informatique, mais la philosophie est toujours restée sa passion — une quête de sens perpétuelle qui l'a mené à explorer la physique, la psychologie, l'évolution et la littérature. À travers ses lectures, il a reconnu en Montaigne, Schopenhauer et Nietzsche ses guides les plus inspirants sur le chemin de la connaissance de soi.
            </p>
          </PaperCard>
        </motion.div>

      </div>
    </main>
  )
}
