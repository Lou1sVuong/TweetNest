import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSGAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/bookmark.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import likeService from '~/services/likes.services'

export const likesTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.body.tweet_id
  const result = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSGAGES.LIKE_TWEET_SUCCESSFULLY,
    result
  })
}

export const unlikesTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.params.tweet_id
  await likeService.unlikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSGAGES.UNLIKE_TWEET_SUCCESSFULLY
  })
}
