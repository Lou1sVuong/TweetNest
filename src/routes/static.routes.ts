import { Router } from 'express'
import {
  serveImageController,
  serveVideoController,
  serveM3u8Controller,
  serveSegmentController
} from '~/controllers/medias.controllers'

const staticRouters = Router()

staticRouters.get('/image/:name', serveImageController)
staticRouters.get('/video/:name', serveVideoController)
staticRouters.get('/video-hls/:id/master.m3u8', serveM3u8Controller)
staticRouters.get('/video-hls/:id/:v/:segment', serveSegmentController)

export default staticRouters
