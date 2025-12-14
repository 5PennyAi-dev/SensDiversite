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
      className="border-t border-white/5 bg-background mt-32"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-display text-xl mb-4 text-foreground/90">Sens & Diversité</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une collection élégante de réflexions philosophiques, organisées par thème pour faciliter la découverte et l'inspiration.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body font-medium text-sm uppercase tracking-[0.2em] mb-4 text-foreground/70">Explorez</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-body font-medium text-sm uppercase tracking-[0.2em] mb-4 text-foreground/70">Administration</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground/60">
            <p>© {currentYear} Sens & Diversité. All rights reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
