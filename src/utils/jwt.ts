import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/user.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw rejects(err)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublickey }: { token: string; secretOrPublickey: string }) => {
  return new Promise<TokenPayload>((resolve, rejects) => {
    jwt.verify(token, secretOrPublickey, (err, decoded) => {
      if (err) {
        throw rejects(err)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
