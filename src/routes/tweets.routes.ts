import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidation } from '~/middlewares/tweets.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: create a new tweet
 * Path: /
 * Method: POST
 * Body : TweetReqBody
 */

tweetsRouter.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  // createTweetValidation,
  wrapRequestHandler(createTweetController)
)

export default tweetsRouter
