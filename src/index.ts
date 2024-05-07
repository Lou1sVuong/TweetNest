import { config } from 'dotenv'
import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRouters from '~/routes/medias.routes'
import usersRouters from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
import { initFolder } from '~/utils/file'
config()

// Connect to database
databaseServices.connect()
const app = express()
const port = process.env.PORT || 4000
// init folder uploads
initFolder()
// Middlewares for parsing body
app.use(express.json())
// Routes for users
app.use('/users', usersRouters)
// Routes for medias
app.use('/medias', mediasRouters)
// Error handler
app.use(defaultErrorHandler)
// Health check
app.use('/health', (req, res) => {
  res.send(`dope shit man, i'm still alive`)
})
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
