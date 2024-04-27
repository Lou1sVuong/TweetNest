import express, { Request, Response, NextFunction } from 'express'
import usersRouters from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
const app = express()
const port = 8000

app.use(express.json())

app.use('/users', usersRouters)
// Connect to database
databaseServices.connect()
// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('error :', err.message)
  res.status(404).json({ error: err.message })
})
// Health check
app.use('/health', (req, res) => {
  res.send(`Server is running at port :${port}`)
})
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
