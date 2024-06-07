"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.unfollowController = exports.followController = exports.getProfileController = exports.updateMeController = exports.meController = exports.resetPasswordController = exports.verifyForgotPasswordController = exports.forgotPasswordController = exports.resendVerifyEmailController = exports.verifyEmailController = exports.refreshTokenController = exports.logoutController = exports.registerController = exports.loginController = void 0;
const users_services_1 = __importDefault(require("../services/users.services"));
const mongodb_1 = require("mongodb");
const messages_1 = require("../constants/messages");
const database_services_1 = __importDefault(require("../services/database.services"));
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const enums_1 = require("../constants/enums");
const loginController = async (req, res) => {
    const user = req.user;
    const user_id = user._id;
    const result = await users_services_1.default.login({
        user_id: user_id.toString(),
        verify: user.verify
    });
    return res.json({
        message: messages_1.USERS_MESSAGES.LOGIN_SUCCESSFULLY,
        result
    });
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    const result = await users_services_1.default.register(req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.REGISTER_SUCCESSFULLY,
        result
    });
};
exports.registerController = registerController;
const logoutController = async (req, res) => {
    const { refresh_token } = req.body;
    const result = await users_services_1.default.logout(refresh_token);
    return res.json(result);
};
exports.logoutController = logoutController;
const refreshTokenController = async (req, res) => {
    const { refresh_token } = req.body;
    const { user_id, verify, exp } = req.decoded_refresh_token;
    const result = await users_services_1.default.refreshToken({ user_id, verify, refresh_token, exp });
    return res.json({
        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
        result
    });
};
exports.refreshTokenController = refreshTokenController;
const verifyEmailController = async (req, res) => {
    const { user_id } = req.decoded_email_verify_token;
    const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
    // nếu không tìm thấy user thì trả về status NOT FOUND với message là user không tồn tại
    if (!user) {
        return res.status(httpStatus_1.default.NOT_FOUND).json({ message: messages_1.USERS_MESSAGES.USER_NOT_FOUND });
    }
    // đã verify rồi thì không báo lỗi
    //   mà sẽ trả về status OK với message là email đã được verify trước đó rồi
    if (user.email_verification_token === '') {
        return res.json({ message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_VERIFIED });
    }
    const result = await users_services_1.default.verifyEmail(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
        result
    });
};
exports.verifyEmailController = verifyEmailController;
const resendVerifyEmailController = async (req, res) => {
    const { user_id } = req.decoded_authorization;
    const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
    if (!user) {
        return res.status(httpStatus_1.default.NOT_FOUND).json({ message: messages_1.USERS_MESSAGES.USER_NOT_FOUND });
    }
    if (user.verify === enums_1.userVerificationStatus.Verified) {
        return res.json({ message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE });
    }
    const result = await users_services_1.default.resendVerifyEmail(user_id, user.email, user.name);
    return res.json(result);
};
exports.resendVerifyEmailController = resendVerifyEmailController;
const forgotPasswordController = async (req, res) => {
    const { _id, verify, email, name } = req.user;
    const result = await users_services_1.default.forgotPassword({
        user_id: _id.toString(),
        verify,
        email,
        name
    });
    return res.json(result);
};
exports.forgotPasswordController = forgotPasswordController;
const verifyForgotPasswordController = async (req, res, next) => {
    return res.json({
        message: messages_1.USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESSFULLY
    });
};
exports.verifyForgotPasswordController = verifyForgotPasswordController;
const resetPasswordController = async (req, res, next) => {
    const { user_id } = req.decoded_forgot_password_token;
    const { password } = req.body;
    const result = await users_services_1.default.resetPassword(user_id, password);
    return res.json(result);
};
exports.resetPasswordController = resetPasswordController;
const meController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const user = await users_services_1.default.getMe(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ME_SUCCESSFULLY,
        result: user
    });
};
exports.meController = meController;
const updateMeController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const { body } = req;
    const user = users_services_1.default.updateMe(user_id, body);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPDATE_ME_SUCCESSFULLY,
        result: user
    });
};
exports.updateMeController = updateMeController;
const getProfileController = async (req, res) => {
    const { user_id } = req.params;
    const user = await users_services_1.default.getProfile(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_PROFILE_SUCCESSFULLY,
        result: user
    });
};
exports.getProfileController = getProfileController;
const followController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const { followed_user_id } = req.body;
    const result = await users_services_1.default.follow(user_id, followed_user_id);
    return res.json(result);
};
exports.followController = followController;
const unfollowController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const { user_id: followed_user_id } = req.params;
    const result = await users_services_1.default.unfollow(user_id, followed_user_id);
    return res.json(result);
};
exports.unfollowController = unfollowController;
const changePasswordController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const { password } = req.body;
    const result = await users_services_1.default.changePassword(user_id, password);
    return res.json(result);
};
exports.changePasswordController = changePasswordController;
