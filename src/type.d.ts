import {} from 'express'
import { TokenPayload } from '~/models/requests/user.requests'
import Tweet from '~/models/schemas/tweet.shemas'
import User from '~/models/schemas/user.schemas'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    tweet?: Tweet
  }
}
