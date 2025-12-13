'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            className="font-serif text-lg font-semibold hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
            Aphorismes
          </motion.div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-foreground/80 transition-colors">
            Accueil
          </Link>
          <Link href="/galerie" className="text-sm hover:text-foreground/80 transition-colors">
            Galerie
          </Link>

          {/* Search form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-40 px-3 py-1.5 text-sm border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu button & search */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => {
              const searchInput = document.querySelector('#mobile-search') as HTMLInputElement
              if (searchInput) {
                searchInput.focus()
              }
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-card border-t border-border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                id="mobile-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Mobile nav links */}
            <Link
              href="/"
              className="block px-2 py-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/galerie"
              className="block px-2 py-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Galerie
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
