'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, MessageSquare, Loader2, Trash2 } from 'lucide-react'
import { useComments, createComment, deleteComment } from '@/lib/instant' // Added deleteComment import
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CommentSectionProps {
  reflectionId: string
}

export function CommentSection({ reflectionId }: CommentSectionProps) {
  const { data, isLoading } = useComments(reflectionId)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await createComment({
        reflectionId,
        authorName: authorName.trim() || undefined,
        content: content.trim()
      })
      setContent('')
      // Keep author name for convenience
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Optional: Function to handle deletion (can be exposed only if needed, or for debugging)
  const handleDelete = async (commentId: string) => {
      if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
          try {
              await deleteComment(commentId)
          } catch (error) {
              console.error('Failed to delete comment:', error)
          }
      }
  }

  const comments = data?.comments || []

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12 border-t-2 border-border">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-2xl font-serif text-[#2a2418] dark:text-[#e8e0d4]">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white dark:bg-[#242220] p-6 rounded-lg shadow-sm border border-border/50">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
            Nom (optionnel)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              id="name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Votre nom"
              className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-1">
            Votre commentaire
          </label>
          <textarea
            id="comment"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez votre réflexion..."
            required
            className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publier
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {isLoading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
             </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground italic py-8">
            Soyez le premier à commenter cette réflexion.
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {comments.map((comment: any) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-[#fcfbf9] dark:bg-[#1e1c1a] p-5 rounded-lg border border-border/40"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#2a2418] dark:text-[#e8e0d4] block leading-tight">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                   {/* Optional delete button for cleanup/admin (can be hidden or protected later) */}
                   {/* <button 
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-destructive hover:bg-destructive/10 rounded"
                        title="Supprimer"
                   >
                       <Trash2 className="w-4 h-4" />
                   </button> */}
                </div>
                <p className="text-[#3d3428] dark:text-[#c5bba8] text-sm leading-relaxed pl-10 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
