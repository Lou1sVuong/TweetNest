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
