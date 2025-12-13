'use client'

import { HeroSection } from '@/components/common/HeroSection'
import { HomeCarousel } from '@/components/home/HomeCarousel'
import { AphorismList } from '@/components/aphorism/AphorismList'
import { TagCloud } from '@/components/tags/TagCloud'
import { SectionSeparator } from '@/components/ui/SectionSeparator'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      {/* 1. Hero / Préface */}
      <HeroSection />
      
      {/* Reduced separation here */}
      <div className="mb-0">
        <HomeCarousel />
      </div>

      <SectionSeparator className="mb-6 mt-2" />

      {/* 3. Thèmes / Index */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-6">
             <h2 className="font-serif text-3xl text-[var(--ink)] italic mb-2">Index des thèmes</h2>
             <p className="text-[var(--muted-foreground)] text-sm font-sans uppercase tracking-widest">Explorer par sujet</p>
          </div>
          <TagCloud />
        </div>
      </section>

      <SectionSeparator />

      {/* 4. Collection / Liste */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
             <h2 className="font-serif text-3xl sm:text-4xl text-[var(--ink)]">Collection</h2>
          </div>
          <AphorismList />
        </div>
      </section>

      {/* Admin link */}
      <div className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <a
          href="/admin"
          className="bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--border)] text-xs px-3 py-1.5 rounded-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors shadow-sm"
        >
          Admin
        </a>
      </div>
    </main>
  )
}
