"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const errors_1 = require("../models/errors");
// can be reused by many routes
// sequential processing, stops running validations chain if the previous one fails.
const validate = (validation) => {
    return async (req, res, next) => {
        await validation.run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        // if there are no errors, continue to the next middleware
        if (errors.isEmpty()) {
            return next();
        }
        // if there are errors, return an error response
        const errorObjects = errors.mapped();
        const entityError = new errors_1.EntityError({ errors: {} });
        for (const key in errorObjects) {
            const { msg } = errorObjects[key];
            if (msg instanceof errors_1.ErrorWithStatus && msg.status !== httpStatus_1.default.UNPROCESSABLE_ENTITY) {
                return next(msg);
            }
            entityError.errors[key] = errorObjects[key];
        }
        next(entityError);
    };
};
exports.validate = validate;
