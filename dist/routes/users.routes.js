"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const common_middlewares_1 = require("../middlewares/common.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const usersRouters = (0, express_1.Router)();
/*
Description: This route is used to register a new user
Method: POST
Body: { "name": "string", "email": "string", "password": "string", "confirmPassword": "string" ,"data_of_birth": ISO08601}
 */
usersRouters.post('/register', users_middlewares_1.registerValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.registerController));
/*
Description: This route is used to login
Path: /login
Method: POST
Body: { "email": "string", "password": "string" }
 */
usersRouters.post('/login', users_middlewares_1.loginValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.loginController));
/*
Description: This route is used to logout
Path: /logout
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { refresh_token : string}
*/
usersRouters.post('/logout', users_middlewares_1.accessTokenValidation, users_middlewares_1.refreshTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.logoutController));
/*
Description: Refresh token
Path: /refresh-token
Method: POST
Body: { refresh_token : string}
*/
usersRouters.post('/refresh-token', users_middlewares_1.refreshTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.refreshTokenController));
/*
Description: Verify email when user click on the link in the email
Path: /verify-email
Method: POST
Body: { email_verification_token : string}
*/
usersRouters.post('/verify-email', users_middlewares_1.emailVerifyTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.verifyEmailController));
/*
Description: Resend email verification token
Path: /resend-verify-email
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { }
*/
usersRouters.post('/resend-verify-email', users_middlewares_1.accessTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.resendVerifyEmailController));
/*
Description: Submit email to reset password , send email to user
Path: /forgot-password
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { }
*/
usersRouters.post('/forgot-password', users_middlewares_1.forgotPasswordValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.forgotPasswordController));
/*
Description: Verify email when user click on the link in the email to reset password
Path: /verify-forgot-password
Method: POST
Body: { forgot_password_token : string }
*/
usersRouters.post('/verify-forgot-password', users_middlewares_1.verifyForgotPasswordTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.verifyForgotPasswordController));
/*
Description: Reset password
Path: /reset-password
Method: POST
Body: { forgot_password_token : string , password : string , confirm_password : string }
*/
usersRouters.post('/reset-password', users_middlewares_1.resetPasswordValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.resetPasswordController));
/*
Description: Get my profile
Path: /me
Headers: { Authorization : Bearer <accessToken> }
Method: GET
*/
usersRouters.get('/me', users_middlewares_1.accessTokenValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.meController));
/*
Description: Update my profile
Path: /me
Headers: { Authorization : Bearer <accessToken> }
Method: PATCH
Body : User Schema
*/
usersRouters.patch('/me', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, users_middlewares_1.updateMeValidation, (0, common_middlewares_1.filterMiddleware)(['name', 'date_of_birth', 'bio', 'location', 'username', 'avatar', 'cover_photo']), (0, handlers_1.wrapRequestHandler)(users_controllers_1.updateMeController));
/*
Description: Get User Profile by id or username
Path: /:id
Method: GET
*/
usersRouters.get('/:user_id', (0, handlers_1.wrapRequestHandler)(users_controllers_1.getProfileController));
/*
Description: Follow Someone
Path: /follow
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { followed_user_id : string }
*/
usersRouters.post('/follow', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, users_middlewares_1.followValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.followController));
/*
Description: Unfollow Someone
Path: /follow
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { followed_user_id : string }
*/
usersRouters.delete('/follow/:user_id', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, users_middlewares_1.unfollowValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.unfollowController));
/*
Description: change password
Path: /change-password
Headers: { Authorization : Bearer <accessToken> }
Method: PUT
Body : { old_password : string , new_password : string , confirm_password : string }
*/
usersRouters.put('/change-password', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, users_middlewares_1.changePasswordValidation, (0, handlers_1.wrapRequestHandler)(users_controllers_1.changePasswordController));
exports.default = usersRouters;
