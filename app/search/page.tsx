'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAphorismes } from '@/lib/instant'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  const { data } = useAphorismes()
  const aphorismes = data?.aphorismes ?? []

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  // Filter results based on debounced query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return []

    const lowerQuery = debouncedQuery.toLowerCase()
    return aphorismes.filter((aphorism) =>
      aphorism.text.toLowerCase().includes(lowerQuery) ||
      aphorism.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    )
  }, [debouncedQuery, aphorismes])

  // Highlight matching terms
  const highlightMatches = (text: string) => {
    if (!debouncedQuery.trim()) return text

    const regex = new RegExp(`(${debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, idx) =>
      regex.test(part) ? `<mark key=${idx}>${part}</mark>` : part
    ).join('')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <>
      {/* Search bar */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-primary/40" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">
            Exploration
          </span>
        </div>

        <h1 className="font-display text-4xl lg:text-5xl mb-8 text-foreground tracking-tight">Recherche</h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherchez par mots-clés ou thèmes..."
            className="w-full pl-12 pr-10 py-3 border-b border-border/30 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all duration-500 font-body"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-card transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-muted-foreground/50" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Results section */}
      {debouncedQuery.trim() ? (
        <>
          {/* Result count */}
          <motion.p
            className="text-sm text-muted-foreground/60 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {results.length} résultat{results.length !== 1 ? 's' : ''} pour "{debouncedQuery}"
          </motion.p>

          {/* Results list */}
          {results.length > 0 ? (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {results.map((aphorism) => (
                <motion.article
                  key={aphorism.id}
                  variants={itemVariants}
                  className="overflow-hidden bg-card/60 rounded-lg border border-border/30 hover:border-primary/20 transition-all duration-500"
                >
                  {/* Image */}
                  {aphorism.imageUrl && (
                    <div className="relative w-full h-56">
                      <Image
                        src={aphorism.imageUrl}
                        alt={aphorism.text.substring(0, 100)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                  )}

                  {/* Text content */}
                  <div className="p-6">
                    {/* Highlighted text */}
                    <blockquote
                      className="font-display text-lg leading-relaxed mb-4 text-foreground/80"
                      dangerouslySetInnerHTML={{
                        __html: `"${highlightMatches(aphorism.text)}"`,
                      }}
                    />

                    {/* Highlight styles via global CSS */}
                    <style>{`
                      mark {
                        background-color: hsl(var(--primary) / 0.2);
                        color: inherit;
                        font-weight: 500;
                        padding: 0 2px;
                        border-radius: 2px;
                      }
                    `}</style>

                    {/* Tags with highlight */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {aphorism.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/theme/${encodeURIComponent(tag.toLowerCase())}`}
                        >
                          <span
                            className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all duration-300 ${
                              tag.toLowerCase().includes(debouncedQuery.toLowerCase())
                                ? 'bg-primary/20 text-primary'
                                : 'bg-card text-muted-foreground/60 hover:text-foreground'
                            }`}
                          >
                            {tag}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40">
                      {new Date(aphorism.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-muted-foreground/60 font-display text-xl italic mb-4">
                Aucun résultat pour "{debouncedQuery}"
              </p>
              <Link
                href="/"
                className="text-[11px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors"
              >
                Retour à l'accueil
              </Link>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="text-muted-foreground/60 font-display text-lg italic">
            Entrez un mot-clé pour commencer
          </p>
        </motion.div>
      )}
    </>
  )
}

function SearchFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <Suspense fallback={<SearchFallback />}>
          <SearchContent />
        </Suspense>
      </div>
    </main>
  )
}
