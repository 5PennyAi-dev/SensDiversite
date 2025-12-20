export interface SavedImage {
  url: string
  prompt: string
  params: {
    aspectRatio: string
    style_family: string
    typo_style: string
    scene?: string
  }
  createdAt: number
}

export interface Aphorism {
  id: string
  text: string
  title?: string
  tags: string[]
  imageUrl: string | null
  images?: (string | SavedImage)[] // persistent library of generated images
  featured: boolean
  createdAt: number
  updatedAt: number
}

export type AphorismCreate = Omit<Aphorism, 'id' | 'createdAt' | 'updatedAt'>

export type AphorismUpdate = Partial<AphorismCreate>
