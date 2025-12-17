'use client'

import { useRouter } from 'next/navigation'
import { ReflectionForm } from '@/components/admin/ReflectionForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NewReflectionPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/reflections')
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/admin/reflections" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux réflexions</span>
          </Link>

          <h1 className="font-serif text-3xl lg:text-4xl text-foreground">Nouvelle Réflexion</h1>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
            <ReflectionForm onSuccess={handleSuccess} onCancel={() => router.push('/admin/reflections')} />
        </motion.div>
    </div>
  )
}
