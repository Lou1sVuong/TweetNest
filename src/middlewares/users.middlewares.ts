import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.utils'

export const loginValidation = validate(
  checkSchema({
    email: {
      notEmpty: true,
      trim: true,
      isEmail: true
    },
    password: {
      isString: true,
      notEmpty: true,
      trim: true
    }
  })
)

export const registerValidation = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      trim: true,
      isEmail: true
    },
    password: {
      isString: true,
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: 'Password must be at least 6 characters long'
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
        errorMessage:
          'Password must be at least 6 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
      }
    },
    confirm_password: {
      isString: true,
      notEmpty: true,
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirm do not match password')
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
