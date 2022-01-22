export interface BookDto {
  id: string
  title: string
  description?: string
  coverUrl?: string
  authorIds: string[]
}
