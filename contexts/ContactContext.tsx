'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ContactModal } from '@/components/common/ContactModal'

interface ContactContextType {
  openContact: () => void
  closeContact: () => void
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openContact = () => setIsOpen(true)
  const closeContact = () => setIsOpen(false)

  return (
    <ContactContext.Provider value={{ openContact, closeContact }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeContact} />
    </ContactContext.Provider>
  )
}

export function useContact() {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}
