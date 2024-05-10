import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controllers'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouters = Router()

mediasRouters.post(
  '/upload-image',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(uploadImageController)
)

mediasRouters.post(
  '/upload-video',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(uploadVideoController)
)

mediasRouters.post(
  '/upload-video-hls',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(uploadVideoHLSController)
)

mediasRouters.get(
  '/video-status/:id',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(videoStatusController)
)

export default mediasRouters
