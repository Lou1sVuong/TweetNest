import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'xuanvuong@gmail.com' && password === '123456') {
    return res.json({ message: 'Login successfully' })
  }
  return res.status(400).json({ error: 'Email or password is incorrect' })
}
