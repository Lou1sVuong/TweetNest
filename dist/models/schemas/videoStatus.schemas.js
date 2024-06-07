"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VideoStatus {
    _id;
    name;
    status;
    message;
    created_at;
    updated_at;
    constructor({ _id, name, status, message, created_at, updated_at }) {
        const date = new Date();
        this._id = _id;
        this.name = name;
        this.status = status;
        this.message = message || '';
        this.created_at = created_at || date;
        this.updated_at = updated_at || date;
    }
}
exports.default = VideoStatus;
