import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import { createI18n } from 'vue-i18n';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import en from './language/en'
import zh from './language/zh'

const messages = {
  en,
  zh,
};

const i18n = createI18n({
  legacy: false, // 设置为 false，启用 composition API 模式
  locale: 'zh', // 设置默认语言
  messages,
  globalInjection: true, // 全局注入
});
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(i18n);
app.use(router);
app.use(ElementPlus);
app.mount("#app");


export { i18n, app }; // 导出 i18n 和 app 实例以供其他地方使用