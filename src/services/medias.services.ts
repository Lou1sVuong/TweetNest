import fs from 'fs'
import { Request } from 'express'
import { getNameFileFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import { isProduction } from '~/utils/config'
import { config } from 'dotenv'
import { Mediatype } from '~/constants/enums'
import { Media } from '~/models/orther'
config()
class MediasService {
  async UploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFileFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: Mediatype.Image
        }
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
}

const mediasService = new MediasService()
export default mediasService
