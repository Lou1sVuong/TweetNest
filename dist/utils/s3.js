"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFileFromS3 = exports.uploadFileToS3 = void 0;
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../constants/config");
const s3 = new client_s3_1.S3({
    region: config_1.envConfig.awsRegion,
    credentials: {
        secretAccessKey: config_1.envConfig.awsSecretAccessKey,
        accessKeyId: config_1.envConfig.awsAccessKeyId
    }
});
// kiem tra xem co ket noi duoc voi s3 khong
// s3.listBuckets({}).then((data) => console.log(data))
// upload file to s3
const uploadFileToS3 = ({ fileName, filePath, contentType }) => {
    const parallelUploads3 = new lib_storage_1.Upload({
        client: s3,
        params: {
            Bucket: config_1.envConfig.bucketName,
            Key: fileName,
            Body: fs_1.default.readFileSync(filePath),
            ContentType: contentType
        },
        tags: [
        /*...*/
        ], // optional tags
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false
    });
    return parallelUploads3.done();
};
exports.uploadFileToS3 = uploadFileToS3;
const sendFileFromS3 = async (res, filePath) => {
    try {
        const data = await s3.getObject({
            Bucket: config_1.envConfig.bucketName,
            Key: filePath
        });
        data.Body.pipe(res);
    }
    catch (error) {
        res.status(404).send('File not found');
    }
};
exports.sendFileFromS3 = sendFileFromS3;
// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })
// parallelUploads3.done().then((res) => {
//   console.log(res)
// })
