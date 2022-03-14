import { v4 as uuidv4 } from 'uuid'

import { Author } from '#entities/Author'

let authorsData: Author[] = []

export async function getAuthors(ids?: string[], substring?: string) {
  let result = authorsData

  if (ids || substring) {
    if (Array.isArray(ids) && ids.length !== 0) {
      result = authorsData.filter((a) => ids.includes(a.id))
    }

    if (substring) {
      const substringToMatch = substring.toUpperCase()
      result = result.filter((a) => a.name.toUpperCase().includes(substringToMatch))
    }
  }

  return result
}

export async function addAuthors(authorsToAdd: Author[]) {
  const authorsCreated: Author[] = authorsToAdd.map((a) => ({ ...a, id: uuidv4() }))
  authorsData = [...authorsData, ...authorsCreated]
  return authorsCreated
}

export async function putAuthors(authorsToPut: Author[]) {
  authorsToPut.forEach((author) => {
    const index = authorsData.findIndex((a) => a.id === author.id)
    authorsData[index] = author
  })

  return authorsToPut
}

export async function deleteAuthors(ids: string[]) {
  authorsData = authorsData.filter((i) => !ids.includes(i.id))
  return
}

export async function reset() {
  authorsData = []
  return
}
