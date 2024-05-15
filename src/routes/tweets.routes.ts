import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controllers'
import {
  audienceValidation,
  createTweetValidation,
  getTweetChildrenValidation,
  tweetIdValidation
} from '~/middlewares/tweets.middlewares'
import {
  accessTokenValidation,
  isUserLoggedInValidation,
  verifiedUserValidation
} from '~/middlewares/users.middlewares'
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
  createTweetValidation,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: Get tweet detail
 * Path: /:tweet_id
 * Method: GET
 * Header: {Authorization?: Bearer token}
 */

tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidation,
  isUserLoggedInValidation(accessTokenValidation),
  isUserLoggedInValidation(verifiedUserValidation),
  audienceValidation,
  wrapRequestHandler(getTweetController)
)

/**
 * Description: Get tweet children
 * Path: /:tweet_id/children
 * Method: GET
 * Header: {Authorization?: Bearer token}
 * Query: {page?: number, limit?: number , tweet_type?: TweetType}
 */

tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidation,
  getTweetChildrenValidation,
  isUserLoggedInValidation(accessTokenValidation),
  isUserLoggedInValidation(verifiedUserValidation),
  audienceValidation,
  wrapRequestHandler(getTweetChildrenController)
)

export default tweetsRouter
