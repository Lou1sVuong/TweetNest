import fs from 'fs'
import fsPromise from 'fs/promises'
import { Request } from 'express'
import { getFiles, getNameFileFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'
import { EncodingStatus, Mediatype } from '~/constants/enums'
import { Media } from '~/models/other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseServices from '~/services/database.services'
import VideoStatus from '~/models/schemas/videoStatus.schemas'
import { ErrorWithStatus } from '~/models/errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { uploadFileToS3 } from '~/utils/s3'
import { rimrafSync, rimraf } from 'rimraf'
import { envConfig, isProduction } from '~/constants/config'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    const idName = getNameFileFromFullName(item.split(/[\\/]/).pop() as string)
    await databaseServices.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    this.encoding = true
    if (this.items.length > 0) {
      const videoPath = this.items[0]
      const idName = getNameFileFromFullName(videoPath.split(/[\\/]/).pop() as string)
      await databaseServices.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        const file = getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await Promise.all(
          file.map((filepath) => {
            const filename = 'video-hls' + filepath.replace(path.resolve(UPLOAD_VIDEO_DIR), '')
            const newFilename = filename.replace(/\\/g, '/')
            return uploadFileToS3({
              filePath: filepath,
              fileName: newFilename,
              contentType: 'application/x-mpegURL'
            })
          })
        )
        rimrafSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await databaseServices.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode video ${idName} success`)
      } catch (error) {
        await databaseServices.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((error) => {
            console.log('Update video status error')
            console.log(error)
          })
        console.log(`Encode video ${idName} error`)
        console.log(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}

const queue = new Queue()

class MediasService {
  async UploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFileFromFullName(file.newFilename)
        const extension = path.extname(file.newFilename).toLowerCase()
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        if (extension === '.jpg' || extension === '.jpeg') {
          // Nếu file đã là JPEG, chỉ cần đổi tên và chuyển đến newPath
          await fsPromise.rename(file.filepath, newPath)
        } else {
          // Nếu file không phải JPEG, dùng sharp để chuyển đổi
          await sharp(file.filepath).jpeg().toFile(newPath)
        }
        const s3Result = await uploadFileToS3({
          fileName: 'images/' + newFullFilename,
          filePath: newPath,
          contentType: 'image/jpeg'
        })
        rimraf(newPath)
        return {
          url: s3Result.Location as string,
          type: Mediatype.Image
        }
      })
    )

    return result
  }
  async UploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (video) => {
        const S3Result = await uploadFileToS3({
          fileName: 'videos/' + video.newFilename,
          filePath: video.filepath,
          contentType: 'video/mp4'
        })
        // const PathofFolder = removeLastPart(video.filepath)
        const PathofFolder = video.filepath.replace(video.newFilename, '')
        rimrafSync(PathofFolder)
        return {
          url: S3Result.Location as string,
          type: Mediatype.Video
        }
        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/static/video/${video.newFilename}`
        //     : `http://localhost:${envConfig.port}/static/video/${video.newFilename}`,
        //   type: Mediatype.Video
        // }
      })
    )
    return result
  }

  async UploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFileFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: Mediatype.HLS
        }
      })
    )
    return result
  }

  async GetVideoStatus(id: string) {
    const data = await databaseServices.videoStatus.findOne({ name: id })
    if (!data) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Video not found'
      })
    }
    return data
  }
}

const mediasService = new MediasService()
export default mediasService
