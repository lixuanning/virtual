const routes = [
  {
    path: "/agent/user",
    name: "UserManagement",
    redirect: "/agent/user/userList",
    meta: { pathName: "用户管理", icon: "User" },
    children: [
      {
        path: "/agent/user/userList",
        name: "UserList",
        meta: { pathName: "用户列表" },
        component: () => import("@/views/agent/userList/index.vue"),
      },
      {
        path: "/agent/user/transactionRecord",
        name: "TransactionRecord",
        meta: { pathName: "充币和扣币记录" },
        component: () => import("@/views/agent/transactionRecord/index.vue"),
      },
    ],
  },
  {
    path: "/agent/order",
    name: "UseOrder",
    redirect: "/agent/order/orderList",
    meta: { pathName: "订单",icon:'Memo' },
    children: [
      {
        path: "/agent/order/orderList",
        name: "OrderList",
        meta: { pathName: "买单" },
        component: () => import("@/views/agent/orderList/index.vue"),
      },
    ],
  },
];

export default routes;
