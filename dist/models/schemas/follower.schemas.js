"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Follower {
    _id;
    user_id;
    followed_user_id;
    create_at;
    constructor({ _id, user_id, followed_user_id, create_at }) {
        this._id = _id;
        this.user_id = user_id;
        this.followed_user_id = followed_user_id;
        this.create_at = create_at || new Date();
    }
}
exports.default = Follower;
