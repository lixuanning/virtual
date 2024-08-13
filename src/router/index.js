import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index";
import Layout from "../views/layout/index.vue";
import AgentLogin from "../views/agent/agentLogin/index.vue";
import BuyerLogin from "../views/buyer/buyerLogin/index.vue";
import SellerLogin from "../views/seller/sellerLogin/index.vue";

import agent from "./agent";
import buyer from "./buyer";
import seller from "./seller";

const routes = [
  { path: "/", redirect: "/agent-login" },
  {
    path: "/agent-login",
    component: AgentLogin,
    meta: { whiteList: true },
  },
  {
    path: "/buyer-login",
    component: BuyerLogin,
    meta: { whiteList: true },
  },
  {
    path: "/seller-login",
    component: SellerLogin,
    meta: { whiteList: true },
  },
  {
    path: "/agent",
    component: Layout,
    meta: { role: "agent" },
    children: [...agent],
  },
  {
    path: "/buyer",
    component: Layout,
    meta: { role: "buyer" },
    children: [...buyer],
  },
  {
    path: "/seller",
    component: Layout,
    meta: { role: "seller" },
    children: [...seller],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const role = store.getRole();
  if (to.meta.whiteList) {
    // 如果页面不需要身份验证，直接放行
    next();
  } else if (!role) {
    console.log("没有登录", to.path);
    // 没有登录，根据要访问的路径跳转到相应的登录页面
    if (to.path.startsWith("/agent")) {
      next("/agent-login");
    } else if (to.path.startsWith("/buyer")) {
      next("/buyer-login");
    } else if (to.path.startsWith("/seller")) {
      next("/seller-login");
    } else {
      next("/");
    }
  } else {
    if (
      to.matched.some((record) => record.meta.role && record.meta.role !== role)
    ) {
      // 已登录，但访问的路径不属于该角色，跳转到相应的角色首页

      if (role === "agent") {
        next("/agent-login");
      } else if (role === "buyer") {
        next("/buyer-login");
      } else if (role === "seller") {
        next("/seller-login");
      } else {
        next("/");
      }
    } else {
      next();
    }
  }
});

export default router;
