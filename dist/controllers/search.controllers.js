"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = void 0;
const search_services_1 = __importDefault(require("../services/search.services"));
const messages_1 = require("../constants/messages");
const searchController = async (req, res, next) => {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const content = req.query.content;
    const media_type = req.query.media_type;
    const people_follow = req.query.people_follow;
    const user_id = req.decoded_authorization?.user_id;
    const result = await search_services_1.default.search({
        limit,
        page,
        content,
        user_id,
        people_follow,
        media_type
    });
    res.json({
        message: messages_1.SEARCH_MESSAGES.SEARCH_SUCCESSFULLY,
        result: {
            ...result,
            tweets: result.tweets,
            limit,
            page,
            total_pages: Math.ceil(result.total / limit)
        }
    });
};
exports.searchController = searchController;
