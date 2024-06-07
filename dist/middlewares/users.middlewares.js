"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserLoggedInValidation = exports.changePasswordValidation = exports.unfollowValidation = exports.followValidation = exports.updateMeValidation = exports.verifiedUserValidation = exports.resetPasswordValidation = exports.verifyForgotPasswordTokenValidation = exports.forgotPasswordValidation = exports.emailVerifyTokenValidation = exports.refreshTokenValidation = exports.accessTokenValidation = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const errors_1 = require("../models/errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const users_services_1 = __importDefault(require("../services/users.services"));
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const validation_utils_1 = require("../utils/validation.utils");
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const regex_1 = require("../constants/regex");
const config_1 = require("../constants/config");
const passwordShema = {
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRING
    },
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_REQUIRED
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_LENGTH
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
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
    }
};
const confirmPasswordSchema = {
    isString: true,
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
    },
    trim: true,
    custom: {
        options: (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_MATCH);
            }
            return value;
        }
    }
};
const forgotPasswordToken = {
    trim: true,
    custom: {
        options: async (value, { req }) => {
            if (!value) {
                throw new errors_1.ErrorWithStatus({
                    message: messages_1.USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_REQUIRED,
                    status: httpStatus_1.default.UNAUTHORIZED
                });
            }
            try {
                const decoded_forgot_password_token = await (0, jwt_1.verifyToken)({
                    token: value,
                    secretOrPublickey: config_1.envConfig.jwtSecretForgotPassToken
                });
                const { user_id } = decoded_forgot_password_token;
                const user = await database_services_1.default.users.findOne({
                    _id: new mongodb_1.ObjectId(user_id)
                });
                if (user === null) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                if (user.forgot_password_token !== value) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                req.decoded_forgot_password_token = decoded_forgot_password_token;
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    throw new errors_1.ErrorWithStatus({
                        message: error.message,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                throw error;
            }
            return true;
        }
    }
};
const nameSchema = {
    optional: true,
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.NAME_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.NAME_MUST_BE_STRING
    },
    isLength: {
        options: {
            min: 1,
            max: 100
        },
        errorMessage: messages_1.USERS_MESSAGES.NAME_LENGTH
    },
    trim: true
};
const dateOfBirthSchema = {
    isISO8601: {
        options: {
            strict: true,
            strictSeparator: true
        }
    }
};
const imageShaema = {
    optional: true,
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.IMAGE_MUST_BE_STRING
    },
    isLength: {
        options: {
            min: 1,
            max: 500
        },
        errorMessage: messages_1.USERS_MESSAGES.IMAGE_LENGTH
    },
    trim: true
};
const userIdSchema = {
    custom: {
        options: async (value, { req }) => {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new errors_1.ErrorWithStatus({
                    message: messages_1.USERS_MESSAGES.INVALID_USER_ID,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            const followed_user = await database_services_1.default.users.findOne({
                _id: new mongodb_1.ObjectId(value)
            });
            if (followed_user === null) {
                throw new errors_1.ErrorWithStatus({
                    message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
        }
    }
};
exports.loginValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    email: {
        trim: true,
        isEmail: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_INVALID
        },
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({
                    email: value,
                    password: (0, crypto_1.hashPassword)(req.body.password)
                });
                if (user === null) {
                    throw new Error(messages_1.USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT);
                }
                req.user = user;
                return true;
            }
        }
    },
    password: {
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRING
        },
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_REQUIRED
        },
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_LENGTH
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
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
    }
}, ['body']));
exports.registerValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    name: nameSchema,
    email: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_REQUIRED
        },
        trim: true,
        isEmail: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_INVALID
        },
        custom: {
            options: async (value) => {
                const isEmailExist = await users_services_1.default.checkEmailExist(value);
                if (isEmailExist) {
                    throw new Error(messages_1.USERS_MESSAGES.EMAIL_ALREADY_EXIST);
                }
                return !isEmailExist;
            }
        }
    },
    password: passwordShema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: dateOfBirthSchema
}, ['body']));
exports.accessTokenValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    authorization: {
        custom: {
            options: async (value, { req }) => {
                const access_token = (value || '').split(' ')[1];
                if (!access_token) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                if (!access_token) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const decoded_authorization = await (0, jwt_1.verifyToken)({
                        token: access_token,
                        secretOrPublickey: config_1.envConfig.jwtSecretAccessToken
                    });
                    req.decoded_authorization = decoded_authorization;
                }
                catch (error) {
                    throw new errors_1.ErrorWithStatus({
                        message: error.message,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            }
        }
    }
}, ['headers']));
exports.refreshTokenValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    refresh_token: {
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const [decoded_refresh_token, refresh_token] = await Promise.all([
                        (0, jwt_1.verifyToken)({ token: value, secretOrPublickey: config_1.envConfig.jwtSecretRefreshToken }),
                        database_services_1.default.refreshTokens.findOne({ token: value })
                    ]);
                    if (refresh_token === null) {
                        throw new errors_1.ErrorWithStatus({
                            message: messages_1.USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    ;
                    req.decoded_refresh_token = decoded_refresh_token;
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new errors_1.ErrorWithStatus({
                            message: error.message,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    throw error;
                }
                return true;
            }
        }
    }
}, ['body']));
exports.emailVerifyTokenValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    email_verify_token: {
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_VERIFICATION_TOKEN_MUST_BE_STRING
        },
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.EMAIL_VERIFICATION_TOKEN_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const decoded_email_verify_token = await (0, jwt_1.verifyToken)({
                        token: value,
                        secretOrPublickey: config_1.envConfig.jwtSecretEmailVerifyToken
                    });
                    req.decoded_email_verify_token = decoded_email_verify_token;
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new errors_1.ErrorWithStatus({
                            message: error.message,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                }
                return true;
            }
        }
    }
}, ['body']));
exports.forgotPasswordValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    email: {
        isEmail: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({ email: value });
                if (user === null) {
                    throw new Error(messages_1.USERS_MESSAGES.USER_NOT_FOUND);
                }
                req.user = user;
                return true;
            }
        }
    }
}, ['body']));
exports.verifyForgotPasswordTokenValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    forgot_password_token: forgotPasswordToken
}, ['body']));
exports.resetPasswordValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    password: passwordShema,
    confirm_password: confirmPasswordSchema,
    forgot_password_token: forgotPasswordToken
}));
const verifiedUserValidation = (req, res, next) => {
    const { verify } = req.decoded_authorization;
    if (verify !== enums_1.userVerificationStatus.Verified) {
        return next(new errors_1.ErrorWithStatus({
            message: messages_1.USERS_MESSAGES.USER_NOT_VERIFIED,
            status: httpStatus_1.default.FORBIDDEN
        }));
    }
    next();
};
exports.verifiedUserValidation = verifiedUserValidation;
exports.updateMeValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        ...nameSchema,
        optional: true,
        isEmpty: undefined
    },
    date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
    },
    bio: {
        optional: true,
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.BIO_MUST_BE_STRING
        },
        isLength: {
            options: {
                min: 1,
                max: 200
            },
            errorMessage: messages_1.USERS_MESSAGES.BIO_LENGTH
        },
        trim: true
    },
    location: {
        optional: true,
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.LOCATION_MUST_BE_STRING
        },
        isLength: {
            options: {
                min: 1,
                max: 200
            },
            errorMessage: messages_1.USERS_MESSAGES.LOCATION_LENGTH
        },
        trim: true
    },
    website: {
        optional: true,
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.WEBSITE_MUST_BE_STRING
        },
        isLength: {
            options: {
                min: 1,
                max: 200
            },
            errorMessage: messages_1.USERS_MESSAGES.WEBSITE_LENGTH
        },
        trim: true
    },
    username: {
        optional: true,
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.USERNAME_MUST_BE_STRING
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!regex_1.REGEX_USERNAME.test(value)) {
                    throw new Error(messages_1.USERS_MESSAGES.USERNAME_INVALID);
                }
                const user = await database_services_1.default.users.findOne({ username: value });
                // nếu đã tổn tại username này trong db thì trả về lỗi username đã tồn tại
                if (user) {
                    throw new Error(messages_1.USERS_MESSAGES.USERNAME_EXIST);
                }
            }
        }
    },
    avatar: imageShaema,
    cover_photo: imageShaema
}, ['body']));
exports.followValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    followed_user_id: userIdSchema
}, ['body']));
exports.unfollowValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    user_id: userIdSchema
}, ['params']));
exports.changePasswordValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    old_password: {
        ...passwordShema,
        custom: {
            options: async (value, { req }) => {
                const { user_id } = req.decoded_authorization;
                const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
                if (!user) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                const { password } = user;
                const isPasswordMatch = (0, crypto_1.hashPassword)(value) === password;
                if (!isPasswordMatch) {
                    throw new Error(messages_1.USERS_MESSAGES.OLD_PASSWORD_INCORRECT);
                }
            }
        }
    },
    password: passwordShema,
    confirm_password: confirmPasswordSchema
}, ['body']));
const isUserLoggedInValidation = (middleware) => {
    return (req, res, next) => {
        if (req.headers.authorization) {
            return middleware(req, res, next);
        }
        next();
    };
};
exports.isUserLoggedInValidation = isUserLoggedInValidation;
