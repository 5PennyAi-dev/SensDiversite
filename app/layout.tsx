import type { Metadata } from 'next'
import { Inter, EB_Garamond } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/common/NavBar'
import { Footer } from '@/components/common/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Aphorismes Philosophiques',
  description: 'Une collection de réflexions et aphorismes philosophiques',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body className="font-sans antialiased text-ink bg-paper">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
