export class NotFoundError extends Error {
  code: number

  constructor(message = 'Not Found') {
    super(message)
    this.code = 404
  }
}
