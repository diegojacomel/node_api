// Modules
import jwt from 'jsonwebtoken'

// Config
import authConfig from '../../config/auth.json'

// Types
import { Response, NextFunction } from 'express'
import { AuthRequest } from './types'

// Middleware authentication
function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' })
  }

  const parts: string[] = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }

  jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' })
    }

    req.userId = decoded.id

    return next()
  })
}

module.exports = {
  authMiddleware
}
