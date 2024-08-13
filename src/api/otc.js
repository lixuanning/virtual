import http from '@/api/http'


// OTC注册
export const registerForOtc = (params) => {
  return http.post(`/registerForOtc`, {
    ...params,
  })
}


// OTC商品列表
export const queryProductList = (params) => {
  return http.post(`/queryProductList`, {
    ...params,
  })
}
// OTC新增商品
export const addProduct = (params) => {
  return http.post(`/addProduct`, {
    ...params,
  })
}

// OTC上架
export const updateProductStatus = (params) => {
  return http.post(`/updateProductStatus`, {
    ...params,
  })
}


