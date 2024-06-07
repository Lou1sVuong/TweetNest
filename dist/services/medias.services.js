"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const file_1 = require("../utils/file");
const sharp_1 = __importDefault(require("sharp"));
const dir_1 = require("../constants/dir");
const path_1 = __importDefault(require("path"));
const enums_1 = require("../constants/enums");
const video_1 = require("../utils/video");
const database_services_1 = __importDefault(require("../services/database.services"));
const videoStatus_schemas_1 = __importDefault(require("../models/schemas/videoStatus.schemas"));
const errors_1 = require("../models/errors");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const s3_1 = require("../utils/s3");
const rimraf_1 = require("rimraf");
const config_1 = require("../constants/config");
class Queue {
    items;
    encoding;
    constructor() {
        this.items = [];
        this.encoding = false;
    }
    async enqueue(item) {
        this.items.push(item);
        const idName = (0, file_1.getNameFileFromFullName)(item.split(/[\\/]/).pop());
        await database_services_1.default.videoStatus.insertOne(new videoStatus_schemas_1.default({
            name: idName,
            status: enums_1.EncodingStatus.Pending
        }));
        this.processEncode();
    }
    async processEncode() {
        this.encoding = true;
        if (this.items.length > 0) {
            const videoPath = this.items[0];
            const idName = (0, file_1.getNameFileFromFullName)(videoPath.split(/[\\/]/).pop());
            await database_services_1.default.videoStatus.updateOne({ name: idName }, {
                $set: {
                    status: enums_1.EncodingStatus.Processing
                },
                $currentDate: {
                    updated_at: true
                }
            });
            try {
                await (0, video_1.encodeHLSWithMultipleVideoStreams)(videoPath);
                this.items.shift();
                const file = (0, file_1.getFiles)(path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, idName));
                await Promise.all(file.map((filepath) => {
                    const filename = 'video-hls' + filepath.replace(path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR), '');
                    const newFilename = filename.replace(/\\/g, '/');
                    return (0, s3_1.uploadFileToS3)({
                        filePath: filepath,
                        fileName: newFilename,
                        contentType: 'application/x-mpegURL'
                    });
                }));
                (0, rimraf_1.rimrafSync)(path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, idName));
                await database_services_1.default.videoStatus.updateOne({ name: idName }, {
                    $set: {
                        status: enums_1.EncodingStatus.Success
                    },
                    $currentDate: {
                        updated_at: true
                    }
                });
                console.log(`Encode video ${idName} success`);
            }
            catch (error) {
                await database_services_1.default.videoStatus
                    .updateOne({ name: idName }, {
                    $set: {
                        status: enums_1.EncodingStatus.Failed
                    },
                    $currentDate: {
                        updated_at: true
                    }
                })
                    .catch((error) => {
                    console.log('Update video status error');
                    console.log(error);
                });
                console.log(`Encode video ${idName} error`);
                console.log(error);
            }
            this.encoding = false;
            this.processEncode();
        }
        else {
            console.log('Encode video queue is empty');
        }
    }
}
const queue = new Queue();
class MediasService {
    async UploadImage(req) {
        const files = await (0, file_1.handleUploadImage)(req);
        const result = await Promise.all(files.map(async (file) => {
            const newName = (0, file_1.getNameFileFromFullName)(file.newFilename);
            const extension = path_1.default.extname(file.newFilename).toLowerCase();
            const newFullFilename = `${newName}.jpg`;
            const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, newFullFilename);
            if (extension === '.jpg' || extension === '.jpeg') {
                // Nếu file đã là JPEG, chỉ cần đổi tên và chuyển đến newPath
                await promises_1.default.rename(file.filepath, newPath);
            }
            else {
                // Nếu file không phải JPEG, dùng sharp để chuyển đổi
                await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
            }
            const s3Result = await (0, s3_1.uploadFileToS3)({
                fileName: 'images/' + newFullFilename,
                filePath: newPath,
                contentType: 'image/jpeg'
            });
            (0, rimraf_1.rimraf)(newPath);
            return {
                url: s3Result.Location,
                type: enums_1.Mediatype.Image
            };
        }));
        return result;
    }
    async UploadVideo(req) {
        const files = await (0, file_1.handleUploadVideo)(req);
        const result = await Promise.all(files.map(async (video) => {
            const S3Result = await (0, s3_1.uploadFileToS3)({
                fileName: 'videos/' + video.newFilename,
                filePath: video.filepath,
                contentType: 'video/mp4'
            });
            // const PathofFolder = removeLastPart(video.filepath)
            const PathofFolder = video.filepath.replace(video.newFilename, '');
            (0, rimraf_1.rimrafSync)(PathofFolder);
            return {
                url: S3Result.Location,
                type: enums_1.Mediatype.Video
            };
            // return {
            //   url: isProduction
            //     ? `${envConfig.host}/static/video/${video.newFilename}`
            //     : `http://localhost:${envConfig.port}/static/video/${video.newFilename}`,
            //   type: Mediatype.Video
            // }
        }));
        return result;
    }
    async UploadVideoHLS(req) {
        const files = await (0, file_1.handleUploadVideo)(req);
        const result = await Promise.all(files.map(async (file) => {
            const newName = (0, file_1.getNameFileFromFullName)(file.newFilename);
            queue.enqueue(file.filepath);
            return {
                url: config_1.isProduction
                    ? `${config_1.envConfig.host}/static/video-hls/${newName}/master.m3u8`
                    : `http://localhost:${config_1.envConfig.port}/static/video-hls/${newName}/master.m3u8`,
                type: enums_1.Mediatype.HLS
            };
        }));
        return result;
    }
    async GetVideoStatus(id) {
        const data = await database_services_1.default.videoStatus.findOne({ name: id });
        if (!data) {
            throw new errors_1.ErrorWithStatus({
                status: httpStatus_1.default.NOT_FOUND,
                message: 'Video not found'
            });
        }
        return data;
    }
}
const mediasService = new MediasService();
exports.default = mediasService;
