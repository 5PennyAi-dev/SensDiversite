'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/galerie', label: 'Aphorismes' },
    { href: '/reflexions', label: 'Réflexions' },
    { href: '/apropos', label: 'À propos' },
  ]

  return (
    <motion.footer
      className="mt-32 pb-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="group">
              <h3 className="font-display text-xl text-foreground/90 group-hover:text-primary transition-colors duration-500">
                Le Sens et la Diversité
              </h3>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
              Une collection de fragments pour penser la complexité du monde.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-primary transition-colors duration-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40">
            © {currentYear} — Tous droits réservés
          </p>

          {/* Decorative dots */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <div className="w-1 h-1 rounded-full bg-primary/30" />
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
