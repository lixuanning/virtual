const envUrl = {
  draft: "http://47.122.43.46:7070",
  dev: "http://47.122.43.46:7070",
  test: "http://47.122.43.46:7070",
  uat: "http://47.122.43.46:7070",
  prod: "http://47.122.43.46:7070",
};

const runEnv = process.env.NODE_ENV

export const baseUrl = envUrl[runEnv]