"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_VIDEO_DIR = exports.UPLOAD_VIDEO_TEMP_DIR = exports.UPLOAD_IMAGE_DIR = exports.UPLOAD_IMAGE_TEMP_DIR = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_IMAGE_TEMP_DIR = path_1.default.resolve('uploads/images/temp');
exports.UPLOAD_IMAGE_DIR = path_1.default.resolve('uploads/images');
exports.UPLOAD_VIDEO_TEMP_DIR = path_1.default.resolve('uploads/videos/temp');
exports.UPLOAD_VIDEO_DIR = path_1.default.resolve('uploads/videos');
