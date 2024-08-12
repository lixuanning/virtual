const routes = [
  {
    path: "/buyer/home",
    name: "buyerHome",
    meta: { pathName: "buyerRouterName.home", icon: "HomeFilled" },
    children: [
      {
        path: "/buyer/home/dashboard",
        name: "buyerDashboard",
        component: () => import("@/views/buyer/buyerDashboard/index.vue"),
        meta: { pathName: "buyerRouterName.dashboard" },
      },
    ],
  },
];

export default routes;
