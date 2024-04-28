import { tokenType } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/user.requests'
import User from '~/models/schemas/user.schemas'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_EXPIRES_IN
      }
    })
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
    return { accessToken, refreshToken }
  }
  async checkEmailExist(email: string) {
    const result = await databaseServices.users.findOne({ email })
    return Boolean(result)
  }
  async login(user_id: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
    return { accessToken, refreshToken }
  }
}

const usersService = new UsersService()
export default usersService
