import path from 'path'
import fs from 'fs'

export const initFolder = () => {
  const uploadFolder = path.resolve('uploads')
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder),
      {
        recursive: true
      }
  }
}
