"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMultipleTweets = void 0;
const faker_1 = require("@faker-js/faker");
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const follower_schemas_1 = __importDefault(require("../models/schemas/follower.schemas"));
const user_schemas_1 = __importDefault(require("../models/schemas/user.schemas"));
const database_services_1 = __importDefault(require("../services/database.services"));
const tweets_services_1 = __importDefault(require("../services/tweets.services"));
const crypto_1 = require("../utils/crypto");
// mật khẩu cho các fake user
const PASSWORD = 'Vuong123!';
// id của mình , dùng để follow người khác
const MYID = new mongodb_1.ObjectId('6659f5ca13f0475af1d10a9a');
// số lượng user được tạo, mỗi user sẽ mặc định 2 tweet
const USER_COUNT = 50;
const createRandomUser = () => {
    const user = {
        name: faker_1.faker.internet.displayName(),
        email: faker_1.faker.internet.email(),
        password: PASSWORD,
        confirm_password: PASSWORD,
        date_of_birth: faker_1.faker.date.past().toISOString()
    };
    return user;
};
const createRandomTweet = () => {
    const tweet = {
        type: enums_1.TweetType.Tweet,
        audience: enums_1.TweetAudience.Everyone,
        content: 
        // 'vuong ' +
        faker_1.faker.lorem.paragraph({
            min: 10,
            max: 160
        }),
        hashtags: ['VuongIT'],
        medias: [
            {
                type: 2,
                url: 'https://picsum.photos/200/300'
            }
        ],
        mentions: ['6659f5ca13f0475af1d10a9a'],
        parent_id: null
    };
    return tweet;
};
const users = faker_1.faker.helpers.multiple(createRandomUser, {
    count: USER_COUNT
});
const insertMultipleUsers = async (users) => {
    console.log('Creating users...');
    const result = await Promise.all(users.map(async (user) => {
        const user_id = new mongodb_1.ObjectId();
        await database_services_1.default.users.insertOne(new user_schemas_1.default({
            ...user,
            _id: user_id,
            username: `user${user_id.toString()}`,
            password: (0, crypto_1.hashPassword)(user.password),
            date_of_birth: new Date(user.date_of_birth),
            verify: enums_1.userVerificationStatus.Verified
        }));
        return user_id;
    }));
    console.log(`Created ${result.length} users`);
    return result;
};
const followMultipleUsers = async (user_id, followed_user_ids) => {
    console.log('Start following users...');
    const result = await Promise.all(followed_user_ids.map((followed_user_id) => database_services_1.default.followers.insertOne(new follower_schemas_1.default({
        user_id,
        followed_user_id: new mongodb_1.ObjectId(followed_user_id)
    }))));
    console.log(`Followed ${result.length} users`);
};
const followMe = async (user_id, followed_user_ids) => {
    console.log('Start following users...');
    const result = await Promise.all(followed_user_ids.map((followed_user_id) => database_services_1.default.followers.insertOne(new follower_schemas_1.default({
        user_id: new mongodb_1.ObjectId(followed_user_id),
        followed_user_id: user_id
    }))));
};
const insertMultipleTweets = async (ids) => {
    console.log('Creating tweets...');
    console.log('Counting ...');
    let count = 0;
    const result = await Promise.all(ids.map(async (id, index) => {
        await Promise.all([
            tweets_services_1.default.createTweet(id.toString(), createRandomTweet()),
            tweets_services_1.default.createTweet(id.toString(), createRandomTweet())
        ]);
        count += 2;
        console.log(`Created ${count} tweets`);
    }));
    return result;
};
exports.insertMultipleTweets = insertMultipleTweets;
insertMultipleUsers(users).then((ids) => {
    followMultipleUsers(new mongodb_1.ObjectId(MYID), ids);
    (0, exports.insertMultipleTweets)(ids);
    followMe(new mongodb_1.ObjectId(MYID), ids);
});
