import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetParam, TweetQuery, TweetReqBody } from '~/models/requests/tweet.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const tweet = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, tweet)
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  const tweet_id = req.params.tweet_id
  const user_id = req.decoded_authorization?.user_id
  const result = await tweetsService.increaseView(tweet_id, user_id)
  const tweet = {
    ...req.tweet,
    guest_view: result.guest_view,
    user_view: result.user_view,
    updated_at: result.updated_at
  }
  console.log(result)
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_id = req.params.tweet_id
  const tweet_type = Number(req.query.tweet_type as string) as TweetType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.decoded_authorization?.user_id
  const { tweets, total } = await tweetsService.getTweetChildren({
    tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_pages: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, TweetQuery>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await tweetsService.getNewFeeds({ user_id, limit, page })
  return res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEEDS_SUCCESSFULLY,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
