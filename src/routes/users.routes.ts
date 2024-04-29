import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouters = Router()
/* 
Description: This route is used to register a new user
Path: /register
Method: POST
Body: { "name": "string", "email": "string", "password": "string", "confirmPassword": "string" ,"data_of_birth": ISO08601}
 */
usersRouters.post('/register', registerValidation, wrapRequestHandler(registerController))
/*
Description: This route is used to login
Path: /login
Method: POST
Body: { "email": "string", "password": "string" }
 */
usersRouters.post('/login', loginValidation, wrapRequestHandler(loginController))
/*
escription: This route is used to logout
Path: /logout
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { refreshToken : string}
*/
usersRouters.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

export default usersRouters
