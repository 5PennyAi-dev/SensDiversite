export interface Aphorism {
  id: string
  text: string
  tags: string[]
  imageUrl: string | null
  featured: boolean
  createdAt: number
  updatedAt: number
}

export type AphorismCreate = Omit<Aphorism, 'id' | 'createdAt' | 'updatedAt'>

export type AphorismUpdate = Partial<AphorismCreate>
