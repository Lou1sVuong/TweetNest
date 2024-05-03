import { ObjectId } from 'mongodb'

interface FollowerType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  create_at?: Date
}

export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  create_at?: Date
  constructor({ _id, user_id, followed_user_id, create_at }: FollowerType) {
    this._id = _id
    this.user_id = user_id
    this.followed_user_id = followed_user_id
    this.create_at = create_at || new Date()
  }
}
