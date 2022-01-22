import { v4 as uuidv4 } from 'uuid'

import { User } from '#entities/index'

let usersData: User[] = []

export async function getUsers(users: { id: string }[]) {
  const requestedUsersId = users.map((u) => u.id)

  return Promise.resolve(usersData.filter((u) => requestedUsersId.includes(u.id)))
}

export async function addUsers(usersToAdd: User[]) {
  {
    // Ensuring login uniqueness

    const newUsersLogins = new Set(usersToAdd.map((u) => u.login))
    if (newUsersLogins.size < usersToAdd.length) {
      throw new Error('User login should be uniq')
    }
    if (usersData.find((u) => newUsersLogins.has(u.login))) {
      throw new Error('User with that login is already exists')
    }
  }

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
    if (usersData[index].login === user.login) {
      usersData[index] = user
    } else {
      throw new Error('Not allowed to change logins')
    }
  })

  return Promise.resolve(usersToPut)
}

export async function getUserByLogin(login: string) {
  return usersData.find((u) => u.login === login)
}
