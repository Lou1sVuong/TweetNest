"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = ({ payload, privateKey, options = {
    algorithm: 'HS256'
} }) => {
    return new Promise((resolve, rejects) => {
        jsonwebtoken_1.default.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                throw rejects(err);
            }
            resolve(token);
        });
    });
};
exports.signToken = signToken;
const verifyToken = ({ token, secretOrPublickey }) => {
    return new Promise((resolve, rejects) => {
        jsonwebtoken_1.default.verify(token, secretOrPublickey, (err, decoded) => {
            if (err) {
                throw rejects(err);
            }
            resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
