import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  emailVerifyTokenValidation,
  forgotPasswordValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  resetPasswordValidation,
  verifiedUserValidation,
  verifyForgotPasswordTokenValidation
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
Description: This route is used to logout
Path: /logout
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { refreshToken : string}
*/
usersRouters.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

/*
Description: Verify email when user click on the link in the email
Path: /verify-email
Method: POST
Body: { email_verification_token : string}
*/
usersRouters.post('/verify-email', emailVerifyTokenValidation, wrapRequestHandler(verifyEmailController))

/*
Description: Resend email verification token
Path: /resend-verify-email
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { }
*/
usersRouters.post('/resend-verify-email', accessTokenValidation, wrapRequestHandler(resendVerifyEmailController))

/*
Description: Submit email to reset password , send email to user
Path: /forgot-password
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { }
*/
usersRouters.post('/forgot-password', forgotPasswordValidation, wrapRequestHandler(forgotPasswordController))

/*
Description: Verify email when user click on the link in the email to reset password
Path: /verify-forgot-password
Method: POST
Body: { forgot_password_token : string }
*/
usersRouters.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidation,
  wrapRequestHandler(verifyForgotPasswordController)
)

/*
Description: Reset password
Path: /reset-password
Method: POST
Body: { forgot_password_token : string , password : string , confirm_password : string }
*/
usersRouters.post('/reset-password', resetPasswordValidation, wrapRequestHandler(resetPasswordController))

/*
Description: Get my profile
Path: /me
Headers: { Authorization : Bearer <accessToken> }
Method: GET
*/
usersRouters.get('/me', accessTokenValidation, wrapRequestHandler(meController))

/*
Description: Update my profile
Path: /me
Headers: { Authorization : Bearer <accessToken> }
Method: PATCH
Body : User Schema
*/
usersRouters.patch('/me', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(updateMeController))

export default usersRouters
