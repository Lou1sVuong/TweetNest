"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Bookmark {
    _id;
    user_id;
    tweet_id;
    created_at;
    constructor({ _id, user_id, tweet_id, created_at }) {
        this._id = _id || new mongodb_1.ObjectId();
        this.user_id = user_id;
        this.tweet_id = tweet_id;
        this.created_at = created_at || new Date();
    }
}
exports.default = Bookmark;
