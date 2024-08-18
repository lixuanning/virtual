import http from "@/api/http";

// 商家注册
export const updateOutOrderStatus = (params) => {
  return http.post(`/updateOutOrderStatus`, {
    ...params,
  });
};

export const updateInOrderStatus = (params) => {
  return http.post(`/updateInOrderStatus`, {
    ...params,
  });
};
//分配OTC
export const shareOutOrderToOtc = (params) => {
  return http.post(`/shareOutOrderToOtc`, {
    ...params,
  });
};
// 提币管理-列表
export const queryWithdrawalList = (params) => {
  return http.post(`/queryWithdrawalList`, {
    ...params,
  });
};
// 提币管理-修改状态
export const updateWithdrawalOrderStatus = (params) => {
  return http.post(`/updateWithdrawalOrderStatus`, {
    ...params,
  });
};
