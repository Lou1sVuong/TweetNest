"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookmarks_controllers_1 = require("../controllers/bookmarks.controllers");
const tweets_middlewares_1 = require("../middlewares/tweets.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const bookmarksRouters = (0, express_1.Router)();
/**
 * Description: bookmark
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
bookmarksRouters.post('/', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.tweetIdValidation, (0, handlers_1.wrapRequestHandler)(bookmarks_controllers_1.bookmarkTweetController));
/**
 * Description: unBookmark
 * Path: /tweets/:tweet_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
bookmarksRouters.delete('/tweets/:tweet_id', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.tweetIdValidation, (0, handlers_1.wrapRequestHandler)(bookmarks_controllers_1.unBookmarkTweetController));
exports.default = bookmarksRouters;
