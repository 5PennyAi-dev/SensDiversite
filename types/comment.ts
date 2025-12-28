export interface Comment {
  id: string
  reflectionId: string
  authorName: string // "Anonyme" if not provided
  content: string
  createdAt: number
}

export interface CommentCreate {
  reflectionId: string
  authorName?: string
  content: string
}
