import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetReqBody } from '~/models/requests/tweet.requests'
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
    user_view: result.user_view
  }
  console.log(result)
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}
