import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '~/models/orther'

interface TweetContructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId // null if it's a root tweet
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_view: number
  user_view: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId // null if it's a root tweet
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_view: number
  user_view: number
  created_at: Date
  updated_at: Date
  constructor({
    audience,
    content,
    guest_view,
    hashtags,
    medias,
    mentions,
    parent_id,
    type,
    user_id,
    user_view,
    created_at,
    updated_at
  }: TweetContructor) {
    const data = new Date()
    this._id = new ObjectId()
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    this.parent_id = parent_id
    this.hashtags = hashtags
    this.mentions = mentions
    this.medias = medias
    this.guest_view = guest_view
    this.user_view = user_view
    this.created_at = created_at || data
    this.updated_at = updated_at || data
  }
}
