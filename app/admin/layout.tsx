'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { db } from '@/lib/instant'
import { LogOut, Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, error } = db.useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname?.startsWith('/admin/login')

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [user, isLoading, router, isLoginPage])

  // If on login page, just render children without auth check or dashboard shell
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!process.env.NEXT_PUBLIC_INSTANT_APP_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive p-4 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
          <p>Missing NEXT_PUBLIC_INSTANT_APP_ID environment variable.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        Error: {error.message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="font-serif text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  const handleLogout = async () => {
    await db.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium">
                <a 
                  href="/admin" 
                  className={`transition-colors py-2 border-b-2 ${pathname === '/admin' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Collection
                </a>
                <a 
                  href="/admin/image-generation" 
                  className={`transition-colors py-2 border-b-2 ${pathname?.startsWith('/admin/image-generation') ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Générateur
                </a>
            </nav>
            <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground font-mono">
              {user.email}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
