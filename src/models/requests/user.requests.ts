import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enums'

export interface LoginReqBody {
  email: string
  password: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirmPassword: string
  date_of_birth: string
}
export interface LogoutReqBody {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: tokenType
}

export interface EmailVerifyReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface updateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface GetProfileReqParams {
  username: string
}
