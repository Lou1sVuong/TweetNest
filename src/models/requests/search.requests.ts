import { Pagination } from '~/models/requests/tweet.requests'

export interface SearchQuery extends Pagination {
  content: string
}
