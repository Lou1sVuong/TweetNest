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
  CONFIRM_PASSWORD_MUST_BE_MATCH: 'Confirm password must match with password'
} as const
