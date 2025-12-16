export interface Reflection {
  id: string
  title: string
  content: string // Markdown content
  images: string[] // URLs of generated images associated with this reflection
  slug: string
  published: boolean
  createdAt: number
  updatedAt: number
}

export interface ReflectionCreate {
  title: string
  content: string
  images: string[]
  slug: string
  published: boolean
}

export interface ReflectionUpdate {
  title?: string
  content?: string
  images?: string[]
  slug?: string
  published?: boolean
}
