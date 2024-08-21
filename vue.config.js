const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  filenameHashing: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://47.122.43.46:7070", // 目标服务器地址
        changeOrigin: true, // 是否改变源
        pathRewrite: { "^/api": "" }, // 重写路径，删除前缀
        secure: false, // 如果是https接口，需要配置这个参数
        logLevel: "debug", // 输出详细的代理日志
      },
    },
  },
});
