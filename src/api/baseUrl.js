const envUrl = {
  dev: "http://localhost:8080",
  test: "http://47.122.43.46:7070",
  uat: "http://47.122.43.46:7070",
  prod: "http://47.122.43.46:7070",
};

const runEnv = process.env.VUE_APP_API

export const baseUrl = envUrl[runEnv]