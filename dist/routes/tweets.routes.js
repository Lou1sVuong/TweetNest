"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tweets_controllers_1 = require("../controllers/tweets.controllers");
const tweets_middlewares_1 = require("../middlewares/tweets.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const tweetsRouter = (0, express_1.Router)();
/**
 * Description: create a new tweet
 * Path: /
 * Method: POST
 * Header: {Authorization?: Bearer <access_token> }
 * Body : TweetReqBody
 */
tweetsRouter.post('/', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.createTweetValidation, (0, handlers_1.wrapRequestHandler)(tweets_controllers_1.createTweetController));
/**
 * Description: Get tweet detail
 * Path: /:tweet_id
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */
tweetsRouter.get('/:tweet_id', tweets_middlewares_1.tweetIdValidation, (0, users_middlewares_1.isUserLoggedInValidation)(users_middlewares_1.accessTokenValidation), (0, users_middlewares_1.isUserLoggedInValidation)(users_middlewares_1.verifiedUserValidation), tweets_middlewares_1.audienceValidation, (0, handlers_1.wrapRequestHandler)(tweets_controllers_1.getTweetController));
/**
 * Description: Get tweet children
 * Path: /:tweet_id/children
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 * Query: {page?: number, limit?: number , tweet_type?: TweetType}
 */
tweetsRouter.get('/:tweet_id/children', tweets_middlewares_1.tweetIdValidation, tweets_middlewares_1.panigationValidation, tweets_middlewares_1.getTweetChildrenValidation, (0, users_middlewares_1.isUserLoggedInValidation)(users_middlewares_1.accessTokenValidation), (0, users_middlewares_1.isUserLoggedInValidation)(users_middlewares_1.verifiedUserValidation), tweets_middlewares_1.audienceValidation, (0, handlers_1.wrapRequestHandler)(tweets_controllers_1.getTweetChildrenController));
/**
 * Description: Get new feed
 * Path: /
 * Method: GET
 * Header: {Authorization? Bearer <access_token> }
 * Query: {page?: number, limit?: number }
 */
tweetsRouter.get('/', tweets_middlewares_1.panigationValidation, users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, (0, handlers_1.wrapRequestHandler)(tweets_controllers_1.getNewFeedsController));
exports.default = tweetsRouter;
