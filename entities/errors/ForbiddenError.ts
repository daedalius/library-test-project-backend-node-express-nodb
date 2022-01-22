export class ForbiddenError extends Error {
  code: number

  constructor(message = 'Forbidden') {
    super(message)
    this.code = 401
  }
}
