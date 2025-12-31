export async function getAphorism(id: string) {
  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID
  if (!appId) return null

  try {
    const response = await fetch(`https://api.instantdb.com/runtime/apps/${appId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goals: {
          aphorismes: {
            $: {
              where: {
                id: id
              }
            }
          }
        }
      }),
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    const data = await response.json()
    return data.goals?.aphorismes?.[0] || null
  } catch (error) {
    console.error('Error fetching aphorism:', error)
    return null
  }
}
