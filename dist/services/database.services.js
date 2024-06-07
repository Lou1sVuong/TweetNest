"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("../constants/config");
const uri = `mongodb+srv://${config_1.envConfig.dbUsername}:${config_1.envConfig.dbPassword}@twitter.sh2nts1.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseServices {
    client;
    db;
    constructor() {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = this.client.db(config_1.envConfig.dbName);
    }
    async connect() {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await this.client.connect();
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        }
        catch (error) {
            console.log('Error connecting to the database', error);
            throw error;
        }
    }
    async indexUsers() {
        const exist = await this.users.indexExists(['email_1_password_1', 'email_1']);
        if (!exist) {
            this.users.createIndex({ email: 1, password: 1 });
            this.users.createIndex({ email: 1 }, { unique: true });
        }
    }
    async indexRefreshTokens() {
        const exist = await this.refreshTokens.indexExists(['userId_1', 'exp_1']);
        if (!exist) {
            this.refreshTokens.createIndex({ userId: 1 });
            this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 });
        }
    }
    async indexFollowers() {
        const exist = await this.followers.indexExists(['followerId_1_followingId_1']);
        if (!exist) {
            this.followers.createIndex({ followerId: 1, followingId: 1 });
        }
    }
    async indexVideoStatus() {
        const exist = await this.videoStatus.indexExists(['name_1']);
        if (!exist) {
            this.videoStatus.createIndex({ name: 1 }, { unique: true });
        }
    }
    async indexTweets() {
        const exist = await this.tweets.indexExists(['content_text']);
        if (!exist) {
            this.tweets.createIndex({ content: 'text' }, { default_language: 'none' });
        }
    }
    get users() {
        return this.db.collection(config_1.envConfig.dbUsersCollection);
    }
    get refreshTokens() {
        return this.db.collection(config_1.envConfig.dbRefreshTokensCollection);
    }
    get followers() {
        return this.db.collection(config_1.envConfig.dbFollowersCollection);
    }
    get videoStatus() {
        return this.db.collection(config_1.envConfig.dbVideoStatusCollection);
    }
    get tweets() {
        return this.db.collection(config_1.envConfig.dbTweetsCollection);
    }
    get hashtags() {
        return this.db.collection(config_1.envConfig.dbHashtagsCollection);
    }
    get bookmarks() {
        return this.db.collection(config_1.envConfig.dbBookmarksCollection);
    }
    get likes() {
        return this.db.collection(config_1.envConfig.dbLikesCollection);
    }
}
// tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices();
exports.default = databaseServices;
