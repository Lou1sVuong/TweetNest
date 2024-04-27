import express, { Request, Response, NextFunction } from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouters from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
const app = express()
const port = 8000
// Connect to database
databaseServices.connect()
// Middlewares for parsing body
app.use(express.json())
// Routes for users
app.use('/users', usersRouters)
// Error handler
app.use(defaultErrorHandler)
// Health check
app.use('/health', (req, res) => {
  res.send(`Server is running at port :${port}`)
})
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
