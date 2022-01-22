import fetch from 'isomorphic-fetch'

export default async function (port = 3000) {
  const fetchUri = `http://127.0.0.1:${port}`

  const authors = await (
    await fetch(fetchUri + '/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          name: 'G. K. Chesterton',
        },
      ]),
    })
  ).json()
  console.log('authors', authors)

  const books = await (
    await fetch(fetchUri + '/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          title: 'The Man Who Was Thursday',
          description: 'The book has been described as a metaphysical thriller.',
          coverUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Chesterton_-_The_Man_Who_Was_Thursday.djvu/page1-377px-Chesterton_-_The_Man_Who_Was_Thursday.djvu.jpg',
          authorIds: [authors[0].id],
        },
      ]),
    })
  ).json()
  console.log('books', books)

  const users = await (
    await fetch(fetchUri + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          login: 'JohnDoe',
          avatarUrl: 'https://www.amongusavatarcreator.com/assets/img/user_images/avatars/Bc2HnQbRNLBJqTeXYpv11ZTE.png',
        },
      ]),
    })
  ).json()

  const comment = await (
    await fetch(fetchUri + '/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: books[0].id,
        userId: users[0].id,
        text: "I'm not big into books",
      }),
    })
  ).json()
  console.log('comment', comment)

  const copies = await (
    await fetch(fetchUri + '/copies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          bookId: books[0].id,
          userId: users[0].id,
        },
      ]),
    })
  ).json()
  console.log('copies: ', copies)
}
