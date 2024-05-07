import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
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

export default mediasRouters
