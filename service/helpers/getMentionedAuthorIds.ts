import { BookDto } from '#entities/index'

export function getMentionedAuthorsId(bookDtos: BookDto[]): string[] {
  const uniqAuthorIds = new Set<string>()
  bookDtos.forEach((book) => book.authorIds.forEach(id => uniqAuthorIds.add(id)))
  return Array.from(uniqAuthorIds)
}
