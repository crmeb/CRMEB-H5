export default [
  {
    path: "/activity"
    // component: () => import("@views/home/index.vue")
  },
  {
    path: "/activity/goods_seckill",
    name: "GoodsSeckill",
    meta: {
      title: "限时抢购",
      keepAlive: true,
      backgroundColor: "#ffffff"
    },
    component: () => import("@views/activity/GoodsSeckill.vue")
  },
  {
    path: "/activity/seckill_detail/:id?/:time",
    name: "SeckillDetails",
    meta: {
      title: "抢购详情页",
      keepAlive: true
    },
    component: () => import("@views/activity/SeckillDetails.vue")
  }
];
