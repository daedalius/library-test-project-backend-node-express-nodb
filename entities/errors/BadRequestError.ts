export class BadRequestError extends Error {
  code: number

  constructor(message = 'Bad Request') {
    super(message)
    this.code = 400
  }
}
