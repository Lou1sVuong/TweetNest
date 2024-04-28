import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseServices from '~/services/database.services'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation.utils'

export const loginValidation = validate(
  checkSchema({
    email: {
      trim: true,
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseServices.users.findOne({ email: value })
          if (user === null) {
            throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
      },
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    }
  })
)

export const registerValidation = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      errorMessage: USERS_MESSAGES.NAME_LENGTH,
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_REQUIRED
      },
      trim: true,
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_INVALID
      },
      custom: {
        options: async (value) => {
          const isEmailExist = await usersService.checkEmailExist(value)
          if (isEmailExist) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXIST)
          }
          return !isEmailExist
        }
      }
    },
    password: {
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING
      },
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      isString: true,
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
      },
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_MATCH)
          }
          return value
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
