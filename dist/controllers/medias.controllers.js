"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveSegmentController = exports.serveM3u8Controller = exports.serveVideoController = exports.serveImageController = exports.videoStatusController = exports.uploadVideoHLSController = exports.uploadVideoController = exports.uploadImageController = void 0;
const path_1 = __importDefault(require("path"));
const dir_1 = require("../constants/dir");
const messages_1 = require("../constants/messages");
const medias_services_1 = __importDefault(require("../services/medias.services"));
const s3_1 = require("../utils/s3");
const uploadImageController = async (req, res, next) => {
    const url = await medias_services_1.default.UploadImage(req);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
        url
    });
};
exports.uploadImageController = uploadImageController;
const uploadVideoController = async (req, res, next) => {
    const url = await medias_services_1.default.UploadVideo(req);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPLOAD_VIDEO_SUCCESSFULLY,
        url
    });
};
exports.uploadVideoController = uploadVideoController;
const uploadVideoHLSController = async (req, res, next) => {
    const url = await medias_services_1.default.UploadVideoHLS(req);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPLOAD_VIDEO_SUCCESSFULLY,
        url
    });
};
exports.uploadVideoHLSController = uploadVideoHLSController;
const videoStatusController = async (req, res, next) => {
    const { id } = req.params;
    const result = await medias_services_1.default.GetVideoStatus(id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESSFULLY,
        result
    });
};
exports.videoStatusController = videoStatusController;
const serveImageController = (req, res, next) => {
    const { name } = req.params;
    return res.sendFile(path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, name), (err) => {
        if (err) {
            return res.status(err.status).send(messages_1.USERS_MESSAGES.IMAGE_NOT_FOUND);
        }
    });
};
exports.serveImageController = serveImageController;
const serveVideoController = (req, res, next) => {
    const { name } = req.params;
    const folder = name.split('.')[0];
    return res.sendFile(path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, folder, name), (err) => {
        if (err) {
            return res.status(err.status).send(messages_1.USERS_MESSAGES.VIDEO_NOT_FOUND);
        }
    });
};
exports.serveVideoController = serveVideoController;
const serveM3u8Controller = (req, res, next) => {
    const { id } = req.params;
    (0, s3_1.sendFileFromS3)(res, `videos-hls/${id}/master.m3u8`);
    // const readId = id.replace('.m3u8', '')
    // return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    //   if (err) {
    //     return res.status((err as any).status).send(USERS_MESSAGES.VIDEO_NOT_FOUND)
    //   }
    // })
};
exports.serveM3u8Controller = serveM3u8Controller;
const serveSegmentController = (req, res, next) => {
    const { id, v, segment } = req.params;
    (0, s3_1.sendFileFromS3)(res, `videos-hls/${id}/${v}/${segment}`);
    // return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    //   if (err) {
    //     return res.status((err as any).status).send(USERS_MESSAGES.VIDEO_NOT_FOUND)
    //   }
    // })
};
exports.serveSegmentController = serveSegmentController;
