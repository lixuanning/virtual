const routes = [
  {
    path: "/agent/user",
    name: "agentManagement",
    redirect: "/agent/user/userList",
    meta: { pathName: "用户管理", icon: "User" },
    children: [
      {
        path: "/agent/user/userList",
        name: "agentUserList",
        meta: { pathName: "routerName.userManagement2" },
        component: () => import("@/views/agent/userList/index.vue"),
      },
      {
        path: "/agent/user/otcUserList",
        name: "agentOtcUserList",
        meta: { pathName: "routerName.OTCManagement" },
        component: () => import("@/views/agent/otcUserList/index.vue"),
      },
  
    ],
  },
  {
    path: "/agent/transactionManagement",
    name: "agentTransactionManagement",
    meta: {
      pathName: "routerName.transactionManagement",
      icon: "Management",
    },
    children: [

      {
        path: "/agent/transactionManagement/withdraw",
        name: "agentWithdraw",
        component: () => import("@/views/agent/withdraw/index.vue"),
        meta: { pathName: "routerName.withdraw" },
      },
      {
        path: "/agent/transactionManagement/recharge",
        name: "agentRecharge",
        component: () => import("@/views/agent/recharge/index.vue"),
        meta: { pathName: "routerName.recharge" },
      },
      {
        path: "/agent/rectransactionManagementharge/withdrawalManagement",
        name: "agentWithdrawalManagement",
        component: () => import("@/views/agent/withdrawalManagement/index.vue"),
        meta: { pathName: "routerName.withdrawalManagement" },
      },
    ],
  },
  {
    path: "/agent/setting",
    name: "agentSetting",
    meta: { pathName: "routerName.setting", icon: "CreditCard" },
    children: [
      {
        path: "/agent/setting/personalSetting",
        name: "agentPersonalSetting",
        component: () => import("@/views/agent/personalSetting/index.vue"),
        meta: { pathName: "routerName.personalSetting" },
      },
  
    ],
  },
];

export default routes;
