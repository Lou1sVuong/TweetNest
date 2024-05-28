import fs from 'fs'
import fsPromise from 'fs/promises'
import { Request } from 'express'
import { getNameFileFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import { isProduction } from '~/utils/config'
import { config } from 'dotenv'
import { EncodingStatus, Mediatype } from '~/constants/enums'
import { Media } from '~/models/other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseServices from '~/services/database.services'
import VideoStatus from '~/models/schemas/videoStatus.schemas'
import { ErrorWithStatus } from '~/models/errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { uploadFileToS3 } from '~/utils/s3'
config()

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
        await fsPromise.unlink(videoPath)
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
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)

        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          fileName: newFullFilename,
          filePath: newPath,
          contentType: 'image/jpeg'
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: s3Result.Location as string,
          type: Mediatype.Image
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/${newFullFilename}`
        //     : `http://localhost:${process.env.PORT}/static/image/${newFullFilename}`,
        //   type: Mediatype.Image
        // }
      })
    )
    return result
  }
  async UploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result = files.map((video) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${video.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${video.newFilename}`,
        type: Mediatype.Video
      }
    })
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
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}.m3u8`,
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
