import { init, tx, id } from '@instantdb/react'
import { useMemo } from 'react'
import type { AphorismCreate, AphorismUpdate } from '@/types/aphorism'

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
