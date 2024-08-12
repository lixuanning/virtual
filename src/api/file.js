import http from '@/api/http'


// 图片上传
export const uploadPicture = (params) => {
  return http.post(`/upload/picture`, {
    ...params,
  })
}


export const previewPicture = (params) => {
    return http.post(`/previewPicture`, {
      ...params,
    })
  }
  