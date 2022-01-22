import { v4 as uuidv4 } from 'uuid'

import { Comment } from '#entities/index'

let commentsData: Comment[] = []

export async function getCommentsForBook(bookId: string): Promise<Comment[]> {
  return commentsData.filter((c) => c.bookId === bookId)
}

export async function addComment(comment: Comment): Promise<Comment> {
  const newComment = {
    ...comment,
    id: uuidv4(),
  }
  commentsData.push(newComment)

  return newComment
}

export async function putComment(comment: Comment): Promise<Comment> {
  const index = commentsData.findIndex((i) => i.id === comment.id)
  commentsData[index] = comment

  return comment
}

export async function deleteComments(ids: string[]) {
  commentsData = commentsData.filter((comment) => !ids.includes(comment.id))
  return
}
