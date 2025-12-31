import { Metadata } from 'next'
import { AphorismView } from './view'
import { getAphorism } from '@/lib/server-utils'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const aphorism = await getAphorism(params.id)

  if (!aphorism) {
    return {
      title: 'Aphorisme non trouvé | Sens & Diversité',
    }
  }

  const title = aphorism.title || 'Aphorisme'
  const description = aphorism.text?.slice(0, 160) || 'Une pensée à partager...'
  const imageUrl = aphorism.imageUrl

  return {
    title: `${title} | Sens & Diversité`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default function AphorismPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AphorismView id={params.id} />
    </main>
  )
}
