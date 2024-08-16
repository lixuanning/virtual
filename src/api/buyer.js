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
