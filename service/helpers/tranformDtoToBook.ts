import { Author, Book, BookDto } from '#entities/index'

export function tranformDtoToBook(bookDtos: BookDto[], authors: Author[]): Book[] {
  return bookDtos.map((bookDto) => {
    const bookAuthors = bookDto.authorIds.map((authorId) => authors.find((a) => a.id === authorId))
    const resultBook = { ...bookDto, authors: bookAuthors }
    delete resultBook.authorIds
    return resultBook
  })
}
