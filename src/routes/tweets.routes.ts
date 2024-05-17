import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  audienceValidation,
  createTweetValidation,
  getTweetChildrenValidation,
  panigationValidation,
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
 * Header: {Authorization?: Bearer <access_token> }
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
 * Header: {Authorization?: Bearer <access_token> }
 * Query: {page?: number, limit?: number , tweet_type?: TweetType}
 */

tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidation,
  panigationValidation,
  getTweetChildrenValidation,
  isUserLoggedInValidation(accessTokenValidation),
  isUserLoggedInValidation(verifiedUserValidation),
  audienceValidation,
  wrapRequestHandler(getTweetChildrenController)
)

/**
 * Description: Get new feed
 * Path: /
 * Method: GET
 * Header: {Authorization? Bearer <access_token> }
 * Query: {page?: number, limit?: number }
 */

tweetsRouter.get(
  '/',
  panigationValidation,
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(getNewFeedsController)
)

export default tweetsRouter
