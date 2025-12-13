'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { db } from '@/lib/instant'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Note: For InstantDB, authentication is typically handled through
      // the instantDB auth module. Update this with the correct auth method.
      // For now, we'll use a simple authentication pattern.

      // Try to authenticate with InstantDB
      const user = await (db.auth as any).signInWithPassword?.({
        email,
        password
      })

      if (user) {
        setTimeout(() => {
          router.push('/admin')
        }, 300)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentification échouée'
      setError(message)
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.5 }
    }
  }

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full max-w-md"
        variants={formVariants}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl mb-2">Aphorismes</h1>
          <h2 className="text-lg text-muted-foreground">Espace Administrateur</h2>
        </div>

        {/* Form Card */}
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <motion.div
                className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 disabled:opacity-50"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 disabled:opacity-50"
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </motion.button>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              Connectez-vous avec vos identifiants administrateur
            </p>
          </form>
        </div>

        {/* Footer link */}
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </motion.div>
    </motion.main>
  )
}
