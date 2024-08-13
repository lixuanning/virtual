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
];

export default routes;
