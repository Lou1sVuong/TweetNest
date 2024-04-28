import { config } from 'dotenv'
import { createHash } from 'node:crypto'
config()

export function sha256(content: string) {
  return createHash('sha3-256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + process.env.HASH_SALT)
}
