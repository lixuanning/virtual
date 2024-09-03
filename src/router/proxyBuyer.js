const routes = [
  // {
  //   path: "/buyer/home",
  //   name: "buyerHome",
  //   meta: { pathName: "routerName.home", icon: "HomeFilled" },
  //   children: [
  //     {
  //       path: "/buyer/home/dashboard",
  //       name: "buyerDashboard",
  //       component: () => import("@/views/buyer/buyerDashboard/index.vue"),
  //       meta: { pathName: "routerName.dashboard" },
  //     },
  //   ],
  // },
  {
    path: "/buyer/transactionManagement",
    name: "buyerProxyTransactionManagement",
    meta: {
      pathName: "routerName.transactionManagement",
      icon: "Management",
    },
    children: [
      // {
      //   path: "/buyer/transactionManagement/withdraw",
      //   name: "buyerWithdraw",
      //   component: () => import("@/views/buyer/withdraw/index.vue"),
      //   meta: { pathName: "routerName.withdraw" },
      // },
      {
        path: "/buyer/transactionManagement/proxyRecharge",
        name: "buyerProxyRecharge",
        component: () => import("@/views/buyer/proxyRecharge/index.vue"),
        meta: { pathName: "routerName.recharge" },
      },
      {
        path: "/buyer/transactionManagement/withdrawalManagement",
        name: "buyerProxyWithdrawalManagement",
        component: () => import("@/views/buyer/withdrawalManagement/index.vue"),
        meta: { pathName: "routerName.withdrawalManagement" },
      },
    ],
  },
  // {
  //   path: "/buyer/setting",
  //   name: "buyerSetting",
  //   meta: { pathName: "routerName.setting", icon: "CreditCard" },
  //   children: [
  //     {
  //       path: "/buyer/setting/userSetting",
  //       name: "buyerUserSetting",
  //       component: () => import("@/views/buyer/userSetting/index.vue"),
  //       meta: { pathName: "routerName.userSetting" },
  //     },
  //   ],
  // },
];

export default routes;
