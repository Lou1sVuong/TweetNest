import { ObjectId, WithId } from 'mongodb'
import { TweetReqBody } from '~/models/requests/tweet.requests'
import HashTag from '~/models/schemas/hashtag.schemas'
import Tweet from '~/models/schemas/tweet.shemas'
import databaseServices from '~/services/database.services'

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // tìm hashtag trong database , nếu có thì lấy, nếu không thì tạo mới
        return databaseServices.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new HashTag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtag) => (hashtag as WithId<HashTag>)._id)
  }
  async createTweet(user_id: string, body: TweetReqBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    // console.log(hashtags)
    const result = await databaseServices.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseServices.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_view: 1 } : { guest_view: 1 }
    const result = await databaseServices.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          user_view: 1,
          guest_view: 1
        }
      }
    )
    return result as WithId<{
      user_view: number
      guest_view: number
    }>
  }
}

const tweetsService = new TweetsService()
export default tweetsService
