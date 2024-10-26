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
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  //logout
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  //Email verification
  EMAIL_VERIFICATION_TOKEN_REQUIRED: 'Email verification token is required',
  EMAIL_VERIFICATION_TOKEN_MUST_BE_STRING: 'Email verification token must be a string',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  USER_NOT_FOUND: 'User not found',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',
  // bio
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio must be between 1 and 200 characters long',
  // location
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location must be between 1 and 200 characters long',
  // website
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website must be between 1 and 200 characters long',
  // username
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_INVALID:
    'Username must be between 4 and 15 characters long, contain only letters, numbers and underscores and not all numbers',
  USERNAME_EXIST: 'Username is already exist',
  // IMAGE
  IMAGE_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_LENGTH: 'Avatar must be between 1 and 500 characters long',
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
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  // getMe
  GET_ME_SUCCESSFULLY: 'Get me successfully',
  // verifyUser
  USER_NOT_VERIFIED: 'User not verified',
  //   updateMe
  UPDATE_ME_SUCCESSFULLY: 'Update profile successfully',
  //   getProfile
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  //   follow
  FOLLOW_SUCCESSFULLY: 'Follow successfully',
  INVALID_USER_ID: 'Invalid user id',
  FOLLOWED: 'Followed',
  //  unfollow
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESSFULLY: 'Unfollow successfully',
  // changePassword
  OLD_PASSWORD_INCORRECT: 'Old password is incorrect',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully',
  //   Medias
  UPLOAD_IMAGE_SUCCESSFULLY: 'Upload image successfully',
  IMAGE_NOT_FOUND: 'Image not found',
  UPLOAD_VIDEO_SUCCESSFULLY: 'Upload video successfully',
  VIDEO_NOT_FOUND: 'Video not found',
  GET_VIDEO_STATUS_SUCCESSFULLY: 'Get video status successfully'
} as const

export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_VALID_TWEET_ID: 'Parent id must be valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_A_EMPTY_STRING: 'Content must be a empty string',
  HASHTAGS_MUST_BE_AN_ARRAY: 'Hashtags must be an array',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY: 'Mentions must be an array',
  MENTIONS_MUST_BE_AN_ARRAY_USER_ID: 'Mentions must be an array of user id',
  MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Media must be an array of media object',
  CREATE_TWEET_SUCCESSFULLY: 'Create tweet successfully',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found',
  GET_TWEET_SUCCESSFULLY: 'Get tweet successfully',
  GET_TWEET_CHILDREN_SUCCESSFULLY: 'Get tweet children successfully',
  TWEET_IS_NOT_PUBLIC: 'Tweet is not public',
  GET_NEW_FEEDS_SUCCESSFULLY: 'Get new feeds successfully'
} as const

export const BOOKMARKS_MESSGAGES = {
  BOOKMARK_TWEET_SUCCESSFULLY: 'Bookmark tweet successfully',
  UNBOOKMARK_TWEET_SUCCESSFULLY: 'Unbookmark tweet successfully'
} as const

export const LIKE_MESSGAGES = {
  LIKE_TWEET_SUCCESSFULLY: 'Like tweet successfully',
  UNLIKE_TWEET_SUCCESSFULLY: 'Unlike tweet successfully'
}

export const TWEET_CHIRLDREN_MESSAGES = {
  LIMIT_MUST_BE_BETWEEN_1_AND_100: 'Limit must be between 1 and 100',
  LIMIT_MUST_BE_GREATER_THAN_0: 'Limit must be greater than 0'
} as const

export const SEARCH_MESSAGES = {
  SEARCH_SUCCESSFULLY: 'Search successfully',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  MEDIA_TYPE_INVALID: 'Media type is invalid',
  PEOPLE_FOLLOW_INVALID: 'People follow is invalid, must be 0 or 1'
} as const
