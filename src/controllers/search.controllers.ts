import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.services'
import { SEARCH_MESSAGES } from '~/constants/messages'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const content = req.query.content
  const media_type = req.query.media_type
  const people_follow = req.query.people_follow
  const user_id = req.decoded_authorization?.user_id as string
  const result = await searchService.search({
    limit,
    page,
    content,
    user_id,
    people_follow,
    media_type
  })
  res.json({
    message: SEARCH_MESSAGES.SEARCH_SUCCESSFULLY,
    result: {
      ...result,
      tweets: result.tweets,
      limit,
      page,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
