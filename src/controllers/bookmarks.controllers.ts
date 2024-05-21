import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARKS_MESSGAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/bookmark.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import bookmarkService from '~/services/bookmarks.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.body.tweet_id
  const result = await bookmarkService.bookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSGAGES.BOOKMARK_TWEET_SUCCESSFULLY,
    result
  })
}

export const unBookmarkTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.params.tweet_id
  await bookmarkService.unBookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSGAGES.UNBOOKMARK_TWEET_SUCCESSFULLY
  })
}
