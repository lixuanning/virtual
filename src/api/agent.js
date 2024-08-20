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

// 设置费率
export const setProxyRate = (params) => {
  return http.post(`/setProxyRate`, {
    ...params,
  });
};

// 充值
export const otcRecharge = (params) => {
  return http.post(`/otcRecharge`, {
    ...params,
  });
};

// 利率列表
export const queryPriceRateConfigData = (params) => {
  return http.post(`/queryPriceRateConfigData`, {
    ...params,
  });
};

// 新增
export const addPriceRateConfig = (params) => {
  return http.post(`/addPriceRateConfig`, {
    ...params,
  });
};

// 编辑
export const updatePriceRateConfig = (params) => {
  return http.post(`/updatePriceRateConfig`, {
    ...params,
  });
};

// 编辑入金订单
export const updateInOrder = (params) => {
  return http.post(`/updateInOrder`, {
    ...params,
  });
};

// 编辑出金订单
export const updateOutOrder = (params) => {
  return http.post(`/updateOutOrder`, {
    ...params,
  });
};

// 编辑提币订单
export const updateWithdrawalOrder = (params) => {
  return http.post(`/updateWithdrawalOrder`, {
    ...params,
  });
};
