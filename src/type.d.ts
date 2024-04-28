import {} from 'express'
import User from '~/models/schemas/user.schemas'
declare module 'express' {
  interface Request {
    user?: User
  }
}
