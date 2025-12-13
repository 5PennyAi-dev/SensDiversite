'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { db, useAphorismes, deleteAphorism, updateAphorism } from '@/lib/instant'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react'
import type { Aphorism } from '@/types/aphorism'

export default function AdminPage() {
  const router = useRouter()
  const { data, isLoading } = useAphorismes()

  // Check authentication
  useEffect(() => {
    const user = db.auth.user
    if (!user) {
      router.push('/admin/login')
    }
  }, [router])

  // Handle logout
  const handleLogout = async () => {
    await db.auth.signOut()
    router.push('/admin/login')
  }

  // Handle delete with confirmation
  const handleDelete = async (aphorism: Aphorism) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cet aphorisme ?\n\n"${aphorism.text.substring(0, 50)}..."`)) {
      try {
        await deleteAphorism(aphorism.id)
      } catch (err) {
        alert('Erreur lors de la suppression')
      }
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (aphorism: Aphorism) => {
    try {
      await updateAphorism(aphorism.id, {
        featured: !aphorism.featured,
        text: aphorism.text,
        tags: aphorism.tags,
        imageUrl: aphorism.imageUrl
      })
    } catch (err) {
      alert('Erreur lors de la mise à jour')
    }
  }

  const aphorismes = data?.aphorismes ?? []
  const isAuthenticated = !!db.auth.user

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Vérification des droits d'accès...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with logout */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl mb-2">Tableau de Bord Admin</h1>
            <p className="text-muted-foreground">{aphorismes.length} aphorisme{aphorismes.length !== 1 ? 's' : ''} en ligne</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Link href="/admin/nouveau">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Créer un nouvel aphorisme</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Aphorismes list */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Chargement des aphorismes...</p>
          </div>
        ) : aphorismes.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-muted/30 rounded-lg border border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-muted-foreground text-lg mb-6">Aucun aphorisme trouvé</p>
            <Link href="/admin/nouveau">
              <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                Créer le premier aphorisme
              </span>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {aphorismes.map((aphorism) => (
              <motion.div
                key={aphorism.id}
                variants={itemVariants}
                className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start"
              >
                {/* Image thumbnail */}
                {aphorism.imageUrl && (
                  <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={aphorism.imageUrl}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Featured badge */}
                  {aphorism.featured && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs rounded-full mb-2">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Text preview */}
                  <p className="font-serif text-base mb-2 line-clamp-2">
                    "{aphorism.text}"
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {aphorism.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground">
                    {new Date(aphorism.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleToggleFeatured(aphorism)}
                    className={`p-2 rounded-lg transition-colors ${
                      aphorism.featured
                        ? 'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    title={aphorism.featured ? 'Retirer du slider' : 'Ajouter au slider'}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <Link href={`/admin/edit/${aphorism.id}`}>
                    <motion.button
                      className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  <motion.button
                    onClick={() => handleDelete(aphorism)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
