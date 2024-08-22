import http from "@/api/http";

// OTC注册
export const registerForOtc = (params) => {
  return http.post(`/registerForOtc`, {
    ...params,
  });
};

// OTC商品列表
export const queryProductList = (params) => {
  return http.post(`/queryProductList`, {
    ...params,
  });
};
// OTC新增商品
export const addProduct = (params) => {
  return http.post(`/addProduct`, {
    ...params,
  });
};

// OTC上架
export const updateProductStatus = (params) => {
  return http.post(`/updateProductStatus`, {
    ...params,
  });
};

// OTC 出金
export const queryOutOrderList = (params) => {
  return http.post(`/queryOutOrderList`, {
    ...params,
  });
};

// OTC 出金状态修改
export const updateOutOrderStatus = (params) => {
  return http.post(`/updateOutOrderStatus`, {
    ...params,
  });
};
// OTC 入金
export const queryInOrderList = (params) => {
  return http.post(`/queryInOrderList`, {
    ...params,
  });
};
// OTC 入金修改状态
export const updateInOrderStatus = (params) => {
  return http.post(`/updateInOrderStatus`, {
    ...params,
  });
};

// OTC 配置列表
export const getPaymentConfigForOtc = () => {
  return http.post(`/getPaymentConfigForOtc`);
};

// OTC 配置新增
export const addPaymentConfig = (params) => {
  return http.post(`/addPaymentConfig`, { ...params });
};

// OTC 配置删除
export const delPaymentConfig = (params) => {
  return http.post(`/delPaymentConfig`, { ...params });
};
// OTC 配置修改状态
export const updatePaymentConfigStatus = (params) => {
  return http.post(`/updatePaymentConfigStatus`, { ...params });
};

// 法币
export const getLegalCurrencyDict = () => {
  return http.post(`/getLegalCurrencyDict`);
};
// 币种
export const getCoinDict = () => {
  return http.post(`/getCoinDict`);
};

// OTC首页
export const queryOtcDashboard = () => {
  return http.post(`/queryOtcDashboard`);
};
