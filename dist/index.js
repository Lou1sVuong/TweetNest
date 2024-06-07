"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middlewares_1 = require("./middlewares/error.middlewares");
const medias_routes_1 = __importDefault(require("./routes/medias.routes"));
const static_routes_1 = __importDefault(require("./routes/static.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const database_services_1 = __importDefault(require("./services/database.services"));
const file_1 = require("./utils/file");
const cors_1 = __importDefault(require("cors"));
const tweets_routes_1 = __importDefault(require("./routes/tweets.routes"));
const bookmarks_routes_1 = __importDefault(require("./routes/bookmarks.routes"));
const likes_routes_1 = __importDefault(require("./routes/likes.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./constants/config");
const file = fs_1.default.readFileSync(path_1.default.resolve('TweetNest-Swagger.yaml'), 'utf8');
const swaggerDocument = yaml_1.default.parse(file);
// create fake users data ( uncomment this line bellow to create fake data)
// import './utils/fakeData'
// Connect to database
database_services_1.default.connect().then(() => {
    database_services_1.default.indexUsers();
    database_services_1.default.indexRefreshTokens();
    database_services_1.default.indexFollowers();
    database_services_1.default.indexVideoStatus();
    database_services_1.default.indexTweets();
});
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
const port = config_1.envConfig.port;
// init folder uploads
(0, file_1.initFolder)();
// Middlewares for parsing body
app.use(express_1.default.json());
// Routes for swagger api-docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Routes for users
app.use('/users', users_routes_1.default);
// Routes for medias
app.use('/medias', medias_routes_1.default);
// Routes for tweets
app.use('/tweets', tweets_routes_1.default);
// Routes for bookmarks
app.use('/bookmarks', bookmarks_routes_1.default);
// Routes for likes
app.use('/likes', likes_routes_1.default);
// Routes for search
app.use('/search', search_routes_1.default);
// Routes for static
app.use('/static', static_routes_1.default);
// Error handler
app.use(error_middlewares_1.defaultErrorHandler);
// Health check
app.use('/health', (req, res) => {
    res.send(`dope shit man, i'm still alive`);
});
const io = new socket_io_1.Server(httpServer, {
/* options */
});
io.on('connection', (socket) => {
    console.log(socket);
});
httpServer.listen(port, () => {
    console.log(`Server is running at port :${port}`);
});
