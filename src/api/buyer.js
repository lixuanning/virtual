import http from "@/api/http";

// 商家注册
export const registerForMerchant = (params) => {
  return http.post(`/registerForMerchant`, {
    ...params,
  });
};

// 商家注册
export const getPaymentConfigForMerchant = (params) => {
  return http.post(`/getPaymentConfigForMerchant`, {
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
