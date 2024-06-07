"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikesTweetController = exports.likesTweetController = void 0;
const messages_1 = require("../constants/messages");
const likes_services_1 = __importDefault(require("../services/likes.services"));
const likesTweetController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const tweet_id = req.body.tweet_id;
    const result = await likes_services_1.default.likeTweet(user_id, tweet_id);
    return res.json({
        message: messages_1.LIKE_MESSGAGES.LIKE_TWEET_SUCCESSFULLY,
        result
    });
};
exports.likesTweetController = likesTweetController;
const unlikesTweetController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const tweet_id = req.params.tweet_id;
    await likes_services_1.default.unlikeTweet(user_id, tweet_id);
    return res.json({
        message: messages_1.LIKE_MESSGAGES.UNLIKE_TWEET_SUCCESSFULLY
    });
};
exports.unlikesTweetController = unlikesTweetController;
