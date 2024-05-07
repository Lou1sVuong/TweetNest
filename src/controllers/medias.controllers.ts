import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.handleUploadSingleImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
    url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      return res.status((err as any).status).send(USERS_MESSAGES.IMAGE_NOT_FOUND)
    }
  })
}
