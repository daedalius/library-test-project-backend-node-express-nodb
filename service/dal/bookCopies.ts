import { v4 as uuidv4 } from 'uuid'

import { BookCopy } from '#entities/index'
import { BadRequestError } from '#entities/errors'

let bookCopiesData: BookCopy[] = []

export async function getBookCopies(bookId: string) {
  return bookCopiesData.filter((c) => c.bookId === bookId)
}

export async function addBookCopies(bookCopies: BookCopy[]) {
  const copiesCreated = bookCopies.map((c) => ({
    ...c,
    id: uuidv4(),
  }))

  bookCopiesData = [...bookCopiesData, ...copiesCreated]

  return copiesCreated
}

export async function deleteBookCopies(ids: string[]) {
  bookCopiesData = bookCopiesData.filter((bookCopy) => !ids.includes(bookCopy.id))
  return
}

export async function getFreeBookCopies(bookIds: string[]) {
  return bookCopiesData.filter((c) => bookIds.includes(c.bookId) && !c.userId)
}

export async function getBookCopiesOnUser(userId: string) {
  return bookCopiesData.filter((c) => c.userId === userId)
}

export async function borrowCopy(bookId: string, userId: string) {
  const firstFreeBookCopyIndex = bookCopiesData.findIndex((c) => c.bookId === bookId && !c.userId)
  if (firstFreeBookCopyIndex < 0) {
    throw new BadRequestError('No free copies available')
  }

  const isUserAlreadyOwnCopy = bookCopiesData.find((c) => c.userId === userId && c.bookId === bookId)
  if (isUserAlreadyOwnCopy) {
    throw new BadRequestError('User already own a copy')
  }

  firstFreeBookCopyIndex[firstFreeBookCopyIndex] = {
    ...firstFreeBookCopyIndex[firstFreeBookCopyIndex],
    userId: userId,
  }

  return firstFreeBookCopyIndex[firstFreeBookCopyIndex]
}

export async function returnCopy(id: string){
  const copyToReturnIndex = bookCopiesData.findIndex((c) => c.id === id)

  bookCopiesData[copyToReturnIndex] = {
    ...bookCopiesData[copyToReturnIndex],
    userId: null,
  }

  return bookCopiesData[copyToReturnIndex]
}
