import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'

const mediasRouters = Router()

mediasRouters.post('/upload-image', uploadSingleImageController)

export default mediasRouters
