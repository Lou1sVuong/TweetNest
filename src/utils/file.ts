import fs from 'fs'
import { Request, Response } from 'express'
import { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 3000 * 1024, // 300kb
    maxTotalFileSize: 3000 * 1024 * 4, // 300kb * 4 (files)
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const idName = uuidv4()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR, idName),
    maxFiles: 1,
    // keepExtensions: true, ( because formidable had a bug with keepExtensions, so we need to rename file after upload , handle in next step)
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      const video = files.video as File[]
      video.forEach((video) => {
        const extension = getExtensionFileFromFullName(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + extension)
        video.newFilename = video.newFilename + '.' + extension
        video.filepath = video.filepath + '.' + extension
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameFileFromFullName = (fullNameFile: string) => {
  const nameArr = fullNameFile.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtensionFileFromFullName = (fullNameFile: string) => {
  const nameArr = fullNameFile.split('.')
  return nameArr.pop()
}
