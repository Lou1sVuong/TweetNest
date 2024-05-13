import { checkSchema } from 'express-validator'
import { has, isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { Mediatype, TweetAudience, TweetType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation.utils'

const tweetTypes = numberEnumToArray(TweetType)
const audienceTypes = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(Mediatype)

export const createTweetValidation = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [audienceTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            // nếu type là retweet, comment hoặc quotetweet thì parent_id là `tweet_id` của tweet cha
            if ([TweetType.Retweet, TweetType.Comment, TweetType.Quote].includes(type) && !ObjectId.isValid(value)) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_VALID_TWEET_ID)
            }
            // nếu type là tweet thì parent_id là null
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }
            return true
          }
        }
      },
      content: {
        isString: {
          errorMessage: TWEETS_MESSAGES.CONTENT_MUST_BE_STRING
        },
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]
            // nếu `type` là comment , quote hoặc tweet và không chứa hashtag hoặc mention thì content phải là string không được rỗng
            if (
              [TweetType.Comment, TweetType.Quote, TweetType.Tweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }
            // nếu type là Retweet thì content phải là string rỗng
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_EMPTY_STRING)
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            //yêu cầu mỗi phần tử trong mảng hashtags phải là string
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            //yêu cầu mỗi phần tử trong mảng mentions phải là user_id
            if (value.some((item: any) => !ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            //yêu cầu mỗi phần tử trong mảng là Media Object
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || [mediaTypes].includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const tweetIdValidation = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.INVALID_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const tweet = await databaseServices.tweets.findOne({
              _id: new ObjectId(value as string)
            })
            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.TWEET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)
