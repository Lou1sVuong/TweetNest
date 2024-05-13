import { Router } from 'express'
import { bookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controlers'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouters = Router()

/**
 * Description: bookmark
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
bookmarksRouters.post('/', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(bookmarkTweetController))

/**
 * Description: unBookmark
 * Path: /tweets/:tweet_id
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
bookmarksRouters.delete(
  '/tweets/:tweet_id',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(unBookmarkTweetController)
)

export default bookmarksRouters
