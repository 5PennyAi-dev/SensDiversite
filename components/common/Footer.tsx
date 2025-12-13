'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.footer
      className="border-t border-border/50 bg-muted/30 mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg mb-4">Aphorismes Philosophiques</h3>
            <p className="text-sm text-muted-foreground">
              Une collection élégante de réflexions philosophiques, organisées par thème pour faciliter la découverte et l'inspiration.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-sm mb-4">Explorez</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-muted-foreground hover:text-foreground transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Rechercher
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-medium text-sm mb-4">Administration</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© {currentYear} Aphorismes Philosophiques. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
