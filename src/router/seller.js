const routes = [
  {
    path: "/seller/home",
    name: "sellerHome",
    meta: { pathName: "sellerRouterName.home", icon: "HomeFilled" },
    children: [
      {
        path: "/seller/home/dashboard",
        name: "sellerDashboard",
        component: () => import("@/views/seller/sellerDashboard/index.vue"),
        meta: { pathName: "sellerRouterName.dashboard" },
      },
    ],
  },
  {
    path: "/seller/transactionManagement",
    name: "transactionManagement",
    meta: {
      pathName: "sellerRouterName.transactionManagement",
      icon: "Management",
    },
    children: [
      {
        path: "/seller/transactionManagement/advertisingManagement",
        name: "advertisingManagement",
        component: () =>
          import("@/views/seller/advertisingManagement/index.vue"),
        meta: { pathName: "sellerRouterName.advertisingManagement" },
      },
      {
        path: "/seller/transactionManagement/withdraw",
        name: "withdraw",
        component: () => import("@/views/seller/withdraw/index.vue"),
        meta: { pathName: "sellerRouterName.withdraw" },
      },
      {
        path: "/seller/rectransactionManagementharge/recharge",
        name: "recharge",
        component: () => import("@/views/seller/recharge/index.vue"),
        meta: { pathName: "sellerRouterName.recharge" },
      },
    ],
  },
  {
    path: "/seller/setting",
    name: "setting",
    meta: { pathName: "sellerRouterName.setting", icon: "CreditCard" },
    children: [
      {
        path: "/seller/setting/personalSetting",
        name: "personalSetting",
        component: () => import("@/views/seller/personalSetting/index.vue"),
        meta: { pathName: "sellerRouterName.personalSetting" },
      },
      {
        path: "/seller/setting/collectionSetup",
        name: "collectionSetup",
        component: () => import("@/views/seller/collectionSetup/index.vue"),
        meta: { pathName: "sellerRouterName.collectionSetup" },
      },
    ],
  },
];

export default routes;
