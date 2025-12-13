'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { db, useAphorismes } from '@/lib/instant'
import { AphorismForm } from '@/components/admin/AphorismForm'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Aphorism } from '@/types/aphorism'

export default function EditAphorismPage() {
  const router = useRouter()
  const params = useParams()
  const aphorismId = params?.id as string
  const { data, isLoading } = useAphorismes()

  // Check authentication
  useEffect(() => {
    const user = db.auth.user
    if (!user) {
      router.push('/admin/login')
    }
  }, [router])

  const aphorism = (data?.aphorismes ?? []).find((a) => a.id === aphorismId) as Aphorism | undefined

  const handleSuccess = () => {
    router.push('/admin')
  }

  const isAuthenticated = !!db.auth.user

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Chargement de l'aphorisme...</p>
        </div>
      </div>
    )
  }

  if (!aphorism) {
    return (
      <main className="min-h-screen bg-background py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl mb-4">Aphorisme non trouvé</h1>
          <p className="text-muted-foreground mb-8">L'aphorisme demandé n'existe pas ou a été supprimé</p>
          <Link
            href="/admin"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour au tableau de bord</span>
          </Link>

          <h1 className="font-serif text-4xl lg:text-5xl">Éditer l'aphorisme</h1>
          <p className="text-muted-foreground mt-2">"{aphorism.text.substring(0, 80)}..."</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <AphorismForm
            aphorism={aphorism}
            onSuccess={handleSuccess}
            onCancel={() => router.push('/admin')}
          />
        </motion.div>
      </div>
    </main>
  )
}
