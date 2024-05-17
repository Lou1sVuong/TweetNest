import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType, userVerificationStatus } from '~/constants/enums'
import { TweetReqBody } from '~/models/requests/tweet.requests'
import { RegisterReqBody } from '~/models/requests/user.requests'
import Follower from '~/models/schemas/follower.schemas'
import User from '~/models/schemas/user.schemas'
import databaseServices from '~/services/database.services'
import tweetsService from '~/services/tweets.services'
import { hashPassword } from '~/utils/crypto'
// mật khẩu cho các fake user
const PASSWORD = 'Vuong123!'
// id của mình , dùng để follow người khác
const MYID = new ObjectId('6646cc14409bcc03d0a2a526')
// số lượng user được tạo, mỗi user sẽ mặc định 2 tweet
const USER_COUNT = 100

const createRandomUser = () => {
  const user: RegisterReqBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: TweetReqBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: [],
    medias: [],
    mentions: [],
    parent_id: null
  }
  return tweet
}

const users: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegisterReqBody[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseServices.users.insertOne(
        new User({
          ...user,
          _id: user_id,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: userVerificationStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following users...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseServices.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
    )
  )
  console.log(`Followed ${result.length} users`)
}

export const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  console.log('Counting ...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        tweetsService.createTweet(id.toString(), createRandomTweet()),
        tweetsService.createTweet(id.toString(), createRandomTweet())
      ])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
  return result
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MYID), ids)
  insertMultipleTweets(ids)
})
