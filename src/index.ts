import express from 'express'
import usersRouters from '~/routes/users.routes'
import databaseServices from '~/services/database.services'
const app = express()
const port = 8000

app.use(express.json())
app.use('/users', usersRouters)
databaseServices.connect()
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
