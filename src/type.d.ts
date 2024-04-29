import {} from 'express'
import { TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/user.schemas'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
