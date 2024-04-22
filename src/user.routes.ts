import {Router} from 'express'
const userRouters = Router()

userRouters.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' })
})

export default userRouters
