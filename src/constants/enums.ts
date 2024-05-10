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

export enum EncodingStatus {
  Pending,
  Processing,
  Success,
  Failed
}
