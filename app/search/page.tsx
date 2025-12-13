'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAphorismes } from '@/lib/instant'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

export default function SearchPage() {
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
      aphorism.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
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
    <main className="min-h-screen bg-background py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-serif text-4xl lg:text-5xl mb-8">Recherche</h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Recherchez par mots-clés ou thèmes..."
              className="w-full pl-12 pr-10 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Results section */}
        {debouncedQuery.trim() ? (
          <>
            {/* Result count */}
            <motion.p
              className="text-sm text-muted-foreground mb-8"
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
                    className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Highlighted text */}
                    <blockquote
                      className="font-serif text-lg leading-relaxed mb-4 text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: `"${highlightMatches(aphorism.text)}"`,
                      }}
                    />

                    {/* Highlight styles via global CSS */}
                    <style>{`
                      mark {
                        background-color: rgba(var(--primary), 0.2);
                        color: inherit;
                        font-weight: 600;
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
                            className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
                              tag.toLowerCase().includes(debouncedQuery.toLowerCase())
                                ? 'bg-primary/20 text-primary font-medium'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {tag}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground">
                      {new Date(aphorism.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-muted-foreground text-lg mb-6">
                  Aucun résultat trouvé pour "{debouncedQuery}"
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Essayez d'autres mots-clés ou consultez tous les thèmes
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Retour à l'accueil
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-muted-foreground text-lg">
              Entrez un mot-clé ou un thème pour commencer votre recherche
            </p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
