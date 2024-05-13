import { ObjectId } from 'mongodb'
import { TweetReqBody } from '~/models/requests/tweet.requests'
import Tweet from '~/models/schemas/tweet.shemas'
import databaseServices from '~/services/database.services'

class TweetsService {
  async createTweet(user_id: string, body: TweetReqBody) {
    const result = await databaseServices.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], // chổ này chưa làm
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
}

const tweetsService = new TweetsService()
export default tweetsService
