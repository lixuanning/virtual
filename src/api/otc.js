import http from '@/api/http'


// OTC注册
export const registerForOtc = (params) => {
  return http.post(`/registerForOtc`, {
    ...params,
  })
}

