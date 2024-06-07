"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Tweet {
    _id;
    user_id;
    type;
    audience;
    content;
    parent_id; // null if it's a root tweet
    hashtags;
    mentions;
    medias;
    guest_view;
    user_view;
    created_at;
    updated_at;
    constructor({ audience, content, guest_view, hashtags, medias, mentions, parent_id, type, user_id, user_view, created_at, updated_at }) {
        const data = new Date();
        this._id = new mongodb_1.ObjectId();
        this.user_id = user_id;
        this.type = type;
        this.audience = audience;
        this.content = content;
        this.parent_id = parent_id ? new mongodb_1.ObjectId(parent_id) : null;
        this.hashtags = hashtags;
        this.mentions = mentions.map((item) => new mongodb_1.ObjectId(item));
        this.medias = medias;
        this.guest_view = guest_view || 0;
        this.user_view = user_view || 0;
        this.created_at = created_at || data;
        this.updated_at = updated_at || data;
    }
}
exports.default = Tweet;
