import { v4 as uuidv4 } from 'uuid'

import { Author } from '#entities/Author'

let authorsData: Author[] = []

export async function getAuthors(ids?: string[]) {
  if (Array.isArray(ids) && ids.length !== 0) {
    return authorsData.filter((a) => ids.includes(a.id))
  }

  return authorsData
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
