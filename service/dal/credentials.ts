import CryptoJS from 'crypto-js'

const saltFunction = (userId) => {
  const splitted = userId.split('-')
  return `${splitted[3]}pepega${splitted[2]}`
}

// Format is
// userId: encryptedPassword
const credentialsData = {}

/**
 * Register user credentials
 */
export function addNewUserCredentials(userId: string, plainPassword: string) {
  if (credentialsData[userId]) throw new Error('User is already registered')
  if (typeof plainPassword !== 'string' || plainPassword === '') throw new Error('Password is not provided')

  const encryptedPassword = CryptoJS.SHA3(plainPassword + saltFunction(userId)).toString()
  credentialsData[userId] = encryptedPassword
}

/**
 * Check if provided user credentials match with registered
 */
export function verifyUserCredentials(userId: string, plainPassword: string): boolean {
  const encryptedPassword = CryptoJS.SHA3(plainPassword + saltFunction(userId)).toString()
  return credentialsData[userId] === encryptedPassword
}

export async function reset() {
  Object.keys(credentialsData).forEach((key) => {
    delete credentialsData[key]
  })
  return
}
