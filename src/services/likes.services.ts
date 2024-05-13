import { ObjectId } from 'mongodb'
import Like from '~/models/schemas/like.schemas'
import databaseServices from '~/services/database.services'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseServices.likes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
  async unlikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseServices.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
