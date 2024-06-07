"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const hashtag_schemas_1 = __importDefault(require("../models/schemas/hashtag.schemas"));
const tweet_shemas_1 = __importDefault(require("../models/schemas/tweet.shemas"));
const database_services_1 = __importDefault(require("../services/database.services"));
class TweetsService {
    async checkAndCreateHashtags(hashtags) {
        const hashtagDocuments = await Promise.all(hashtags.map((hashtag) => {
            // tìm hashtag trong database , nếu có thì lấy, nếu không thì tạo mới
            return database_services_1.default.hashtags.findOneAndUpdate({ name: hashtag }, {
                $setOnInsert: new hashtag_schemas_1.default({ name: hashtag })
            }, {
                upsert: true,
                returnDocument: 'after'
            });
        }));
        return hashtagDocuments.map((hashtag) => hashtag._id);
    }
    async createTweet(user_id, body) {
        const hashtags = await this.checkAndCreateHashtags(body.hashtags);
        // console.log(hashtags)
        const result = await database_services_1.default.tweets.insertOne(new tweet_shemas_1.default({
            audience: body.audience,
            content: body.content,
            hashtags: hashtags,
            mentions: body.mentions,
            medias: body.medias,
            parent_id: body.parent_id,
            type: body.type,
            user_id: new mongodb_1.ObjectId(user_id)
        }));
        const tweet = await database_services_1.default.tweets.findOne({ _id: result.insertedId });
        return tweet;
    }
    async increaseView(tweet_id, user_id) {
        const inc = user_id ? { user_view: 1 } : { guest_view: 1 };
        const result = await database_services_1.default.tweets.findOneAndUpdate({ _id: new mongodb_1.ObjectId(tweet_id) }, {
            $inc: inc,
            $currentDate: { updated_at: true }
        }, {
            returnDocument: 'after',
            projection: {
                user_view: 1,
                guest_view: 1,
                updated_at: 1
            }
        });
        return result;
    }
    async getTweetChildren({ tweet_id, tweet_type, limit, page, user_id }) {
        const tweets = await database_services_1.default.tweets
            .aggregate([
            {
                $match: {
                    parent_id: new mongodb_1.ObjectId(tweet_id),
                    type: tweet_type
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                }
            },
            {
                $addFields: {
                    mentions: {
                        $map: {
                            input: '$mentions',
                            as: 'mention',
                            in: {
                                _id: '$$mention._id',
                                name: '$$mention.name',
                                username: '$$mention.username',
                                email: '$$mention.email'
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'bookmarks'
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'tweet_children'
                }
            },
            {
                $addFields: {
                    bookmarks: {
                        $size: '$bookmarks'
                    },
                    likes: {
                        $size: '$likes'
                    },
                    retweet_count: {
                        $size: {
                            $filter: {
                                input: '$tweet_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', enums_1.TweetType.Retweet]
                                }
                            }
                        }
                    },
                    comment_count: {
                        $size: {
                            $filter: {
                                input: '$tweet_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', enums_1.TweetType.Comment]
                                }
                            }
                        }
                    },
                    quote_count: {
                        $size: {
                            $filter: {
                                input: '$tweet_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', enums_1.TweetType.Quote]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    tweet_children: 0
                }
            },
            {
                $skip: (page - 1) * limit // công thức phân trang
            },
            {
                $limit: limit
            }
        ])
            .toArray();
        const ids = tweets.map((tweet) => tweet._id);
        const inc = user_id ? { user_view: 1 } : { guest_view: 1 };
        const date = new Date();
        const [, total] = await Promise.all([
            database_services_1.default.tweets.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $inc: inc,
                $set: {
                    updated_at: date
                }
            }),
            database_services_1.default.tweets.countDocuments({
                parent_id: new mongodb_1.ObjectId(tweet_id),
                type: tweet_type
            })
        ]);
        // return tweets for user
        tweets.forEach((tweet) => {
            tweet.updated_at = date;
            if (user_id) {
                tweet.user_view++;
            }
            else {
                tweet.guest_view++;
            }
        });
        return {
            tweets,
            total
        };
    }
    async getNewFeeds({ user_id, limit, page }) {
        const user_id_obj = new mongodb_1.ObjectId(user_id);
        const followed_user_ids = await database_services_1.default.followers
            .find({ user_id: new mongodb_1.ObjectId(user_id) }, { projection: { _id: 0, followed_user_id: 1 } })
            .toArray();
        // chuyển mảng các id user mà user đó đang theo dõi thành mảng các id
        const ids = followed_user_ids.map((item) => item.followed_user_id);
        // mong muốn newfeed sẽ hiển thị luôn tweet của user đó
        ids.push(user_id_obj);
        const [tweets, total] = await Promise.all([
            database_services_1.default.tweets
                .aggregate([
                {
                    $match: {
                        user_id: {
                            $in: ids
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user'
                    }
                },
                {
                    $match: {
                        $or: [
                            {
                                audience: 0
                            },
                            {
                                $and: [
                                    {
                                        audience: 1
                                    },
                                    {
                                        'user.twitter_circle': {
                                            $in: [user_id_obj]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'hashtags',
                        localField: 'hashtags',
                        foreignField: '_id',
                        as: 'hashtags'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'mentions',
                        foreignField: '_id',
                        as: 'mentions'
                    }
                },
                {
                    $addFields: {
                        mentions: {
                            $map: {
                                input: '$mentions',
                                as: 'mention',
                                in: {
                                    _id: '$$mention._id',
                                    name: '$$mention.name',
                                    username: '$$mention.username',
                                    email: '$$mention.email'
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'bookmarks',
                        localField: '_id',
                        foreignField: 'tweet_id',
                        as: 'bookmarks'
                    }
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'tweet_id',
                        as: 'likes'
                    }
                },
                {
                    $lookup: {
                        from: 'tweets',
                        localField: '_id',
                        foreignField: 'parent_id',
                        as: 'tweet_children'
                    }
                },
                {
                    $addFields: {
                        bookmarks: {
                            $size: '$bookmarks'
                        },
                        likes: {
                            $size: '$likes'
                        },
                        retweet_count: {
                            $size: {
                                $filter: {
                                    input: '$tweet_children',
                                    as: 'item',
                                    cond: {
                                        $eq: ['$$item.type', enums_1.TweetType.Retweet]
                                    }
                                }
                            }
                        },
                        comment_count: {
                            $size: {
                                $filter: {
                                    input: '$tweet_children',
                                    as: 'item',
                                    cond: {
                                        $eq: ['$$item.type', enums_1.TweetType.Comment]
                                    }
                                }
                            }
                        },
                        quote_count: {
                            $size: {
                                $filter: {
                                    input: '$tweet_children',
                                    as: 'item',
                                    cond: {
                                        $eq: ['$$item.type', enums_1.TweetType.Quote]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        tweet_children: 0,
                        user: {
                            password: 0,
                            email_verification_token: 0,
                            forgot_password_token: 0,
                            twitter_circle: 0,
                            date_of_birth: 0
                        }
                    }
                }
            ])
                .toArray(),
            database_services_1.default.tweets
                .aggregate([
                {
                    $match: {
                        user_id: {
                            $in: ids
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user'
                    }
                },
                {
                    $match: {
                        $or: [
                            {
                                audience: 0
                            },
                            {
                                $and: [
                                    {
                                        audience: 1
                                    },
                                    {
                                        'user.twitter_circle': {
                                            $in: [user_id_obj]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    $count: 'total'
                }
            ])
                .toArray()
        ]);
        const tweet_ids = tweets.map((tweet) => tweet._id);
        const date = new Date();
        await database_services_1.default.tweets.updateMany({
            _id: {
                $in: tweet_ids
            }
        }, {
            $inc: { user_view: 1 },
            $set: {
                updated_at: date
            }
        });
        // return tweets for user
        tweets.forEach((tweet) => {
            tweet.updated_at = date;
            tweet.user_view++;
        });
        return {
            tweets,
            total: total[0].total
        };
    }
}
const tweetsService = new TweetsService();
exports.default = tweetsService;
