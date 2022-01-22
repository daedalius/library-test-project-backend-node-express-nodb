import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { Author, Book, BookCopy, BookDto, Comment, Credentials, User } from '#entities/index'

import * as authorsDal from './dal/authors'
import * as booksDal from './dal/books'
import * as usersDal from './dal/users'
import * as commentsDal from './dal/comments'
import * as bookCopiesDal from './dal/bookCopies'

import { tranformDtoToBook, getMentionedAuthorsId } from './helpers'
import { authMiddleware } from './helpers/sessionMiddleware'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(cookieParser('pepega'))
app.use(morgan(':remote-addr - :remote-user [:date] ":method [:status] :url HTTP/:http-version" ":referrer"'))
app.use(authMiddleware)

app
  .get<{ ids?: string }, Author[]>('/authors', async (req, res) => {
    const ids = req.query.ids as string
    const authorsIds: string[] = ids ? ids.split(',') : undefined
    res.send(await authorsDal.getAuthors(authorsIds))
  })
  .post<Author[], Author[]>('/authors', async (req, res) => {
    res.send(await authorsDal.addAuthors(req.body))
  })
  .put<Author[], Author[]>('/authors', async (req, res) => {
    res.send(await authorsDal.putAuthors(req.body))
  })
  .delete<string[], void>('/authors', async (req, res) => {
    const booksWithAuthors = await booksDal.getBooks({ authorIds: req.body })
    if (booksWithAuthors.length === 0) {
      return res.send(await authorsDal.deleteAuthors(req.body))
    }
    res.statusCode = 400
    res.statusMessage = 'Some authors are mentioned as authors of existing books'
    res.send()
  })

app
  .get<Book[]>('/books', async (req, res) => {
    const bookDtos = await booksDal.getBooks()
    const authors = await authorsDal.getAuthors(getMentionedAuthorsId(bookDtos))
    res.send(tranformDtoToBook(bookDtos, authors))
  })
  .post<BookDto[], Book[]>('/books', async (req, res) => {
    const authors = await authorsDal.getAuthors(getMentionedAuthorsId(req.body))
    res.send(tranformDtoToBook(await booksDal.addBooks(req.body), authors))
  })
  .put<BookDto[], Book[]>('/books', async (req, res) => {
    const authors = await authorsDal.getAuthors(getMentionedAuthorsId(req.body))
    res.send(tranformDtoToBook(await booksDal.putBooks(req.body), authors))
  })
  .delete<string[], void>('/books', async (req, res) => {
    res.send(await booksDal.deleteBooks(req.body))
  })

app
  .get<{ ids: string }, User[]>('/users', async (req, res) => {
    const ids = req.query.ids as string
    const userIds: string[] = ids ? ids.split(',') : undefined
    res.send(await usersDal.getUsers(userIds.map((i) => ({ id: i }))))
  })
  .post<User[], User[]>('/users', async (req, res) => {
    try {
      const newUsers = await usersDal.addUsers(req.body)
      res.send(newUsers)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  .put<User[], User[]>('/users', async (req, res) => {
    res.send(await usersDal.putUsers(req.body))
  })

app
  .get<{ bookId: string }, Comment[]>('/comments', async (req, res) => {
    const bookId = req.query.bookId as string
    res.send(await commentsDal.getCommentsForBook(bookId))
  })
  .post<Comment, Comment>('/comments', async (req, res) => {
    res.send(await commentsDal.addComment(req.body))
  })
  .put<Comment, Comment>('/comments', async (req, res) => {
    res.send(await commentsDal.putComment(req.body))
  })
  .delete<string[], void>('/comments', async (req, res) => {
    res.send(await commentsDal.deleteComments(req.body))
  })

app
  .get<{ bookId: string }, BookCopy[]>('/copies/book/:bookId', async (req, res) => {
    const { bookId } = req.params
    res.send(await bookCopiesDal.getBookCopies(bookId))
  })
  .get<{ bookIds: string }, BookCopy[]>('/copies/book/free', async (req, res) => {
    const bookIds = req.query.bookIds as string
    res.send(await bookCopiesDal.getFreeBookCopies(bookIds.split(',')))
  })
  .get<{ userId: string }, BookCopy[]>('/copies/user/:userId', async (req, res) => {
    const { userId } = req.params
    res.send(await bookCopiesDal.getBookCopiesOnUser(userId))
  })
  .post<BookCopy[], BookCopy[]>('/copies', async (req, res) => {
    res.send(await bookCopiesDal.addBookCopies(req.body))
  })
  .post<{ bookId: string; userId: string }, BookCopy>('/copies/borrow/:bookId/user/:userId', async (req, res) => {
    const { bookId, userId } = req.body
    try {
      res.send(await bookCopiesDal.borrowCopy(bookId, userId))
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  .post<{ id: string }, BookCopy>('/copies/return/:id', async (req, res) => {
    const { id } = req.params
    res.send(await bookCopiesDal.returnCopy(id))
  })
  .delete<string[], void>('/copies', async (req, res) => {
    res.send(await bookCopiesDal.deleteBookCopies(req.body))
  })
interface BookSearchCriteria {
  id?: string
  substring?: string
  authorIds?: string[]
  available?: 'true'
}
app.get<BookSearchCriteria, Book[]>('/search/books', async (req, res) => {
  const bookDtos = await booksDal.getBooks(req.query)
  const authors = await authorsDal.getAuthors(getMentionedAuthorsId(bookDtos))
  if (req.query.available === 'true') {
    const bookIds = bookDtos.map((b) => b.id)
    const freeBookCopies = await bookCopiesDal.getFreeBookCopies(bookIds)
    const freeBookIds = freeBookCopies.map((bc) => bc.bookId)
    const freeBooks = tranformDtoToBook(
      bookDtos.filter((b) => freeBookIds.includes(b.id)),
      authors
    )
    res.send(freeBooks)
    return
  }
  res.send(tranformDtoToBook(bookDtos, authors))
})

app.listen(3000, () => {
  return console.log(`Server is listening on 3000`)
})
