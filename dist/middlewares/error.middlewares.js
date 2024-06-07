"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorHandler = void 0;
const lodash_1 = require("lodash");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const errors_1 = require("../models/errors");
// Helper function to handle circular structures
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}
const defaultErrorHandler = (err, req, res, next) => {
    if (err instanceof errors_1.ErrorWithStatus) {
        return res.status(err.status).json((0, lodash_1.omit)(err, 'status'));
    }
    const finalError = {};
    Object.getOwnPropertyNames(err).forEach((key) => {
        if (!Object.getOwnPropertyDescriptor(err, key)?.configurable ||
            !Object.getOwnPropertyDescriptor(err, key)?.writable) {
            return (finalError[key] = err[key]);
        }
    });
    const safeError = JSON.stringify(finalError, getCircularReplacer());
    res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
        message: finalError.message,
        errorInfo: (0, lodash_1.omit)(JSON.parse(safeError), ['stack']) // Parsing back to object to use `omit`
    });
};
exports.defaultErrorHandler = defaultErrorHandler;
