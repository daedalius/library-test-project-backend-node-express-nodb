import { v4 as uuidv4 } from 'uuid'

import { BookDto } from '#entities/index'
import { includesSomeOf } from 'service/helpers/includesSomeOf'

let booksData: BookDto[] = []

interface BookDtoSearchCriteria {
  latest?: number,
  ids?: string[]
  substring?: string
  authorIds?: string[]
}
export async function getBooks(params: BookDtoSearchCriteria = { latest: 10 }) {
  if (params.latest) {
    return booksData.slice(-10, booksData.length)
  }

  // TODO: what?
  if (typeof params.authorIds === 'string') {
    params.authorIds = [params.authorIds]
  }
  if (params.ids || params.substring || params.authorIds?.length) {
    const { ids, substring, authorIds } = params
    let result = booksData
    if (ids) result = result.filter((b) => params.ids.includes(b.id))
    if (substring) {
      const substringToSearch = substring.toUpperCase()
      result = result.filter((b) => b.title.toUpperCase().includes(substringToSearch) || b.description.toUpperCase().includes(substringToSearch))
    }
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
