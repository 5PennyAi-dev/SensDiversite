import { init, tx, id } from '@instantdb/react'
import type { AphorismCreate, AphorismUpdate } from '@/types/aphorism'

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!

export const db = init({ appId: APP_ID })

// Query hooks
export function useAphorismes() {
  return db.useQuery({ aphorismes: {} })
}

export function useAphorismesByTag(tag: string) {
  return db.useQuery({
    aphorismes: {
      $: {
        where: {
          tags: tag,
        },
      },
    },
  })
}

export function useFeaturedAphorismes() {
  return db.useQuery({
    aphorismes: {
      $: {
        where: {
          featured: true,
        },
      },
    },
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
