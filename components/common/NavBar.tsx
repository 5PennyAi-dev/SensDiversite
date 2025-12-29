'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useContact } from '@/contexts/ContactContext'

export function NavBar() {
  const router = useRouter()
  const { openContact } = useContact()
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

  const linkStyles = "text-[11px] font-body font-medium tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500"

  return (
    <header className="sticky top-0 z-40">
      {/* Gradient fade from top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />

      <nav className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            <span className="font-display text-2xl md:text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-500">
              Le Sens et la Diversité
            </span>
          </motion.div>
        </Link>

        {/* Centered Desktop Nav - standard flex to avoid overlap */}
        <motion.div
          className="hidden lg:flex items-center gap-8 mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/galerie" className={linkStyles}>
            Aphorismes
          </Link>
          <Link href="/reflexions" className={linkStyles}>
            Réflexions
          </Link>
          <Link href="/apropos" className={linkStyles}>
            À propos
          </Link>
        </motion.div>

        {/* Desktop Utilities (Right) */}
        <motion.div
          className="hidden lg:flex items-center gap-6 relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/admin" className={cn(linkStyles, "hidden xl:block")}>
            Admin
          </Link>
          <button onClick={openContact} className={linkStyles}>
            Contact
          </button>

          <div className="w-px h-4 bg-border/50 mx-2" />

          {/* Search */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-32 xl:w-40 px-4 py-2 text-xs font-body bg-transparent border-b border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-500"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors duration-300"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Theme Toggle */}
          <ThemeToggle />
        </motion.div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 text-foreground/80 hover:text-primary transition-colors"
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 top-0 bg-background/98 backdrop-blur-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-6 p-3 text-foreground/80 hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center justify-center h-full px-8 py-16">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="w-full max-w-xs mb-12">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-3 text-sm font-body bg-transparent border-b border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all text-center"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <nav className="flex flex-col items-center gap-8">
                {[

                  { href: '/galerie', label: 'Aphorismes' },
                  { href: '/reflexions', label: 'Réflexions' },
                  { href: '/apropos', label: 'À propos' },
                  { href: '/admin', label: 'Administration' },
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="font-display text-3xl text-foreground/90 hover:text-primary transition-colors duration-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                 {/* Mobile Contact Button */}
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        openContact()
                      }}
                      className="font-display text-3xl text-foreground/90 hover:text-primary transition-colors duration-500"
                    >
                      Contact
                    </button>
                  </motion.div>
              </nav>

              {/* Tagline */}
              <motion.p
                className="absolute bottom-12 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Fragments philosophiques
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
