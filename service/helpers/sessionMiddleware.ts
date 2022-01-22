import { User } from '#entities/index'
import express from 'express'

import * as sessionsDal from '../dal/sessions'
import * as usersDal from '../dal/users'
import * as credentialsDal from '../dal/credentials'

export async function authMiddleware(req: express.Request, res: express.Response, next: Function) {
  switch (req.url) {
    case '/sign-in': {
      if (req.method === 'POST') {
        try {
          const { login, password } = req.body
          const user = await usersDal.getUserByLogin(login)

          if (await credentialsDal.verifyUserCredentials(user.id, password)) {
            const { id: sessionId, durationMs } = await sessionsDal.createSession(user.id)

            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.cookie('session-id', sessionId, { maxAge: durationMs, path: '/' })
            res.status(200).send()
            return
          } else {
            res.status(400)
            res.statusMessage = "User with that pair of login and password doesn't exist"
            res.send()
            return
          }
        } catch (e) {
          // res.status(400).send(e.message)
          res.status(400).send()
          return
        }
      }
      break
    }
    case '/sign-up': {
      if (req.method === 'POST') {
        try {
          const { login, password } = req.body
          const createdUser = (
            await usersDal.addUsers([
              // @ts-ignore
              { login: login },
            ])
          )[0] as User

          await credentialsDal.addNewUserCredentials(createdUser.id, password)
          const { id: sessionId, durationMs } = await sessionsDal.createSession(createdUser.id)

          res.cookie('session-id', sessionId, { maxAge: durationMs, path: '/' })
          res.status(200).send()
          return
        } catch (e) {
          // res.status(400).send(e.message)
          res.status(400).send('Unable to register user with that login/password pair')
          return
        }
      }
      break
    }
    case '/sign-out': {
      await sessionsDal.dropSession(req.cookies['session-id'])
      res.clearCookie('session-id')
      res.send()
      return
    }
  }

  const sessionId = req.cookies['session-id']
  const isActive = await sessionsDal.checkIfSessionIsActiveAndProlong(sessionId)
  if (isActive) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
    return
  } else {
    res.status(401).send()
    return
  }
}
