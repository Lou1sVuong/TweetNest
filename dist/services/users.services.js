"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const follower_schemas_1 = __importDefault(require("../models/schemas/follower.schemas"));
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const messages_1 = require("../constants/messages");
const refreshToken_schemas_1 = __importDefault(require("../models/schemas/refreshToken.schemas"));
const user_schemas_1 = __importDefault(require("../models/schemas/user.schemas"));
const database_services_1 = __importDefault(require("../services/database.services"));
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const config_1 = require("../constants/config");
class UsersService {
    signAccessToken({ user_id, verify }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.tokenType.AccessToken,
                verify
            },
            privateKey: config_1.envConfig.jwtSecretAccessToken,
            options: {
                expiresIn: config_1.envConfig.accessTokenExpiresIn
            }
        });
    }
    signRefreshToken({ user_id, verify, exp }) {
        if (exp) {
            return (0, jwt_1.signToken)({
                payload: {
                    user_id,
                    token_type: enums_1.tokenType.RefreshToken,
                    verify,
                    exp
                },
                privateKey: config_1.envConfig.jwtSecretRefreshToken
            });
        }
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.tokenType.RefreshToken,
                verify
            },
            privateKey: config_1.envConfig.jwtSecretRefreshToken,
            options: {
                expiresIn: config_1.envConfig.refreshTokenExpiresIn
            }
        });
    }
    signEmailVerifyToken({ user_id, verify }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.tokenType.EmailVerificationToken,
                verify
            },
            privateKey: config_1.envConfig.jwtSecretEmailVerifyToken,
            options: {
                expiresIn: config_1.envConfig.emailVerifyTokenExpiresIn
            }
        });
    }
    signForgotPasswordToken({ user_id, verify }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.tokenType.EmailVerificationToken,
                verify
            },
            privateKey: config_1.envConfig.jwtSecretForgotPassToken,
            options: {
                expiresIn: config_1.envConfig.forgotPasswordTokenExpiresIn
            }
        });
    }
    signAccessAndRefreshToken({ user_id, verify }) {
        return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })]);
    }
    decodeRefreshToken(refresh_token) {
        return (0, jwt_1.verifyToken)({
            token: refresh_token,
            secretOrPublickey: config_1.envConfig.jwtSecretRefreshToken
        });
    }
    async register(payload) {
        const user_id = new mongodb_1.ObjectId();
        const email_verify_token = await this.signEmailVerifyToken({
            user_id: user_id.toString(),
            verify: enums_1.userVerificationStatus.Unverified
        });
        await database_services_1.default.users.insertOne(new user_schemas_1.default({
            ...payload,
            _id: user_id,
            email_verification_token: email_verify_token,
            date_of_birth: new Date(payload.date_of_birth),
            password: (0, crypto_1.hashPassword)(payload.password)
        }));
        const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
            user_id: user_id.toString(),
            verify: enums_1.userVerificationStatus.Unverified
        });
        const { iat, exp } = await this.decodeRefreshToken(refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new refreshToken_schemas_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token, iat, exp }));
        // 1. server gửi email chứa link verify email đến email của user
        // 2. user click vào link verify email thì server sẽ verify email của user\
        // 3. client send request lên server với email_verify_token
        // 4. server verify email của user
        // 5. client nhận được access_token và refresh_token
        await (0, email_1.sendVerifyRegisterEmail)(payload.email, payload.name, email_verify_token);
        // console.log('email_verification_token : ', email_verify_token)
        return { access_token, refresh_token };
    }
    async refreshToken({ user_id, verify, refresh_token, exp }) {
        const [new_access_token, new_refresh_token] = await Promise.all([
            this.signAccessToken({ user_id, verify }),
            this.signRefreshToken({ user_id, verify, exp }),
            database_services_1.default.refreshTokens.deleteOne({ token: this.refreshToken })
        ]);
        const decode_refresh_token = await this.decodeRefreshToken(new_refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new refreshToken_schemas_1.default({
            user_id: new mongodb_1.ObjectId(user_id),
            token: new_refresh_token,
            iat: decode_refresh_token.iat,
            exp: decode_refresh_token.exp
        }));
        return { access_token: new_access_token, refresh_token: new_refresh_token };
    }
    async checkEmailExist(email) {
        const result = await database_services_1.default.users.findOne({ email });
        return Boolean(result);
    }
    async login({ user_id, verify }) {
        const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
            user_id,
            verify
        });
        const { iat, exp } = await this.decodeRefreshToken(refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new refreshToken_schemas_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token, iat, exp }));
        return { access_token, refresh_token };
    }
    async logout(refresh_token) {
        await database_services_1.default.refreshTokens.deleteOne({ token: refresh_token });
        return {
            message: messages_1.USERS_MESSAGES.LOGOUT_SUCCESSFULLY
        };
    }
    async verifyEmail(user_id) {
        const [token] = await Promise.all([
            this.signAccessAndRefreshToken({ user_id, verify: enums_1.userVerificationStatus.Verified }),
            database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    email_verification_token: '',
                    verify: enums_1.userVerificationStatus.Verified
                },
                $currentDate: { updated_at: true }
            })
        ]);
        const [access_token, refresh_token] = token;
        const { iat, exp } = await this.decodeRefreshToken(refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new refreshToken_schemas_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token, iat, exp }));
        return {
            access_token,
            refresh_token
        };
    }
    async resendVerifyEmail(user_id, email, name) {
        const email_verify_token = await this.signEmailVerifyToken({
            user_id,
            verify: enums_1.userVerificationStatus.Verified
        });
        await (0, email_1.sendVerifyRegisterEmail)(email, name, email_verify_token);
        // console.log('Resend email verify token : ', email_verify_token)
        await database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            $set: {
                email_verification_token: email_verify_token
            },
            $currentDate: { updated_at: true }
        });
        return {
            message: messages_1.USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY
        };
    }
    async forgotPassword({ user_id, verify, email, name }) {
        const forgot_password_token = await this.signForgotPasswordToken({
            user_id,
            verify
        });
        await database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            $set: {
                forgot_password_token
            },
            $currentDate: { updated_at: true }
        });
        // gửi email chứa link reset password đến email của user : http://localhost:3000/reset-password?token=forgot_password_token
        (0, email_1.sendForgotPassWordEmail)(email, name, forgot_password_token);
        // console.log('Forgot password token : ', forgot_password_token)
        return {
            message: messages_1.USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
        };
    }
    async resetPassword(user_id, password) {
        database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            $set: {
                password: (0, crypto_1.hashPassword)(password),
                forgot_password_token: ''
            },
            $currentDate: { updated_at: true }
        });
        return {
            message: messages_1.USERS_MESSAGES.RESET_PASSWORD_SUCCESSFULLY
        };
    }
    async getMe(user_id) {
        const user = database_services_1.default.users
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followed_user_id',
                    as: 'followers'
                }
            },
            {
                $addFields: {
                    following: {
                        $size: '$following'
                    },
                    followers: {
                        $size: '$followers'
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    email_verification_token: 0,
                    forgot_password_token: 0
                }
            }
        ])
            .toArray();
        return user;
    }
    async updateMe(user_id, payload) {
        const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload;
        const user = await database_services_1.default.users.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(user_id)
        }, {
            $set: {
                ..._payload
            },
            $currentDate: { updated_at: true }
        });
        return user;
    }
    async getProfile(user_id) {
        let param = {};
        if (user_id.length === 24) {
            param = { _id: new mongodb_1.ObjectId(user_id) };
        }
        else {
            param = { username: user_id };
        }
        const user = await database_services_1.default.users
            .aggregate([
            {
                $match: {
                    ...param
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followed_user_id',
                    as: 'followers'
                }
            },
            {
                $addFields: {
                    following: {
                        $size: '$following'
                    },
                    followers: {
                        $size: '$followers'
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    email_verification_token: 0,
                    forgot_password_token: 0,
                    verify: 0,
                    updated_at: 0
                }
            }
        ])
            .toArray();
        if (!user) {
            throw new Error(messages_1.USERS_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }
    async follow(user_id, followed_user_id) {
        const follower = await database_services_1.default.followers.findOne({
            user_id: new mongodb_1.ObjectId(user_id),
            followed_user_id: new mongodb_1.ObjectId(followed_user_id)
        });
        if (follower === null) {
            await database_services_1.default.followers.insertOne(new follower_schemas_1.default({
                user_id: new mongodb_1.ObjectId(user_id),
                followed_user_id: new mongodb_1.ObjectId(followed_user_id)
            }));
            return {
                message: messages_1.USERS_MESSAGES.FOLLOW_SUCCESSFULLY
            };
        }
        return {
            message: messages_1.USERS_MESSAGES.FOLLOWED
        };
    }
    async unfollow(user_id, followed_user_id) {
        const follower = await database_services_1.default.followers.findOne({
            user_id: new mongodb_1.ObjectId(user_id),
            followed_user_id: new mongodb_1.ObjectId(followed_user_id)
        });
        if (follower === null) {
            return {
                message: messages_1.USERS_MESSAGES.ALREADY_UNFOLLOWED
            };
        }
        await database_services_1.default.followers.deleteOne({
            user_id: new mongodb_1.ObjectId(user_id),
            followed_user_id: new mongodb_1.ObjectId(followed_user_id)
        });
        return {
            message: messages_1.USERS_MESSAGES.UNFOLLOW_SUCCESSFULLY
        };
    }
    async changePassword(user_id, new_password) {
        await database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            $set: {
                password: (0, crypto_1.hashPassword)(new_password)
            },
            $currentDate: { updated_at: true }
        });
        return {
            message: messages_1.USERS_MESSAGES.CHANGE_PASSWORD_SUCCESSFULLY
        };
    }
}
const usersService = new UsersService();
exports.default = usersService;
