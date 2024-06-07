"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controllers_1 = require("../controllers/search.controllers");
const search_middlewares_1 = require("../middlewares/search.middlewares");
const tweets_middlewares_1 = require("../middlewares/tweets.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const searchRouters = (0, express_1.Router)();
/**
 * Description: Search for tweets
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
searchRouters.get('/', users_middlewares_1.accessTokenValidation, users_middlewares_1.verifiedUserValidation, tweets_middlewares_1.panigationValidation, search_middlewares_1.searchValidation, (0, handlers_1.wrapRequestHandler)(search_controllers_1.searchController));
exports.default = searchRouters;
