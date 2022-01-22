import { v4 as uuidv4 } from 'uuid'

import { User } from '#entities/index'

let usersData: User[] = []

export async function getUsers(users: { id: string }[]) {
  const requestedUsersId = users.map((u) => u.id)

  return Promise.resolve(usersData.filter((u) => requestedUsersId.includes(u.id)))
}

export async function addUsers(usersToAdd: User[]) {
  const addedUsers = usersToAdd.map((u) => ({
    ...u,
    id: uuidv4(),
  }))

  usersData = [...usersData, ...addedUsers]

  return addedUsers
}

export async function putUsers(usersToPut: User[]) {
  usersToPut.forEach((user) => {
    const index = usersData.findIndex((u) => u.id === user.id)
    usersData[index] = user
  })

  return Promise.resolve(usersToPut)
}
