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

// 出金手续费
export const updateOutServiceCharge = (params) => {
  return http.post(`/updateOutServiceCharge`, {
    ...params,
  });
};

// 入金手续费
export const updateInServiceCharge = (params) => {
  return http.post(`/updateInServiceCharge`, {
    ...params,
  });
};

// 首页
export const queryMediumDashboard = () => {
  return http.post(`/queryMediumDashboard`);
};

// 新增法币
export const addLegalCurrencyDit = (params) => {
  return http.post(`/addLegalCurrencyDit`, {
    ...params,
  });
};

// 新增币类型
export const addCoinDict = (params) => {
  return http.post(`/addCoinDict`, {
    ...params,
  });
};
// 新增扣B
export const merchantSubtract = (params) => {
  return http.post(`/merchantSubtract`, {
    ...params,
  });
};

// OTC扣B
export const otcSubtract = (params) => {
  return http.post(`/otcSubtract`, {
    ...params,
  });
};

export const merchantRecharge = (params) => {
  return http.post(`/merchantRecharge`, {
    ...params,
  });
};

export const updateSupportLegalCurrency = (params) => {
  return http.post(`/updateSupportLegalCurrency`, {
    ...params,
  });
};

// 获取OTC列表
export const getOtcSelectData = () => {
  return http.post(`/getOtcSelectData`);
};

// 更新广告
export const updateProduct = (params) => {
  return http.post(`/updateProduct`, {
    ...params,
  });
};

// 修改商户名称
export const updateUserName = (params) => {
  return http.post(`/updateUserName`, {
    ...params,
  });
};

export const getULog = (params) => {
  return http.post(`/getULog`, {
    ...params,
  });
};

export const getMerchantDetail = (params) => {
  return http.post(`/getMerchantDetail`, {
    ...params,
  });
};

export const getOtcDetail = (params) => {
  return http.post(`/getOtcDetail`, {
    ...params,
  });
};

// 代理商列表
export const queryProxyMerchantUserList = (params) => {
  return http.post(`/queryProxyMerchantUserList`, {
    ...params,
  });
};

// 导出
export const downloadOutOrderData = (params) => {
  return http.post(`/downloadOutOrderData`, {
    ...params,
  });
};

// 导出
export const downloadInOrderData = (params) => {
  return http.post(`/downloadInOrderData`, {
    ...params,
  });
};

// 查看转账凭证
export const getTransferPicture = (params) => {
  return http.post(`/getTransferPicture`, {
    ...params,
  });
};

// 查看转账凭证
export const unbindOtc = (params) => {
  return http.post(`/unbindOtc`, {
    ...params,
  });
};

// 商户列表
export const getMerchantSelectData = () => {
  return http.post(`/getMerchantSelectData`);
};

// 代理列表
export const getProxySelectData = () => {
  return http.post(`/getProxySelectData`);
};
// 绑定商户
export const otcBindMerchant = (params) => {
  return http.post(`/otcBindMerchant`, {
    ...params,
  });
};


// 修改代理商
export const updateMerchantProxyFlag = (params) => {
  return http.post(`/updateMerchantProxyFlag`, {
    ...params,
  });
};
// 修改OTC匹配
export const updateOtcProductStatus = (params) => {
  return http.post(`/updateOtcProductStatus`, {
    ...params,
  });
};
// 排序
export const updateOtcSort = (params) => {
  return http.post(`/updateOtcSort`, {
    ...params,
  });
};