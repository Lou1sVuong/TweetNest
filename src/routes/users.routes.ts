import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  meController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidation,
  changePasswordValidation,
  emailVerifyTokenValidation,
  followValidation,
  forgotPasswordValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  resetPasswordValidation,
  unfollowValidation,
  updateMeValidation,
  verifiedUserValidation,
  verifyForgotPasswordTokenValidation
} from '~/middlewares/users.middlewares'
import { updateMeReqBody } from '~/models/requests/user.requests'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouters = Router()
/* 
Description: This route is used to register a new user
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
Body: { refresh_token : string}
*/
usersRouters.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

/*
Description: Refresh token
Path: /refresh-token
Method: POST
Body: { refresh_token : string}
*/
usersRouters.post('/refresh-token', refreshTokenValidation, wrapRequestHandler(refreshTokenController))

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
usersRouters.patch(
  '/me',
  accessTokenValidation,
  verifiedUserValidation,
  updateMeValidation,
  filterMiddleware<updateMeReqBody>(['name', 'date_of_birth', 'bio', 'location', 'username', 'avatar', 'cover_photo']),
  wrapRequestHandler(updateMeController)
)

/*
Description: Get User Profile by id or username
Path: /:id
Method: GET
*/
usersRouters.get('/:user_id', wrapRequestHandler(getProfileController))

/*
Description: Follow Someone
Path: /follow
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { followed_user_id : string }
*/
usersRouters.post(
  '/follow',
  accessTokenValidation,
  verifiedUserValidation,
  followValidation,
  wrapRequestHandler(followController)
)

/*
Description: Unfollow Someone
Path: /follow
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { followed_user_id : string }
*/
usersRouters.delete(
  '/follow/:user_id',
  accessTokenValidation,
  verifiedUserValidation,
  unfollowValidation,
  wrapRequestHandler(unfollowController)
)

/*
Description: change password
Path: /change-password
Headers: { Authorization : Bearer <accessToken> }
Method: PUT
Body : { old_password : string , new_password : string , confirm_password : string }
*/
usersRouters.put(
  '/change-password',
  accessTokenValidation,
  verifiedUserValidation,
  changePasswordValidation,
  wrapRequestHandler(changePasswordController)
)

export default usersRouters
