export interface Reflection {
  id: string
  title: string
  content: string // Markdown content
  images: string[] // URLs of generated images associated with this reflection
  slug: string
  published: boolean
  tags?: string[] // Optional for backward compatibility
  createdAt: number
  updatedAt: number
  likes?: number
  dislikes?: number
}

export interface ReflectionCreate {
  title: string
  content: string
  images: string[]
  slug: string
  published: boolean
  published: boolean
  tags?: string[]
  likes?: number
  dislikes?: number
}

export interface ReflectionUpdate {
  title?: string
  content?: string
  images?: string[]
  slug?: string
  published?: boolean
  tags?: string[]
}
