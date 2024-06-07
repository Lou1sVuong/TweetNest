"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RefreshToken {
    _id;
    token;
    created_at;
    user_id;
    iat;
    exp;
    constructor({ _id, token, create_at, user_id, iat, exp }) {
        this._id = _id;
        this.token = token;
        this.created_at = create_at || new Date();
        this.user_id = user_id;
        this.iat = new Date(iat * 1000); // convert Epoch time to Date
        this.exp = new Date(exp * 1000); // convert Epoch time to Date
    }
}
exports.default = RefreshToken;
