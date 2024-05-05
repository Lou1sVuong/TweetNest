import fs from 'fs'
import { Request } from 'express'
import { getNameFileFromFullName, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFileFromFullName(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
    fs.unlinkSync(file.filepath)
    return `http://localhost:8000/uploads/${newName}.jpg`
  }
}

const mediasService = new MediasService()
export default mediasService
