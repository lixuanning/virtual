/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import { baseUrl } from "./baseUrl";
import store from "@/store/index";
import router from "@/router/index";
import { ElMessage } from "element-plus";

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

const roleToPath = () => {
  const role = store.getRole();
  if (role === "agent") {
    router.push("/agent-login");
  } else if (role === "buyer") {
    router.push("/buyer-login");
  } else if (role === "seller") {
    router.push("/seller-login");
  }
};
/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    const role = store.getRole();
    config.headers["type"] = roleMap[role];
    let env = process.env.NODE_ENV;
    // if (env === "development") {
    //   //开发环境添加api 开启跨域代理
    //   config.url = `/api${config.url}`;
    // }
    config.url = `/api${config.url}`;
    if (config.data && config.data.file) {
      if (
        Object.prototype.toString.call(config.data.file) === "[object File]"
      ) {
        //文件类型指定type
        config.headers["Content-Type"] = "multipart/form-data";
      }
    }
    if (store.getToken()) {
      config.headers["token"] = store.getToken();
    }
    // if (config.url.includes("previewPicture")) {
    //   config["responseType"] = "blob";
    // }
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
    } else if (["70001", "70002", "70003"].includes(res.data.code)) {
      console.log(res.data, "999");

      if (res.data.msg) {
        ElMessage.error(res.data.msg);
      }
      roleToPath();
      return Promise.reject(res.data);
    } else {
      if (res.data.msg) {
        ElMessage.error(res.data.msg);
      }
      return Promise.reject(res.data);
    }
  },
  // 请求失败
  (error) => {
    console.log("erro11r", error);
    return Promise.reject(error);
  }
);

export default instance;
