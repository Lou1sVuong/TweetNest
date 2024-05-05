import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express'

export const initFolder = () => {
  const uploadFolder = path.resolve('uploads')
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder),
      {
        recursive: true
      }
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300kb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log('fields', fields)
      console.log('files', files)
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files)
    })
  })
}
