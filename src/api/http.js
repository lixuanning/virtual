/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import { baseUrl } from "./baseUrl";
import store from "@/store/index";

// 创建axios实例
const config = {
  BasicUrl: baseUrl,
};

const instance = axios.create({
  baseURL: config.BasicUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// type： （1:中介 2:otc 3:商家）
const roleMap = {
  agent: 1,
  seller: 2,
  buyer: 3,
};
/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    const role = store.getRole();
    config.type = roleMap[role];
    console.log(config.data, "config.data");
    let env = process.env.NODE_ENV;
    if (env === "development") {
      //开发环境添加api 开启跨域代理
      config.url = `/api${config.url}`;
    }
    console.log(config.url, "config.url");
    if (config.data && config.data.file) {
      if (
        Object.prototype.toString.call(config.data.file) === "[object File]"
      ) {
        //文件类型指定type
        config.headers["Content-Type"] = "multipart/form-data";
      }
    }
    if (store.getToken()) {
      config.token = store.getToken();
    }
    if (config.url.includes("previewPicture")) {
      config["responseType"] = "blob";
    }
    return config;
  },
  (error) => {
    console.log("请求拦截器", "error", error);
    Promise.error(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  // 请求成功
  (res) => {
    if (res.data.code === "0") {
      return res.data;
    } else {
      return Promise.reject(res);
    }
  },
  // 请求失败
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

export default instance;
