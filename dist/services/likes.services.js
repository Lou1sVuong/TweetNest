"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const like_schemas_1 = __importDefault(require("../models/schemas/like.schemas"));
const database_services_1 = __importDefault(require("../services/database.services"));
class LikeService {
    async likeTweet(user_id, tweet_id) {
        const result = await database_services_1.default.likes.findOneAndUpdate({ user_id: new mongodb_1.ObjectId(user_id), tweet_id: new mongodb_1.ObjectId(tweet_id) }, {
            $setOnInsert: new like_schemas_1.default({
                user_id: new mongodb_1.ObjectId(user_id),
                tweet_id: new mongodb_1.ObjectId(tweet_id)
            })
        }, {
            upsert: true,
            returnDocument: 'after'
        });
        return result;
    }
    async unlikeTweet(user_id, tweet_id) {
        const result = await database_services_1.default.likes.findOneAndDelete({
            user_id: new mongodb_1.ObjectId(user_id),
            tweet_id: new mongodb_1.ObjectId(tweet_id)
        });
        return result;
    }
}
const likeService = new LikeService();
exports.default = likeService;
