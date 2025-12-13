'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/instant'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await db.auth.sendMagicCode({ email })
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await db.auth.signInWithMagicCode({ email, code })
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-12 rounded-sm border border-border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground font-sans">
            Enter your email to receive a magic code
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 text-center">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-sm focus:outline-none focus:border-primary bg-background text-foreground transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-medium transition-colors disabled:opacity-50 uppercase tracking-wide text-sm"
            >
              {loading ? 'Sending...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Magic Code
              </label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-sm focus:outline-none focus:border-primary bg-background text-foreground tracking-[0.5em] text-center text-xl"
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-medium transition-colors disabled:opacity-50 uppercase tracking-wide text-sm"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-xs text-muted-foreground hover:text-foreground underline"
            >
              Start over
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
