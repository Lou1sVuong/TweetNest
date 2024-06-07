"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.sha256 = void 0;
const node_crypto_1 = require("node:crypto");
const config_1 = require("../constants/config");
function sha256(content) {
    return (0, node_crypto_1.createHash)('sha3-256').update(content).digest('hex');
}
exports.sha256 = sha256;
function hashPassword(password) {
    return sha256(password + config_1.envConfig.hashSalt);
}
exports.hashPassword = hashPassword;
