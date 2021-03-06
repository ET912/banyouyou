import { http } from '../utils/http'

export function getCategoryList(data) {
  return http._request('/category/list', {data})
  .then(res => res.data)
}

export function getCategoryGoodList(data) {
  return http._request('/category/info/list', { data })
    .then(res => res.data)
}