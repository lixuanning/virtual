import http from "@/api/http";

// 商家注册
export const registerForMerchant = (params) => {
  return http.post(`/registerForMerchant`, {
    ...params,
  });
};

export const createOutOrder = (params) => {
  return http.post(`/createOutOrder`, {
    ...params,
  });
};
// 查询用户信息
export const getUserInfoForMerchant = () => {
  return http.post(`/getUserInfoForMerchant`);
};
// 钱包类型字典
export const getWalletTypeDict = () => {
  return http.post(`/getWalletTypeDict`);
};

// 法币
export const getLegalCurrencyDict = () => {
  return http.post(`/getLegalCurrencyDict`);
};
// 币种
export const getCoinDict = () => {
  return http.post(`/getCoinDict`);
};

// 提币管理-列表
export const queryWithdrawalList = (params) => {
  return http.post(`/queryWithdrawalList`, { ...params });
};

// 提币管理-新增
export const createWithdrawalOrder = (params) => {
  return http.post(`/createWithdrawalOrder`, { ...params });
};

// 商家-收款设置-列表
export const getPaymentConfigForMerchant = (params) => {
  return http.post(`/getPaymentConfigForMerchant`, {
    ...params,
  });
};

//查询状态
export const queryInOrderDetail = (params) => {
  return http.post(`/queryInOrderDetail`, {
    ...params,
  });
};
//确认转账
export const merchantConfirmInOrder = (params) => {
  return http.post(`/merchantConfirmInOrder`, {
    ...params,
  });
};

export const updateMerchantInfo = (params) => {
  return http.post(`/updateMerchantInfo`, {
    ...params,
  });
};
// 首页查询
export const queryMerchantDashboard = () => {
  return http.post(`/queryMerchantDashboard`);
};

//设置API
export const updateApiInfo = (params) => {
  return http.post(`/updateApiInfo`, {
    ...params,
  });
};

//设置API
export const queryProxyInOrderList = (params) => {
  return http.post(`/queryProxyInOrderList`, {
    ...params,
  });
};
