"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = exports.isProduction = void 0;
const dotenv_1 = require("dotenv");
const minimist_1 = __importDefault(require("minimist"));
const options = (0, minimist_1.default)(process.argv.slice(2));
console.log(options);
exports.isProduction = options.env === 'production';
(0, dotenv_1.config)({
    path: options.env ? `.env.${options.env}` : '.env'
});
exports.envConfig = {
    host: process.env.HOST,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    port: process.env.PORT || 4000,
    clientUrl: process.env.CLIENT_URL,
    awsRegion: process.env.AWS_REGION,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    sesFromAdress: process.env.SES_FROM_ADDRESS,
    bucketName: process.env.BUCKET_NAME,
    dbUsersCollection: process.env.DB_USERS_COLLECTION,
    dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION,
    dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION,
    dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION,
    dbTweetsCollection: process.env.DB_TWEETS_COLLECTION,
    dbHashtagsCollection: process.env.DB_HASHTAGS_COLLECTION,
    dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION,
    dbLikesCollection: process.env.DB_LIKES_COLLECTION,
    jwtSecretForgotPassToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
    jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
    jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
    jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
    accessTokenExpiresIn: process.env.ACCESS_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.REFRESH_EXPIRES_IN,
    emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
    forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
    hashSalt: process.env.HASH_SALT
};
