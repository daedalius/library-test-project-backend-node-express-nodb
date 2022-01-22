import { Author } from './author'

export interface Book {
  id: string
  title: string
  description?: string
  coverUrl?: string
  authors: Author[]
}
