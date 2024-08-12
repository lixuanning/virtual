/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import { baseUrl,  } from "./baseUrl";

// 创建axios实例
const config = {
  BasicUrl: baseUrl,
};

const instance = axios.create({
  baseURL: config.BasicUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json',
    "x-client-ajax": "1",
    "is-new-sma-view": true,
    "Cache-Control": "no-Cache",
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.error(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  // 请求成功
  (res) => {
    return Promise.reject(res.data);
  },
  // 请求失败
  (error) => {
    console.log(error);
    return Promise.reject(response || error);
  }
);

export default instance;
