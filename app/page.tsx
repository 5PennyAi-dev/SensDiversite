'use client'

import { HeroSection } from '@/components/common/HeroSection'
import { HomeCarousel } from '@/components/home/HomeCarousel'
import { AphorismList } from '@/components/aphorism/AphorismList'
import { TagCloud } from '@/components/tags/TagCloud'
import { SectionSeparator } from '@/components/ui/SectionSeparator'
import { SectionTitle, LabelText } from '@/components/ui/Typography'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. Featured Carousel */}
      <div className="mb-0">
        <HomeCarousel />
      </div>

      <SectionSeparator className="mb-4 mt-2" />

      {/* 3. Themes / Index */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-6">
             <LabelText className="mb-2 block">Explorer les thèmes</LabelText>
             <SectionTitle>Index des thèmes</SectionTitle>
          </div>
          <TagCloud />
        </div>
      </section>

      <SectionSeparator className="my-4" />

      {/* 4. Collection / Liste */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
             <SectionTitle>Collection</SectionTitle>
          </div>
          <AphorismList />
        </div>
      </section>

      {/* Admin link */}
      <div className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <a
          href="/admin"
          className="bg-white/5 backdrop-blur-sm ring-1 ring-white/10 text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors shadow-xl"
        >
          Admin
        </a>
      </div>
    </main>
  )
}
