const routes = [
    {
      path: '/buyer/dashboard',
      name: 'buyerAashboard',
      component: () => import('@/views/buyer/buyerDashboard/index.vue'),
      meta: { pathName: '看板' },
  
    },
  ]
  
  export default routes
  