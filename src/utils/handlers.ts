import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = <P>(fn: RequestHandler<P, any, any, any>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    // Promise.resolve(fn(req, res, next)).catch(next)
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
