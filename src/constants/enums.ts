export enum userVerificationStatus {
  Unverified, // default is 0
  Verified, // Verified
  Blocked // Global ban =)))
}

export enum tokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export enum Mediatype {
  Image,
  Video,
  HLS
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum EncodingStatus {
  Pending,
  Processing,
  Success,
  Failed
}

export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  Quote
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}

export enum PeopleFollow {
  Everyone = '0',
  Following = '1'
}
