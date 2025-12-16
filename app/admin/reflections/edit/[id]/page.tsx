'use client'

import { useRouter } from 'next/navigation'
import { ReflectionForm } from '@/components/admin/ReflectionForm'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useReflection } from '@/lib/instant'
import type { Reflection } from '@/types/reflection'

export default function EditReflectionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data, isLoading } = useReflection(params.id)
  
  const reflection = data?.reflections?.[0] as Reflection | undefined

  const handleSuccess = () => {
    router.push('/admin/reflections')
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    )
  }

  if (!reflection) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-serif mb-4">Réflexion introuvable</h2>
            <Link href="/admin/reflections" className="text-primary hover:underline">
                Retour à la liste
            </Link>
        </div>
    )
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

          <h1 className="font-serif text-3xl lg:text-4xl text-foreground">Modifier la Réflexion</h1>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
            <ReflectionForm 
                reflection={reflection}
                onSuccess={handleSuccess} 
                onCancel={() => router.push('/admin/reflections')} 
            />
        </motion.div>
    </div>
  )
}
