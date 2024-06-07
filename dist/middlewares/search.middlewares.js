"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchValidation = void 0;
const express_validator_1 = require("express-validator");
const enums_1 = require("../constants/enums");
const messages_1 = require("../constants/messages");
const validation_utils_1 = require("../utils/validation.utils");
exports.searchValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    content: {
        isString: {
            errorMessage: messages_1.SEARCH_MESSAGES.CONTENT_MUST_BE_A_STRING
        }
    },
    media_type: {
        optional: true,
        isIn: {
            options: [Object.values(enums_1.MediaTypeQuery)],
            errorMessage: messages_1.SEARCH_MESSAGES.MEDIA_TYPE_INVALID
        }
    },
    people_follow: {
        optional: true,
        isIn: {
            options: [Object.values(enums_1.PeopleFollow)],
            errorMessage: messages_1.SEARCH_MESSAGES.PEOPLE_FOLLOW_INVALID
        }
    }
}, ['query']));
