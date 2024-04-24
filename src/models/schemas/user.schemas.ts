import { ObjectId } from 'mongodb'
import { userVerificationStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verification_token?: string
  forgot_password_token?: string
  verification_status?: userVerificationStatus

  //optional
  bio?: string
  lacation?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verification_token: string
  forgot_password_token: string
  verification_status: userVerificationStatus

  bio: string
  lacation: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verification_token = user.email_verification_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verification_status = user.verification_status || userVerificationStatus.Unverified
    this.bio = user.bio || ''
    this.lacation = user.lacation || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}
