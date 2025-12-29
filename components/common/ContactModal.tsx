'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Check, Send, Loader2 } from 'lucide-react'
import { sendContactForm } from '@/actions/contact'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form')
      setErrorMessage(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await sendContactForm(null, formData)
      
      if (result.success) {
        setStep('success')
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage("Une erreur inattendue est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-card border border-border/40 p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {step === 'success' ? (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center justify-center py-12 text-center space-y-6"
               >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Message envoyé</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                  </p>
               </motion.div>
            ) : (
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <h2 className="font-display text-3xl text-foreground tracking-tight">
                      Contact
                    </h2>
                    <p className="text-sm font-body text-muted-foreground/80 leading-relaxed max-w-sm mx-auto">
                      Envoyez-moi un message directement via ce formulaire.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground/70">Nom</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Votre nom"
                          className="w-full px-4 py-2 bg-muted/20 border border-border/40 focus:border-primary/60 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30 font-body"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground/70">Email <span className="text-primary">*</span></label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="votre@email.com"
                          className="w-full px-4 py-2 bg-muted/20 border border-border/40 focus:border-primary/60 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30 font-body"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs uppercase tracking-widest text-muted-foreground/70">Sujet <span className="text-primary">*</span></label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          placeholder="Objet de votre message"
                          className="w-full px-4 py-2 bg-muted/20 border border-border/40 focus:border-primary/60 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30 font-body"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground/70">Message <span className="text-primary">*</span></label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          placeholder="Votre message..."
                          rows={5}
                          className="w-full px-4 py-2 bg-muted/20 border border-border/40 focus:border-primary/60 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30 font-body resize-none"
                        />
                    </div>

                    {errorMessage && (
                      <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-foreground text-background font-medium text-sm tracking-wide uppercase hover:bg-foreground/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest">
                      * Champs obligatoires
                    </p>
                  </form>

                  {/* Decorative line */}
                  <div className="flex justify-center pt-2 opacity-30">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-8 h-px bg-primary" />
                        <div className="w-1 h-1 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
