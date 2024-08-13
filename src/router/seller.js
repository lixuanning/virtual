const routes = [
  {
    path: "/seller/home",
    name: "sellerHome",
    meta: { pathName: "routerName.home", icon: "HomeFilled" },
    children: [
      {
        path: "/seller/home/dashboard",
        name: "sellerDashboard",
        component: () => import("@/views/seller/sellerDashboard/index.vue"),
        meta: { pathName: "routerName.dashboard" },
      },
    ],
  },
  {
    path: "/seller/transactionManagement",
    name: "transactionManagement",
    meta: {
      pathName: "routerName.transactionManagement",
      icon: "Management",
    },
    children: [
      {
        path: "/seller/transactionManagement/advertisingManagement",
        name: "advertisingManagement",
        component: () =>
          import("@/views/seller/advertisingManagement/index.vue"),
        meta: { pathName: "routerName.advertisingManagement" },
      },
      {
        path: "/seller/transactionManagement/withdraw",
        name: "withdraw",
        component: () => import("@/views/seller/withdraw/index.vue"),
        meta: { pathName: "routerName.withdraw" },
      },
      {
        path: "/seller/rectransactionManagementharge/recharge",
        name: "recharge",
        component: () => import("@/views/seller/recharge/index.vue"),
        meta: { pathName: "routerName.recharge" },
      },
    ],
  },
  {
    path: "/seller/setting",
    name: "setting",
    meta: { pathName: "routerName.setting", icon: "CreditCard" },
    children: [
      {
        path: "/seller/setting/personalSetting",
        name: "personalSetting",
        component: () => import("@/views/seller/personalSetting/index.vue"),
        meta: { pathName: "routerName.personalSetting" },
      },
      {
        path: "/seller/setting/collectionSetup",
        name: "collectionSetup",
        component: () => import("@/views/seller/collectionSetup/index.vue"),
        meta: { pathName: "routerName.collectionSetup" },
      },
    ],
  },
];

export default routes;
