import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouters = Router()

mediasRouters.post('/upload-image', wrapRequestHandler(uploadSingleImageController))

export default mediasRouters
