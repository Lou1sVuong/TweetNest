import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/user.requests'
import { body } from 'express-validator'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'xuanvuong@gmail.com' && password === 'X.vuong24') {
    return res.json({ message: 'Login successfully' })
  }
  return res.status(400).json({ error: 'Email or password is incorrect' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return res.json({
      message: 'Register successfully',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
