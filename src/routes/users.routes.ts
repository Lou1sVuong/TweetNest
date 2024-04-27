import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidation, registerValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouters = Router()
/* 
Description: This route is used to register a new user
Path: /register
Method: POST
Body: { "name": "string", "email": "string", "password": "string", "confirmPassword": "string" ,"data_of_birth": ISO08601}
 */
usersRouters.post('/register', registerValidation, wrapRequestHandler(registerController))
// usersRouters.post('/register', registerValidation, registerController)
usersRouters.post('/login', loginValidation, loginController)

export default usersRouters
