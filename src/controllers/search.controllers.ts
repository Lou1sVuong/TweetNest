import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.services'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const content = req.query.content
  const user_id = req.decoded_authorization?.user_id as string
  const result = await searchService.search({
    limit,
    page,
    content,
    user_id
  })
  res.json({
    message: 'searchController',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
