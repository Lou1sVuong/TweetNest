import { Router } from 'express'
import { serveImageController } from '~/controllers/medias.controllers'

const staticRouters = Router()

staticRouters.get('/image/:name', serveImageController)

export default staticRouters
