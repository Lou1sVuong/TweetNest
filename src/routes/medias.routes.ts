import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouters = Router()

mediasRouters.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediasRouters
