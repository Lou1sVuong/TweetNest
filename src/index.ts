import { config } from 'dotenv'
import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRouters from '~/routes/medias.routes'
import staticRouters from '~/routes/static.routes'
import usersRouters from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
import { initFolder } from '~/utils/file'
import cors from 'cors'
import tweetsRouter from '~/routes/tweets.routes'
import bookmarksRouters from '~/routes/bookmarks.routes'
import likesRouters from '~/routes/likes.routes'
import searchRouters from '~/routes/search.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import { envConfig } from './constants/config'
const file = fs.readFileSync(path.resolve('TweetNest-Swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

// create fake users data ( uncomment this line bellow to create fake data)
// import '~/utils/fakeData'

// Connect to database
databaseServices.connect().then(() => {
  databaseServices.indexUsers()
  databaseServices.indexRefreshTokens()
  databaseServices.indexFollowers()
  databaseServices.indexVideoStatus()
  databaseServices.indexTweets()
})
const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = process.env.PORT || envConfig.port
// init folder uploads
initFolder()
// Middlewares for parsing body
app.use(express.json())
// Routes for swagger api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Routes for users
app.use('/users', usersRouters)
// Routes for medias
app.use('/medias', mediasRouters)
// Routes for tweets
app.use('/tweets', tweetsRouter)
// Routes for bookmarks
app.use('/bookmarks', bookmarksRouters)
// Routes for likes
app.use('/likes', likesRouters)
// Routes for search
app.use('/search', searchRouters)
// Routes for static
app.use('/static', staticRouters)
// Error handler
app.use(defaultErrorHandler)
// Health check
app.use('/health', (req, res) => {
  res.send(`dope shit man, i'm still alive`)
})

const io = new Server(httpServer, {
  /* options */
})

io.on('connection', (socket) => {
  console.log(socket)
})

if (require.main === module) {
  httpServer.listen(port, () => {
    console.log(`Server is running at port :${port}`)
  })
}

export { app, httpServer }
