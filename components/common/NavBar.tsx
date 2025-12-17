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

  const linkStyles = "text-xs font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <motion.div
            className="font-display font-medium text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Sens & Diversité
          </motion.div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="/" className={linkStyles}>
            Accueil
          </Link>
          <Link href="/galerie" className={linkStyles}>
            Aphorismes
          </Link>
          <Link href="/reflexions" className={linkStyles}>
            Réflexions
          </Link>
          <Link href="/apropos" className={linkStyles}>
            À propos
          </Link>
          <Link href="/admin" className={linkStyles}>
            Administration
          </Link>

          {/* Search form */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-48 px-4 py-2 text-sm font-body border border-white/10 rounded-full bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
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
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 absolute top-24 left-0 w-full shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-6 py-8 space-y-8">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-6 py-4 text-base font-body border border-white/10 rounded-xl bg-white/5 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              <div className="flex flex-col gap-6">
                <Link
                  href="/"
                  className={cn(linkStyles, "text-lg py-2 border-b border-white/5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/galerie"
                  className={cn(linkStyles, "text-lg py-2 border-b border-white/5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Aphorismes
                </Link>
                <Link
                  href="/reflexions"
                  className={cn(linkStyles, "text-lg py-2 border-b border-white/5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Réflexions
                </Link>
                <Link
                  href="/apropos"
                  className={cn(linkStyles, "text-lg py-2 border-b border-white/5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  À propos
                </Link>
                <Link
                   href="/admin"
                   className={cn(linkStyles, "text-lg py-2 border-b border-white/5")}
                   onClick={() => setIsMenuOpen(false)}
                >
                   Administration
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
