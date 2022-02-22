export default {
  '/authors': ['GET'],
  '/books': ['GET'],
  '/users': ['GET'],
  '/comments': ['GET', 'POST', 'PUT', 'DELETE'],
  '/copies/book/': ['GET'],
  '/copies/user/': ['GET'],
  '/copies/borrow/': ['POST'],
  '/copies/return/': ['POST'],
}
