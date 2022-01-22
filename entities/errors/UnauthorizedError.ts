export class UnauthorizedError extends Error {
  code: number

  constructor(message = 'Unauthorized') {
    super(message)
    this.code = 401
  }
}
