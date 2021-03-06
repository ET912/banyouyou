import { http } from '../utils/http'

export function getBanners() {
  return http._request('/banner/list')
    .then(res => res.data)
}
// 获取热门商品列表
export function getHotGoods() {
  return http._request('/category/hot/list')
    .then(res => res.data)
}

// 获取最新商品列表
export function getNewGoods() {
  return http._request('/new/list')
    .then(res => res.data)
}

// 搜索商品
export function searchGoods(data) {
  return http._request('/info/list/like', {data})
    .then(res => res.data)
}
// 公告
export function getAdvertising(data) {
  return http._request('/advertising', {data})
    .then(res => res.data)
}