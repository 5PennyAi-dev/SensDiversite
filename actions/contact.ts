'use server'

interface ContactFormState {
  success: boolean
  message: string
}

export async function sendContactForm(prevState: ContactFormState | null, formData: FormData): Promise<ContactFormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  // Basic validation
  if (!email || !subject || !message) {
    return { success: false, message: 'Veuillez remplir tous les champs obligatoires.' }
  }

  try {
    // Using PRODUCTION webhook URL
    // IMPORTANT: You must ACTIVATE the workflow in n8n (top right toggle) for this to work.
    const webhookUrl = 'https://n8n.srv840060.hstgr.cloud/webhook/af0c413a-5448-4ad3-ba49-3d90636b100f'
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        senderEmail: email, // Renamed to clarify it's the user's email
        subject,
        message,
        app: 'SensDiversite',
        timestamp: new Date().toISOString()
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`)
    }

    return { success: true, message: 'Message envoyé avec succès !' }
  } catch (error: any) {
    console.error('Failed to send contact form:', error)
    return { 
      success: false, 
      message: `Erreur: ${error.message || "Une erreur est survenue"}` 
    }
  }
}
