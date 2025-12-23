import type { Metadata } from 'next'
import { Source_Sans_3, Playfair_Display } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/common/NavBar'
import { Footer } from '@/components/common/Footer'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Le Sens et la Diversité',
  description: 'Une collection de réflexions et aphorismes philosophiques',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${sourceSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-foreground transition-colors duration-500">
        <ThemeProvider>
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
