import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controllers'

const staticRouters = Router()

staticRouters.get('/image/:name', serveImageController)
staticRouters.get('/video/:name', serveVideoController)

export default staticRouters
