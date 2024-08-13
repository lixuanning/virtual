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

// OTC 入金
export const queryInOrderList = (params) => {
  return http.post(`/queryInOrderList`, {
    ...params,
  });
};
