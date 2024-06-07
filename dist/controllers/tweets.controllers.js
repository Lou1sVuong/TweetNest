"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewFeedsController = exports.getTweetChildrenController = exports.getTweetController = exports.createTweetController = void 0;
const messages_1 = require("../constants/messages");
const tweets_services_1 = __importDefault(require("../services/tweets.services"));
const createTweetController = async (req, res, next) => {
    const tweet = req.body;
    const { user_id } = req.decoded_authorization;
    const result = await tweets_services_1.default.createTweet(user_id, tweet);
    return res.json({
        message: messages_1.TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
        result
    });
};
exports.createTweetController = createTweetController;
const getTweetController = async (req, res) => {
    const tweet_id = req.params.tweet_id;
    const user_id = req.decoded_authorization?.user_id;
    const result = await tweets_services_1.default.increaseView(tweet_id, user_id);
    const tweet = {
        ...req.tweet,
        guest_view: result.guest_view,
        user_view: result.user_view,
        updated_at: result.updated_at
    };
    console.log(result);
    return res.json({
        message: messages_1.TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
        result: tweet
    });
};
exports.getTweetController = getTweetController;
const getTweetChildrenController = async (req, res) => {
    const tweet_id = req.params.tweet_id;
    const tweet_type = Number(req.query.tweet_type);
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const user_id = req.decoded_authorization?.user_id;
    const { tweets, total } = await tweets_services_1.default.getTweetChildren({
        tweet_id,
        tweet_type,
        limit,
        page,
        user_id
    });
    return res.json({
        message: messages_1.TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
        result: {
            tweets,
            tweet_type,
            limit,
            page,
            total_pages: Math.ceil(total / limit)
        }
    });
};
exports.getTweetChildrenController = getTweetChildrenController;
const getNewFeedsController = async (req, res) => {
    const user_id = req.decoded_authorization?.user_id;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const result = await tweets_services_1.default.getNewFeeds({ user_id, limit, page });
    return res.json({
        message: messages_1.TWEETS_MESSAGES.GET_NEW_FEEDS_SUCCESSFULLY,
        result: {
            tweets: result.tweets,
            limit,
            page,
            total_pages: Math.ceil(result.total / limit)
        }
    });
};
exports.getNewFeedsController = getNewFeedsController;
