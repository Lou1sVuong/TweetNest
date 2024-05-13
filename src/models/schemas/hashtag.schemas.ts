import { ObjectId } from 'mongodb'

interface HashTagType {
  _id?: ObjectId
  name: string
  created_at?: Date
}

export default class HashTag {
  _id?: ObjectId
  name: string
  created_at: Date
  constructor({ _id, name, created_at }: HashTagType) {
    this._id = _id || new ObjectId()
    this.name = name
    this.created_at = created_at || new Date()
  }
}
