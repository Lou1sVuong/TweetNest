import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouters = Router()

/**
 * Description: likes
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
searchRouters.get('/', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(searchController))

export default searchRouters
