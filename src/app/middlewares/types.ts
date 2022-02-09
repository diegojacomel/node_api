import { Request, Response, NextFunction } from 'express'

export type ExpressMiddlewareHandler<
  R extends Request,
  E extends Response,
  N extends NextFunction
> = (req: R, res: E, next: N) => void | Promise<void>

export type ExpressMiddleware = ExpressMiddlewareHandler<
  Request,
  Response,
  NextFunction
>

export interface AuthRequest extends Request {
  userId: string | undefined
}
