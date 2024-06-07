"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPassWordEmail = exports.sendVerifyRegisterEmail = exports.verifyEmailTemplate = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const client_ses_1 = require("@aws-sdk/client-ses");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../constants/config");
// Create SES service object.
const sesClient = new client_ses_1.SESClient({
    region: config_1.envConfig.awsRegion,
    credentials: {
        secretAccessKey: config_1.envConfig.awsSecretAccessKey,
        accessKeyId: config_1.envConfig.awsAccessKeyId
    }
});
exports.verifyEmailTemplate = fs_1.default.readFileSync(path_1.default.resolve('src/templates/verify-email.html'), 'utf8');
const createSendEmailCommand = ({ fromAddress, toAddresses, ccAddresses = [], body, subject, replyToAddresses = [] }) => {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
            ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: 'UTF-8',
                    Data: body
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: fromAddress,
        ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
    });
};
const sendEmail = (toAddress, subject, body) => {
    const sendEmailCommand = createSendEmailCommand({
        fromAddress: config_1.envConfig.sesFromAdress,
        toAddresses: toAddress,
        body,
        subject
    });
    return sesClient.send(sendEmailCommand);
};
const sendVerifyRegisterEmail = (toAddress, name, email_verify_token, template = exports.verifyEmailTemplate) => {
    return sendEmail(toAddress, 'Verify your email', template
        .replace('{{customer_name}}', name)
        .replace('{{content_1}}', 'Thank you for subscribing to our service. We are delighted to welcome you.')
        .replace('{{content_2}}', 'Please confirm your email by clicking the button below.')
        .replace('{{button_text}}', 'Verify Email')
        .replace('{{button_link}}', `${config_1.envConfig.clientUrl}/verify-email?token=${email_verify_token}`));
};
exports.sendVerifyRegisterEmail = sendVerifyRegisterEmail;
const sendForgotPassWordEmail = (toAddress, name, forgot_password_token, template = exports.verifyEmailTemplate) => {
    return sendEmail(toAddress, 'Reset your password', template
        .replace('{{customer_name}}', name)
        .replace('{{content_1}}', 'We received a request to reset your password. If you did not make this request, please ignore this email.')
        .replace('{{content_2}}', 'To reset your password, please click the button below:')
        .replace('{{button_text}}', 'Reset Password')
        .replace('{{button_link}}', `${config_1.envConfig.clientUrl}/reset-password?token=${forgot_password_token}`));
};
exports.sendForgotPassWordEmail = sendForgotPassWordEmail;
