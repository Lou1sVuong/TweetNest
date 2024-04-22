import express from 'express'
import userRouters from '~/user.routes'
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouters)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
