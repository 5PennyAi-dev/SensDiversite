'use client'

import { HeroSection } from '@/components/common/HeroSection'
import { TagCloud } from '@/components/tags/TagCloud'
import { AphorismList } from '@/components/aphorism/AphorismList'

export default function Home() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Tag Cloud Navigation */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-center mb-12">Explorer par thème</h2>
          <TagCloud />
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl mb-12">Collection Complète</h2>
          <AphorismList />
        </div>
      </section>

      {/* Admin link for testing */}
      <div className="text-center py-8 bg-background/50">
        <a
          href="/admin/test"
          className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80 transition-colors"
        >
          Admin Test Page
        </a>
      </div>
    </main>
  )
}
