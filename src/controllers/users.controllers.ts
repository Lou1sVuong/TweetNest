import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/user.requests'
import { ErrorWithStatus } from '~/models/errors'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'xuanvuong@gmail.com' && password === 'X.vuong24') {
    throw new ErrorWithStatus({ message: 'Login Successfully', status: 200 })
  }
  throw new ErrorWithStatus({ message: 'Email or password is incorrect', status: 400 })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register successfully',
    result
  })
}
