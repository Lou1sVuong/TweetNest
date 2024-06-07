"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const bookmark_schemas_1 = __importDefault(require("../models/schemas/bookmark.schemas"));
const database_services_1 = __importDefault(require("../services/database.services"));
class BookmarkService {
    async bookmarkTweet(user_id, tweet_id) {
        const result = await database_services_1.default.bookmarks.findOneAndUpdate({ user_id: new mongodb_1.ObjectId(user_id), tweet_id: new mongodb_1.ObjectId(tweet_id) }, {
            $setOnInsert: new bookmark_schemas_1.default({
                user_id: new mongodb_1.ObjectId(user_id),
                tweet_id: new mongodb_1.ObjectId(tweet_id)
            })
        }, {
            upsert: true,
            returnDocument: 'after'
        });
        return result;
    }
    async unBookmarkTweet(user_id, tweet_id) {
        const result = await database_services_1.default.bookmarks.findOneAndDelete({
            user_id: new mongodb_1.ObjectId(user_id),
            tweet_id: new mongodb_1.ObjectId(tweet_id)
        });
        return result;
    }
}
const bookmarkService = new BookmarkService();
exports.default = bookmarkService;
