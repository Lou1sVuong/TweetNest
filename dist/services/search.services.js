"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const database_services_1 = __importDefault(require("../services/database.services"));
class SearchService {
    async search({ limit, page, content, user_id, media_type, people_follow }) {
        const $match = {
            $text: {
                $search: content
            }
        };
        if (media_type) {
            if (media_type === enums_1.MediaTypeQuery.Image) {
                $match['medias.type'] = enums_1.Mediatype.Image;
            }
            else if (media_type === enums_1.MediaTypeQuery.Video) {
                $match['medias.type'] = { $in: [enums_1.Mediatype.Video, enums_1.Mediatype.HLS] };
            }
        }
        if (people_follow && people_follow === enums_1.PeopleFollow.Following) {
            const user_id_obj = new mongodb_1.ObjectId(user_id);
            const followed_user_ids = await database_services_1.default.followers
                .find({ user_id: new mongodb_1.ObjectId(user_id) }, { projection: { _id: 0, followed_user_id: 1 } })
                .toArray();
            // chuyển mảng các id user mà user đó đang theo dõi thành mảng các id
            const ids = followed_user_ids.map((item) => item.followed_user_id);
            // mong muốn newfeed sẽ hiển thị luôn tweet của user đó
            ids.push(user_id_obj);
            $match['user_id'] = { $in: ids };
        }
        const [tweets, total] = await Promise.all([
            database_services_1.default.tweets
                .aggregate([
                {
                    $match
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
                                            $in: [new mongodb_1.ObjectId(user_id)]
                                        }
                                    }
                                ]
                            }
                        ]
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
                        tweet_children: 0,
                        user: {
                            password: 0,
                            email_verification_token: 0,
                            forgot_password_token: 0,
                            twitter_circle: 0,
                            date_of_birth: 0
                        }
                    }
                },
                {
                    $skip: limit * (page - 1)
                },
                {
                    $limit: limit
                }
            ])
                .toArray(),
            database_services_1.default.tweets
                .aggregate([
                {
                    $match
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
                                            $in: [new mongodb_1.ObjectId(user_id)]
                                        }
                                    }
                                ]
                            }
                        ]
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
                        tweet_children: 0,
                        user: {
                            password: 0,
                            email_verification_token: 0,
                            forgot_password_token: 0,
                            twitter_circle: 0,
                            date_of_birth: 0
                        }
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
        if (total.length === 0) {
            return {
                messages: `No result found with content: ${content}`,
                tweets,
                total: 0
            };
        }
        return {
            tweets,
            total: total[0].total
        };
    }
}
const searchService = new SearchService();
exports.default = searchService;
