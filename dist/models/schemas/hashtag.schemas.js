"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class HashTag {
    _id;
    name;
    created_at;
    constructor({ _id, name, created_at }) {
        this._id = _id || new mongodb_1.ObjectId();
        this.name = name;
        this.created_at = created_at || new Date();
    }
}
exports.default = HashTag;
