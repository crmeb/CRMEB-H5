export default [
  {
    path: "/order/list/:type?",
    name: "MyOrder",
    meta: {
      title: "我的订单",
      keepAlive: false,
      auth: true
    },
    component: () => import("@views/order/MyOrder")
  },
  {
    path: "/order/logistics/:id",
    name: "Logistics",
    meta: {
      title: "物流信息",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/order/Logistics")
  },
  {
    path: "/order/detail/:id",
    name: "OrderDetails",
    meta: {
      title: "订单详情",
      keepAlive: false,
      auth: true
    },
    component: () => import("@views/order/OrderDetails")
  },
  {
    path: "/order/submit/:id",
    name: "OrderSubmission",
    meta: {
      title: "提交订单",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/order/OrderSubmission")
  },
  {
    path: "/order/status",
    name: "PaymentStatus",
    meta: {
      title: "支付状态",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/order/PaymentStatus")
  },
  {
    path: "/order/refund/:id",
    name: "GoodsReturn",
    meta: {
      title: "申请退货",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/order/GoodsReturn.vue")
  },
  {
    path: "/order/refund_list",
    name: "ReturnList",
    meta: {
      title: "退货列表",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/order/ReturnList.vue")
  }
];
