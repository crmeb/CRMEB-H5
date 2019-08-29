import User from "@views/user/User";

export default [
  {
    path: "/user",
    name: "User",
    meta: {
      title: "个人中心",
      keepAlive: true,
      footer: true,
      auth: true
    },
    component: User
  },
  {
    path: "/user/binding",
    name: "BindingPhone",
    meta: {
      title: "绑定手机",
      keepAlive: true,
      backgroundColor: "#fff",
      auth: true
    },
    component: () => import("@views/user/BindingPhone.vue")
  },
  {
    path: "/user/add_address/:id?",
    name: "AddAddress",
    meta: {
      title: "添加收货地址",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/address/AddAddress.vue")
  },
  {
    path: "/user/account",
    name: "UserAccount",
    meta: {
      title: "我的账户",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/UserAccount.vue")
  },
  {
    path: "/user/add_manage",
    name: "AddressManagement",
    meta: {
      title: "地址管理",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/address/AddressManagement.vue")
  },
  {
    path: "/user/poster",
    name: "Poster",
    meta: {
      title: "分销海报",
      keepAlive: false,
      backgroundColor: "#a3a3a3",
      auth: true
    },
    component: () => import("@views/user/promotion/Poster.vue")
  },
  {
    path: "/user/sign",
    name: "Sign",
    meta: {
      title: "签到",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/signIn/Sign.vue")
  },
  {
    path: "/user/sign_record",
    name: "SignRecord",
    meta: {
      title: "签到记录",
      keepAlive: true
    },
    component: () => import("@views/user/signIn/SignRecord.vue")
  },
  {
    path: "/user/cash",
    name: "UserCash",
    meta: {
      title: "提现",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/UserCash.vue")
  },
  {
    path: "/user/audit",
    name: "CashAudit",
    meta: {
      title: "提现审核",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/CashAudit.vue")
  },
  {
    path: "/user/promoter_order",
    name: "PromoterOrder",
    meta: {
      title: "推广人订单",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/PromoterOrder.vue")
  },
  {
    path: "/user/promoter_list",
    name: "PromoterList",
    meta: {
      title: "推广人列表",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/PromoterList.vue")
  },
  {
    path: "/user/user_promotion",
    name: "UserPromotion",
    meta: {
      title: "我的推广",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/UserPromotion.vue")
  },
  {
    path: "/user/bill/:types?",
    name: "UserBill",
    meta: {
      title: "账单明细",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/UserBill.vue")
  },
  {
    path: "/user/cashrecord",
    name: "CashRecord",
    meta: {
      title: "提现记录",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/CashRecord.vue")
  },
  {
    path: "/user/commission",
    name: "CommissionDetails",
    meta: {
      title: "佣金明细",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/CommissionDetails.vue")
  },
  {
    path: "/user/integral",
    name: "Integral",
    meta: {
      title: "积分详情",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/signIn/Integral.vue")
  },
  {
    path: "/user/vip",
    name: "UserVip",
    meta: {
      title: "会员中心",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/UserVip.vue")
  },
  {
    path: "/user/data",
    name: "PersonalData",
    meta: {
      title: "个人资料",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/PersonalData.vue")
  },
  {
    path: "/user/user_coupon",
    name: "UserCoupon",
    meta: {
      title: "我的优惠券",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/coupon/UserCoupon.vue")
  },
  {
    path: "/user/get_coupon",
    name: "GetCoupon",
    meta: {
      title: "领取优惠券",
      keepAlive: true
    },
    component: () => import("@views/user/coupon/GetCoupon.vue")
  },
  {
    path: "/user/user_cash",
    name: "UserCash",
    meta: {
      title: "申请提现",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/promotion/UserCash.vue")
  },
  {
    path: "/customer/list",
    name: "CustomerList",
    meta: {
      title: "客服列表",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/CustomerList.vue")
  },
  {
    path: "/user/Recharge",
    name: "Recharge",
    meta: {
      title: "余额充值",
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/user/Recharge.vue")
  }
];
