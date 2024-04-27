import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve(fn(req, res, next)).catch(next)
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
