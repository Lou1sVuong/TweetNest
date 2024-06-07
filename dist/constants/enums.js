"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleFollow = exports.TweetAudience = exports.TweetType = exports.EncodingStatus = exports.MediaTypeQuery = exports.Mediatype = exports.tokenType = exports.userVerificationStatus = void 0;
var userVerificationStatus;
(function (userVerificationStatus) {
    userVerificationStatus[userVerificationStatus["Unverified"] = 0] = "Unverified";
    userVerificationStatus[userVerificationStatus["Verified"] = 1] = "Verified";
    userVerificationStatus[userVerificationStatus["Blocked"] = 2] = "Blocked"; // Global ban =)))
})(userVerificationStatus || (exports.userVerificationStatus = userVerificationStatus = {}));
var tokenType;
(function (tokenType) {
    tokenType[tokenType["AccessToken"] = 0] = "AccessToken";
    tokenType[tokenType["RefreshToken"] = 1] = "RefreshToken";
    tokenType[tokenType["ForgotPasswordToken"] = 2] = "ForgotPasswordToken";
    tokenType[tokenType["EmailVerificationToken"] = 3] = "EmailVerificationToken";
})(tokenType || (exports.tokenType = tokenType = {}));
var Mediatype;
(function (Mediatype) {
    Mediatype[Mediatype["Image"] = 0] = "Image";
    Mediatype[Mediatype["Video"] = 1] = "Video";
    Mediatype[Mediatype["HLS"] = 2] = "HLS";
})(Mediatype || (exports.Mediatype = Mediatype = {}));
var MediaTypeQuery;
(function (MediaTypeQuery) {
    MediaTypeQuery["Image"] = "image";
    MediaTypeQuery["Video"] = "video";
})(MediaTypeQuery || (exports.MediaTypeQuery = MediaTypeQuery = {}));
var EncodingStatus;
(function (EncodingStatus) {
    EncodingStatus[EncodingStatus["Pending"] = 0] = "Pending";
    EncodingStatus[EncodingStatus["Processing"] = 1] = "Processing";
    EncodingStatus[EncodingStatus["Success"] = 2] = "Success";
    EncodingStatus[EncodingStatus["Failed"] = 3] = "Failed";
})(EncodingStatus || (exports.EncodingStatus = EncodingStatus = {}));
var TweetType;
(function (TweetType) {
    TweetType[TweetType["Tweet"] = 0] = "Tweet";
    TweetType[TweetType["Retweet"] = 1] = "Retweet";
    TweetType[TweetType["Comment"] = 2] = "Comment";
    TweetType[TweetType["Quote"] = 3] = "Quote";
})(TweetType || (exports.TweetType = TweetType = {}));
var TweetAudience;
(function (TweetAudience) {
    TweetAudience[TweetAudience["Everyone"] = 0] = "Everyone";
    TweetAudience[TweetAudience["TwitterCircle"] = 1] = "TwitterCircle"; // 1
})(TweetAudience || (exports.TweetAudience = TweetAudience = {}));
var PeopleFollow;
(function (PeopleFollow) {
    PeopleFollow["Everyone"] = "0";
    PeopleFollow["Following"] = "1";
})(PeopleFollow || (exports.PeopleFollow = PeopleFollow = {}));
