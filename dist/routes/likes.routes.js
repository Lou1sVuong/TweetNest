"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_controller_1 = require("../controllers/likes.controller");
const tweets_middlewares_1 = require("../middlewares/tweets.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const likesRouters = (0, express_1.Router)();
/**
 * Description: likes
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
likesRouters.post('/', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.tweetIdValidation, (0, handlers_1.wrapRequestHandler)(likes_controller_1.likesTweetController));
/**
 * Description: unlikes
 * Path: /tweets/:tweet_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
likesRouters.delete('/tweets/:tweet_id', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.tweetIdValidation, (0, handlers_1.wrapRequestHandler)(likes_controller_1.unlikesTweetController));
exports.default = likesRouters;
