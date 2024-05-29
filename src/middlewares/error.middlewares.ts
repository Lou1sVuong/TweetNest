import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/errors'

// Helper function to handle circular structures
function getCircularReplacer() {
  const seen = new WeakSet()
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, 'status'))
  }

  const finalError: any = {}
  Object.getOwnPropertyNames(err).forEach((key) => {
    if (
      !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
      !Object.getOwnPropertyDescriptor(err, key)?.writable
    ) {
      return (finalError[key] = err[key])
    }
  })

  const safeError = JSON.stringify(finalError, getCircularReplacer())

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: finalError.message,
    errorInfo: omit(JSON.parse(safeError), ['stack']) // Parsing back to object to use `omit`
  })
}
