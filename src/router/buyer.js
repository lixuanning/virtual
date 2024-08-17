const routes = [
  {
    path: "/buyer/home",
    name: "buyerHome",
    meta: { pathName: "routerName.home", icon: "HomeFilled" },
    children: [
      {
        path: "/buyer/home/dashboard",
        name: "buyerDashboard",
        component: () => import("@/views/buyer/buyerDashboard/index.vue"),
        meta: { pathName: "routerName.dashboard" },
      },
    ],
  },
  {
    path: "/buyer/transactionManagement",
    name: "buyerTransactionManagement",
    meta: {
      pathName: "routerName.transactionManagement",
      icon: "Management",
    },
    children: [
      {
        path: "/buyer/transactionManagement/withdraw",
        name: "buyerWithdraw",
        component: () => import("@/views/buyer/withdraw/index.vue"),
        meta: { pathName: "routerName.withdraw" },
      },
      {
        path: "/buyer/transactionManagement/recharge",
        name: "buyerRecharge",
        component: () => import("@/views/buyer/recharge/index.vue"),
        meta: { pathName: "routerName.recharge" },
      },
      {
        path: "/buyer/transactionManagement/withdrawalManagement",
        name: "buyerWithdrawalManagement",
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
  //       path: "/buyer/setting/withdrawalManagement",
  //       name: "buyerWithdrawalManagement",
  //       component: () => import("@/views/buyer/withdrawalManagement/index.vue"),
  //       meta: { pathName: "routerName.withdrawalManagement" },
  //     },
  //   ],
  // },
];

export default routes;
