import { ParamsDictionary, Query } from 'express-serve-static-core'
import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '~/models/other'

export interface TweetReqBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface Pagination extends Query {
  limit: string
  page: string
}
export interface TweetQuery extends Pagination, Query {
  tweet_type: string
}
