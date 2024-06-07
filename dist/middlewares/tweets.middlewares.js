"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panigationValidation = exports.getTweetChildrenValidation = exports.audienceValidation = exports.tweetIdValidation = exports.createTweetValidation = void 0;
const express_validator_1 = require("express-validator");
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const errors_1 = require("../models/errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const commons_1 = require("../utils/commons");
const handlers_1 = require("../utils/handlers");
const validation_utils_1 = require("../utils/validation.utils");
const tweetTypes = (0, commons_1.numberEnumToArray)(enums_1.TweetType);
const audienceTypes = (0, commons_1.numberEnumToArray)(enums_1.TweetAudience);
const mediaTypes = (0, commons_1.numberEnumToArray)(enums_1.Mediatype);
exports.createTweetValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    type: {
        isIn: {
            options: [tweetTypes],
            errorMessage: messages_1.TWEETS_MESSAGES.INVALID_TYPE
        }
    },
    audience: {
        isIn: {
            options: [audienceTypes],
            errorMessage: messages_1.TWEETS_MESSAGES.INVALID_AUDIENCE
        }
    },
    parent_id: {
        custom: {
            options: (value, { req }) => {
                const type = req.body.type;
                // nếu type là retweet, comment hoặc quotetweet thì parent_id là `tweet_id` của tweet cha
                if ([enums_1.TweetType.Retweet, enums_1.TweetType.Comment, enums_1.TweetType.Quote].includes(type) && !mongodb_1.ObjectId.isValid(value)) {
                    throw new Error(messages_1.TWEETS_MESSAGES.PARENT_ID_MUST_BE_VALID_TWEET_ID);
                }
                // nếu type là tweet thì parent_id là null
                if (type === enums_1.TweetType.Tweet && value !== null) {
                    throw new Error(messages_1.TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL);
                }
                return true;
            }
        }
    },
    content: {
        isString: {
            errorMessage: messages_1.TWEETS_MESSAGES.CONTENT_MUST_BE_STRING
        },
        custom: {
            options: (value, { req }) => {
                const type = req.body.type;
                const hashtags = req.body.hashtags;
                const mentions = req.body.mentions;
                // nếu `type` là comment , quote hoặc tweet và không chứa hashtag hoặc mention thì content phải là string không được rỗng
                if ([enums_1.TweetType.Comment, enums_1.TweetType.Quote, enums_1.TweetType.Tweet].includes(type) &&
                    (0, lodash_1.isEmpty)(hashtags) &&
                    (0, lodash_1.isEmpty)(mentions) &&
                    value === '') {
                    throw new Error(messages_1.TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING);
                }
                // nếu type là Retweet thì content phải là string rỗng
                if (type === enums_1.TweetType.Retweet && value !== '') {
                    throw new Error(messages_1.TWEETS_MESSAGES.CONTENT_MUST_BE_A_EMPTY_STRING);
                }
                return true;
            }
        }
    },
    hashtags: {
        isArray: {
            errorMessage: messages_1.TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY
        },
        custom: {
            options: (value, { req }) => {
                //yêu cầu mỗi phần tử trong mảng hashtags phải là string
                if (value.some((item) => typeof item !== 'string')) {
                    throw new Error(messages_1.TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING);
                }
                return true;
            }
        }
    },
    mentions: {
        isArray: {
            errorMessage: messages_1.TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY
        },
        custom: {
            options: (value, { req }) => {
                //yêu cầu mỗi phần tử trong mảng mentions phải là user_id
                if (value.some((item) => !mongodb_1.ObjectId.isValid(item))) {
                    throw new Error(messages_1.TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_USER_ID);
                }
                return true;
            }
        }
    },
    medias: {
        isArray: {
            errorMessage: messages_1.TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY
        },
        custom: {
            options: (value, { req }) => {
                //yêu cầu mỗi phần tử trong mảng là Media Object
                if (value.some((item) => {
                    return typeof item.url !== 'string' || [mediaTypes].includes(item.type);
                })) {
                    throw new Error(messages_1.TWEETS_MESSAGES.MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT);
                }
                return true;
            }
        }
    }
}, ['body']));
exports.tweetIdValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    tweet_id: {
        custom: {
            options: async (value, { req }) => {
                if (!mongodb_1.ObjectId.isValid(value)) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.TWEETS_MESSAGES.INVALID_TWEET_ID,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                const [tweet] = await database_services_1.default.tweets
                    .aggregate([
                    {
                        $match: {
                            _id: new mongodb_1.ObjectId(value)
                        }
                    },
                    {
                        $lookup: {
                            from: 'hashtags',
                            localField: 'hashtags',
                            foreignField: '_id',
                            as: 'hashtags'
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'mentions',
                            foreignField: '_id',
                            as: 'mentions'
                        }
                    },
                    {
                        $addFields: {
                            mentions: {
                                $map: {
                                    input: '$mentions',
                                    as: 'mention',
                                    in: {
                                        _id: '$$mention._id',
                                        name: '$$mention.name',
                                        username: '$$mention.username',
                                        email: '$$mention.email'
                                    }
                                }
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'bookmarks',
                            localField: '_id',
                            foreignField: 'tweet_id',
                            as: 'bookmarks'
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            localField: '_id',
                            foreignField: 'tweet_id',
                            as: 'likes'
                        }
                    },
                    {
                        $lookup: {
                            from: 'tweets',
                            localField: '_id',
                            foreignField: 'parent_id',
                            as: 'tweet_children'
                        }
                    },
                    {
                        $addFields: {
                            bookmarks: {
                                $size: '$bookmarks'
                            },
                            likes: {
                                $size: '$likes'
                            },
                            retweet_count: {
                                $size: {
                                    $filter: {
                                        input: '$tweet_children',
                                        as: 'item',
                                        cond: {
                                            $eq: ['$$item.type', enums_1.TweetType.Retweet]
                                        }
                                    }
                                }
                            },
                            comment_count: {
                                $size: {
                                    $filter: {
                                        input: '$tweet_children',
                                        as: 'item',
                                        cond: {
                                            $eq: ['$$item.type', enums_1.TweetType.Comment]
                                        }
                                    }
                                }
                            },
                            quote_count: {
                                $size: {
                                    $filter: {
                                        input: '$tweet_children',
                                        as: 'item',
                                        cond: {
                                            $eq: ['$$item.type', enums_1.TweetType.Quote]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            tweet_children: 0
                        }
                    }
                ])
                    .toArray();
                if (!tweet) {
                    throw new errors_1.ErrorWithStatus({
                        message: messages_1.TWEETS_MESSAGES.TWEET_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                ;
                req.tweet = tweet;
                return true;
            }
        }
    }
}, ['params', 'body']));
// muốn sử dụng async await trong handler thì phải có try catch , nếu k thì phải dùng wrapRequestHandler
exports.audienceValidation = (0, handlers_1.wrapRequestHandler)(async (req, res, next) => {
    const tweet = req.tweet;
    if (tweet.audience === enums_1.TweetAudience.TwitterCircle) {
        // kiểm tra xem tweet này đã đăng nhập hay chưa
        if (!req.decoded_authorization) {
            throw new errors_1.ErrorWithStatus({
                message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                status: httpStatus_1.default.UNAUTHORIZED
            });
        }
        // Kiểm tra tài khoản tác giả có ổn ( bị khoá hay bị xoá chưa)
        const author = await database_services_1.default.users.findOne({
            _id: new mongodb_1.ObjectId(tweet.user_id)
        });
        if (!author || author.verify === enums_1.userVerificationStatus.Blocked) {
            throw new errors_1.ErrorWithStatus({
                message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                status: httpStatus_1.default.NOT_FOUND
            });
        }
        // kiểm tra người xem tweet có trong twitter circle của tác giả không
        const { user_id } = req.decoded_authorization;
        const isInTwitterCircle = author.twitter_circle.some((user_circle_id) => user_circle_id.equals(user_id));
        if (!isInTwitterCircle && !author._id.equals(user_id)) {
            throw new errors_1.ErrorWithStatus({
                message: messages_1.TWEETS_MESSAGES.TWEET_IS_NOT_PUBLIC,
                status: httpStatus_1.default.FORBIDDEN
            });
        }
    }
    next();
});
exports.getTweetChildrenValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    tweet_type: {
        isIn: {
            options: [tweetTypes],
            errorMessage: messages_1.TWEETS_MESSAGES.INVALID_TYPE
        }
    }
}, ['query']));
exports.panigationValidation = (0, validation_utils_1.validate)((0, express_validator_1.checkSchema)({
    limit: {
        isNumeric: true,
        custom: {
            options: (value, { req }) => {
                const num = Number(value);
                if (num > 100 || num < 1) {
                    throw new Error(messages_1.TWEET_CHIRLDREN_MESSAGES.LIMIT_MUST_BE_BETWEEN_1_AND_100);
                }
                return true;
            }
        }
    },
    page: {
        isNumeric: true,
        custom: {
            options: (value, { req }) => {
                const num = Number(value);
                if (num < 1) {
                    throw new Error(messages_1.TWEET_CHIRLDREN_MESSAGES.LIMIT_MUST_BE_GREATER_THAN_0);
                }
                return true;
            }
        }
    }
}, ['query']));
