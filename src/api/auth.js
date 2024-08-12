import http from '@/api/http'


// 图片上传
export const login = (params) => {
  return http.post(`/login`, {
    ...params,
  })
}

