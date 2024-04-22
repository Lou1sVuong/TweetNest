import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidation } from '~/middlewares/users.middlewares'
const usersRouters = Router()

usersRouters.post('/login', loginValidation, loginController)
usersRouters.get('/test', (req, res) => {
  res.json({ message: 'api users is working :)' })
})

export default usersRouters
