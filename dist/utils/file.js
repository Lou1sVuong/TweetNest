"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = exports.removeLastPart = exports.getExtensionFileFromFullName = exports.getNameFileFromFullName = exports.handleUploadVideo = exports.handleUploadImage = exports.initFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const dir_1 = require("../constants/dir");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const errors_1 = require("../models/errors");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const initFolder = () => {
    ;
    [dir_1.UPLOAD_IMAGE_TEMP_DIR, dir_1.UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    });
};
exports.initFolder = initFolder;
const handleUploadImage = async (req) => {
    const formidable = (await import('formidable')).default;
    const form = formidable({
        uploadDir: dir_1.UPLOAD_IMAGE_TEMP_DIR,
        maxFiles: 4,
        keepExtensions: true,
        maxFileSize: 3000 * 1024, // 3000KB
        maxTotalFileSize: 3000 * 1024 * 4, // 3000KB * 4
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'image' && Boolean(mimetype?.includes('image/'));
            if (!valid) {
                form.emit('error', new Error('Invalid file type'));
            }
            return valid;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            if (!Boolean(files.image)) {
                return reject(new errors_1.ErrorWithStatus({
                    message: 'File is empty',
                    status: httpStatus_1.default.BAD_REQUEST
                }));
            }
            resolve(files.image);
        });
    });
};
exports.handleUploadImage = handleUploadImage;
const handleUploadVideo = async (req) => {
    const formidable = (await import('formidable')).default;
    const idName = (0, uuid_1.v4)();
    const folderPath = path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, idName);
    fs_1.default.mkdirSync(folderPath);
    const form = formidable({
        uploadDir: path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, idName),
        maxFiles: 1,
        // keepExtensions: true, ( because formidable had a bug with keepExtensions, so we need to rename file after upload , handle in next step)
        maxFileSize: 50 * 1024 * 1024, // 50MB
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'));
            if (!valid) {
                form.emit('error', new Error('Invalid file type'));
            }
            return valid;
        },
        filename: function () {
            return idName;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            if (!Boolean(files.video)) {
                return reject(new errors_1.ErrorWithStatus({
                    message: 'File is empty',
                    status: httpStatus_1.default.BAD_REQUEST
                }));
            }
            const video = files.video;
            video.forEach((video) => {
                const extension = (0, exports.getExtensionFileFromFullName)(video.originalFilename);
                fs_1.default.renameSync(video.filepath, video.filepath + '.' + extension);
                video.newFilename = video.newFilename + '.' + extension;
                video.filepath = video.filepath + '.' + extension;
            });
            resolve(files.video);
        });
    });
};
exports.handleUploadVideo = handleUploadVideo;
const getNameFileFromFullName = (fullNameFile) => {
    const nameArr = fullNameFile.split('.');
    nameArr.pop();
    return nameArr.join('');
};
exports.getNameFileFromFullName = getNameFileFromFullName;
const getExtensionFileFromFullName = (fullNameFile) => {
    const nameArr = fullNameFile.split('.');
    return nameArr.pop();
};
exports.getExtensionFileFromFullName = getExtensionFileFromFullName;
const removeLastPart = (path) => {
    const lastIndex = path.lastIndexOf('\\');
    if (lastIndex !== -1) {
        return path.substring(0, lastIndex);
    }
    return path;
};
exports.removeLastPart = removeLastPart;
// Recursive function to get files
const getFiles = (dir, files = []) => {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs_1.default.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs_1.default.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            (0, exports.getFiles)(name, files);
        }
        else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
};
exports.getFiles = getFiles;
