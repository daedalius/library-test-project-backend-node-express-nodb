import { v4 as uuidv4 } from 'uuid'

import { BookDto } from '#entities/index'
import { includesSomeOf } from 'service/helpers/includesSomeOf'

let booksData: BookDto[] = []

interface BookDtoSearchCriteria {
  id?: string
  substring?: string
  authorIds?: string[]
}
export async function getBooks(params: BookDtoSearchCriteria = {}) {
  if (typeof params.authorIds === 'string') {
    params.authorIds = [params.authorIds]
  }
  if (params.id || params.substring || params.authorIds?.length) {
    const { id, substring, authorIds } = params
    let result = booksData
    if (id) result = result.filter((b) => b.id === params.id)
    if (substring) result = result.filter((b) => b.title.includes(substring) || b.description.includes(substring))
    if (authorIds?.length) result = result.filter((b) => includesSomeOf(authorIds, b.authorIds))
    return result
  }

  return booksData
}

export async function addBooks(booksToAdd: BookDto[]) {
  const addedBooks = booksToAdd.map((b) => ({ ...b, id: uuidv4() }))
  booksData = [...booksData, ...addedBooks]
  return addedBooks
}

export async function putBooks(booksToPut: BookDto[]) {
  booksToPut.forEach((book) => {
    const index = booksData.findIndex((b) => b.id === book.id)
    booksData[index] = book
  })

  return booksToPut
}

export async function deleteBooks(ids: string[]) {
  booksData = booksData.filter((book) => !ids.includes(book.id))
  return
}
