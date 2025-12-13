'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NavBar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const linkStyles = "text-sm font-sans tracking-widest uppercase text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:underline hover:underline-offset-4 transition-all duration-300"

  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <motion.div
            className="font-serif text-2xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Sens & Diversité
          </motion.div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkStyles}>
            Accueil
          </Link>
          <Link href="/galerie" className={linkStyles}>
            Galerie
          </Link>
          <Link href="/apropos" className={linkStyles}>
            À propos
          </Link>

          {/* Search form */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-48 px-4 py-2 text-sm font-sans border border-[var(--border)] rounded-full bg-[var(--paper-2)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[var(--ink)] hover:bg-[var(--paper-2)] rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-[var(--paper)] border-b border-[var(--border)] absolute top-20 left-0 w-full shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-6 py-6 space-y-6">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un thème..."
                  className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--paper-2)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={cn(linkStyles, "text-base py-2 border-b border-[var(--border)]/50")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/galerie"
                  className={cn(linkStyles, "text-base py-2 border-b border-[var(--border)]/50")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galerie
                </Link>
                <Link
                  href="/apropos"
                  className={cn(linkStyles, "text-base py-2 border-b border-[var(--border)]/50")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  À propos
                </Link>
                <Link
                  href="/admin"
                   className={cn(linkStyles, "text-base py-2 border-b border-[var(--border)]/50")}
                   onClick={() => setIsMenuOpen(false)}
                >
                   Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
