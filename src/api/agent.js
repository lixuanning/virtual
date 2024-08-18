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

// OTC列表
export const queryOtcUserList = (params) => {
  return http.post(`/queryOtcUserList`, {
    ...params,
  });
};

// 修改用户状态
export const updateUserStatus = (params) => {
  return http.post(`/updateUserStatus`, {
    ...params,
  });
};

// 商家列表
export const queryMerchantUserList = (params) => {
  return http.post(`/queryMerchantUserList`, {
    ...params,
  });
};

// 商家列表
export const updateMerchantApiStatus = (params) => {
  return http.post(`/updateMerchantApiStatus`, {
    ...params,
  });
};

// 绑定
export const merchantBindOtc = (params) => {
  return http.post(`/merchantBindOtc`, {
    ...params,
  });
};
