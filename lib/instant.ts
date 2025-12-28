import { init, tx, id } from '@instantdb/react'
import { useMemo } from 'react'
import type { AphorismCreate, AphorismUpdate } from '@/types/aphorism'
import type { ReflectionCreate, ReflectionUpdate } from '@/types/reflection'
import type { CommentCreate } from '@/types/comment'

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!

export const db = init({ appId: APP_ID })

// Query hooks
export function useAphorismes() {
  const result = db.useQuery({ aphorismes: {} })
  
  const sortedAphorismes = useMemo(() => {
    if (!result.data?.aphorismes) return undefined
    return [...result.data.aphorismes].sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.aphorismes])

  if (sortedAphorismes) {
    return {
      ...result,
      data: {
        ...result.data,
        aphorismes: sortedAphorismes
      }
    }
  }
  return result
}

export function useAphorismesByTag(tag: string) {
  const result = db.useQuery({
    aphorismes: {
      $: {
        where: {
          tags: tag,
        },
      },
    },
  })
  
  const sortedAphorismes = useMemo(() => {
    if (!result.data?.aphorismes) return undefined
    return [...result.data.aphorismes].sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.aphorismes])

  if (sortedAphorismes) {
    return {
      ...result,
      data: {
        ...result.data,
        aphorismes: sortedAphorismes
      }
    }
  }
  return result
}

export function useFeaturedAphorismes() {
  const result = db.useQuery({
    aphorismes: {
      $: {
        where: {
          featured: true,
        },
      },
    },
  })
  
  const sortedAphorismes = useMemo(() => {
    if (!result.data?.aphorismes) return undefined
    return [...result.data.aphorismes].sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.aphorismes])

  if (sortedAphorismes) {
    return {
      ...result,
      data: {
        ...result.data,
        aphorismes: sortedAphorismes
      }
    }
  }
  return result
}

// Tag hooks
export function useTags() {
  return db.useQuery({ tags: {} })
}

// Reflection hooks
// Reflection hooks
export function useReflections() {
  const result = db.useQuery({ 
    reflections: {},
    comments: {} 
  })
  
  const sortedReflections = useMemo(() => {
    if (!result.data?.reflections) return undefined
    
    // Create a map of comments by reflectionId for O(1) lookup
    const commentsByReflectionId = (result.data?.comments || []).reduce((acc: any, comment: any) => {
      if (!acc[comment.reflectionId]) {
        acc[comment.reflectionId] = []
      }
      acc[comment.reflectionId].push(comment)
      return acc
    }, {})

    return [...result.data.reflections]
      .map((r: any) => ({
         ...r,
         comments: commentsByReflectionId[r.id] || []
      }))
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.reflections, result.data?.comments])

  if (sortedReflections) {
    return {
      ...result,
      data: {
        ...result.data,
        reflections: sortedReflections
      }
    }
  }
  return result
}

export function useReflection(id: string) {
  return db.useQuery({  
    reflections: {
      $: {
        where: {
          id: id
        }
      }
    } 
  })
}

export function useComments(reflectionId: string) {
  const result = db.useQuery({
    comments: {
      $: {
        where: {
          reflectionId: reflectionId
        }
      }
    }
  })

  const sortedComments = useMemo(() => {
    if (!result.data?.comments) return undefined
    return [...result.data.comments].sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.comments])

  if (sortedComments) {
    return {
      ...result,
      data: {
        ...result.data,
        comments: sortedComments
      }
    }
  }
  return result
}

// Mutation functions
export async function createAphorism(data: AphorismCreate) {
  const newId = id()
  const now = Date.now()

  return db.transact(
    db.tx.aphorismes[newId].update({
      ...data,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    })
  )
}

export async function updateAphorism(aphorismId: string, data: AphorismUpdate) {
  return db.transact(
    db.tx.aphorismes[aphorismId].update({
      ...data,
      updatedAt: Date.now(),
    })
  )
}

export async function likeAphorism(aphorismId: string, currentLikes: number) {
  return db.transact(
    db.tx.aphorismes[aphorismId].update({
      likes: (currentLikes || 0) + 1,
      updatedAt: Date.now(),
    })
  )
}

export async function deleteAphorism(aphorismId: string) {
  return db.transact(db.tx.aphorismes[aphorismId].delete())
}

export async function unlikeAphorism(aphorismId: string, currentLikes: number) {
  return db.transact(
    db.tx.aphorismes[aphorismId].update({
      likes: Math.max(0, (currentLikes || 0) - 1),
      updatedAt: Date.now(),
    })
  )
}

// Tag mutations
export async function createTag(label: string) {
  const newId = id()
  const now = Date.now()
  
  return db.transact(
    db.tx.tags[newId].update({
      label,
      createdAt: now,
    })
  )
}

export async function deleteTag(tagId: string) {
  return db.transact(db.tx.tags[tagId].delete())
}

// Reflection mutations
export async function createReflection(data: ReflectionCreate) {
  const newId = id()
  const now = Date.now()

  return db.transact(
    db.tx.reflections[newId].update({
      ...data,
      ...data,
      id: newId,
      likes: 0,
      dislikes: 0,
      createdAt: now,
      updatedAt: now,
    })
  )
}

export async function updateReflection(reflectionId: string, data: ReflectionUpdate) {
  return db.transact(
    db.tx.reflections[reflectionId].update({
      ...data,
      updatedAt: Date.now(),
    })
  )
}

export async function deleteReflection(reflectionId: string) {
  return db.transact(db.tx.reflections[reflectionId].delete())
}

export async function likeReflection(reflectionId: string, currentLikes: number) {
  return db.transact(
    db.tx.reflections[reflectionId].update({
      likes: (currentLikes || 0) + 1,
      updatedAt: Date.now(),
    })
  )
}

export async function dislikeReflection(reflectionId: string, currentDislikes: number) {
  return db.transact(
    db.tx.reflections[reflectionId].update({
      dislikes: (currentDislikes || 0) + 1,
      updatedAt: Date.now(),
    })
  )
}

export async function unlikeReflection(reflectionId: string, currentLikes: number) {
  return db.transact(
    db.tx.reflections[reflectionId].update({
      likes: Math.max(0, (currentLikes || 0) - 1),
      updatedAt: Date.now(),
    })
  )
}

// Comment mutations
export async function createComment(data: CommentCreate) {
  const newId = id()
  const now = Date.now()

  return db.transact(
    db.tx.comments[newId].update({
      id: newId,
      reflectionId: data.reflectionId,
      authorName: data.authorName || "Anonyme",
      content: data.content,
      createdAt: now,
    })
  )
}

export async function deleteComment(commentId: string) {
  return db.transact(db.tx.comments[commentId].delete())
}
