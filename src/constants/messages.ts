export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH: 'Name must be between 1 and 100 characters long',
  EMAIL_ALREADY_EXIST: 'Email is already exist',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_MUST_BE_STRONG:
    ' Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number and one symbol',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_MATCH: 'Confirm password must match with password',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  REGISTER_SUCCESSFULLY: 'Register successfully',
  //accessToken
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  //refreshToken
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_MUST_BE_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  //logout
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  //Email verification
  EMAIL_VERIFICATION_TOKEN_REQUIRED: 'Email verification token is required',
  EMAIL_VERIFICATION_TOKEN_MUST_BE_STRING: 'Email verification token must be a string',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  USER_NOT_FOUND: 'User not found',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',
  //   resendVerifyEmailController
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  // forgotPassword
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset password',
  // verifyForgotPassword
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password successfully',
  // resetPassword
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully'
} as const
