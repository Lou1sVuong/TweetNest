"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unBookmarkTweetController = exports.bookmarkTweetController = void 0;
const messages_1 = require("../constants/messages");
const bookmarks_services_1 = __importDefault(require("../services/bookmarks.services"));
const bookmarkTweetController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const tweet_id = req.body.tweet_id;
    const result = await bookmarks_services_1.default.bookmarkTweet(user_id, tweet_id);
    return res.json({
        message: messages_1.BOOKMARKS_MESSGAGES.BOOKMARK_TWEET_SUCCESSFULLY,
        result
    });
};
exports.bookmarkTweetController = bookmarkTweetController;
const unBookmarkTweetController = async (req, res, next) => {
    const { user_id } = req.decoded_authorization;
    const tweet_id = req.params.tweet_id;
    await bookmarks_services_1.default.unBookmarkTweet(user_id, tweet_id);
    return res.json({
        message: messages_1.BOOKMARKS_MESSGAGES.UNBOOKMARK_TWEET_SUCCESSFULLY
    });
};
exports.unBookmarkTweetController = unBookmarkTweetController;
