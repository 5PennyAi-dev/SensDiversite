'use client'

import { HeroSection } from '@/components/common/HeroSection'
import { HomeCarousel } from '@/components/home/HomeCarousel'
import { LatestContentGrid } from '@/components/home/LatestContentGrid'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. Hero / Branding */}
      <HeroSection />
      
      {/* 2. Featured Carousel (immersive) - TEMPORARILY DISABLED
      <div className="mb-0">
        <HomeCarousel />
      </div>
      */}

      {/* 3. Mixed Latest Content Grid (Portfolio Style) */}
      <LatestContentGrid />

      {/* Admin link */}
      <div className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <a
          href="/admin"
          className="bg-card/90 backdrop-blur-md ring-1 ring-border text-xs px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary transition-all shadow-xl hover:shadow-primary/20"
        >
          Admin
        </a>
      </div>
    </main>
  )
}
