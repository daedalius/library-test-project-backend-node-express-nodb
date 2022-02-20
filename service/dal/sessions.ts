import { v4 as uuidv4 } from 'uuid'

import { NotFoundError } from '#entities/errors'

const sessionDurationMs = 1000 * 60 * 60

interface UserSession {
  id: string
  userId: string
  lastVisited: Date
}
const storedSessions: UserSession[] = []

export async function checkIfSessionIsActiveAndProlong(
  sessionId
): Promise<{ isActive: boolean; prolongationPeriodMs?: number }> {
  const session = storedSessions.find((s) => s.id === sessionId)
  if (!session)
    return {
      isActive: false,
    }

  const currentDate = new Date()
  session.lastVisited = currentDate
  const diff = currentDate.getMilliseconds() - session.lastVisited.getMilliseconds()
  const isActive = diff < sessionDurationMs

  return {
    isActive: isActive,
    prolongationPeriodMs: sessionDurationMs,
  }
}

export async function prolongSession(sessionId: string) {
  const session = storedSessions.find((s) => s.id === sessionId)
  session.lastVisited = new Date()
}

export async function getUserIdFromSession(sessionId): Promise<string> {
  const session = storedSessions.find((s) => s.id === sessionId)
  if (!session) throw new NotFoundError()

  return session.userId
}

/**
 * @returns session id
 */
export async function createSession(userId): Promise<{ id: string; durationMs: number }> {
  if (!userId) {
    throw new Error('User id is not provided')
  }

  const newSession: UserSession = {
    id: uuidv4(),
    userId: userId,
    lastVisited: new Date(),
  }
  storedSessions.push(newSession)

  return {
    id: newSession.id,
    durationMs: sessionDurationMs,
  }
}

export async function dropSession(sessionId: string) {
  const sessionToDropIndex = storedSessions.findIndex((s) => s.id === sessionId)
  if (sessionToDropIndex >= 0) {
    storedSessions.splice(sessionToDropIndex, 1)
  }
}
