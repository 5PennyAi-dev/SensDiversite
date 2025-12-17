import { init, tx, id } from '@instantdb/react'
import { useMemo } from 'react'
import type { AphorismCreate, AphorismUpdate } from '@/types/aphorism'
import type { ReflectionCreate, ReflectionUpdate } from '@/types/reflection'

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
export function useReflections() {
  const result = db.useQuery({ reflections: {} })
  
  const sortedReflections = useMemo(() => {
    if (!result.data?.reflections) return undefined
    return [...result.data.reflections].sort((a: any, b: any) => b.createdAt - a.createdAt)
  }, [result.data?.reflections])

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

// Mutation functions
export async function createAphorism(data: AphorismCreate) {
  const newId = id()
  const now = Date.now()

  return db.transact(
    db.tx.aphorismes[newId].update({
      ...data,
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

export async function deleteAphorism(aphorismId: string) {
  return db.transact(db.tx.aphorismes[aphorismId].delete())
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
      id: newId,
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
