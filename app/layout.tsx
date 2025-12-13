import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/common/NavBar'
import { Footer } from '@/components/common/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
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
    <html lang="fr" className={`${inter.variable} ${crimson.variable}`}>
      <body className="font-sans antialiased">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
