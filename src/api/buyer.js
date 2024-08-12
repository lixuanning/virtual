import http from '@/api/http'


// 商家注册
export const registerForMerchant = (params) => {
  return http.post(`/registerForMerchant`, {
    ...params,
  })
}

