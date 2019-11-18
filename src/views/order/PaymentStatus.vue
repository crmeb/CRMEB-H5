<template>
  <div class="payment-status" v-cloak>
    <!--失败时： 用icon-iconfontguanbi fail替换icon-duihao2 bg-color-red-->
    <div
      class="iconfont icon-duihao2 bg-color-red"
      v-if="!isWeixin || orderInfo.paid || orderInfo.pay_type == 'offline'"
    ></div>
    <div class="iconfont icon-iconfontguanbi fail" v-else></div>
    <!-- 失败时：订单支付失败 -->
    <div
      class="status"
      v-if="
        (!isWeixin && orderInfo.pay_type == 'weixin') ||
          orderInfo.pay_type == 'offline'
      "
    >
      订单创建成功
    </div>
    <div class="status" v-else-if="orderInfo.paid">订单支付成功</div>
    <div class="status" v-else>订单支付失败</div>
    <div class="wrapper">
      <div class="item acea-row row-between-wrapper">
        <div>订单编号</div>
        <div class="itemCom" v-text="orderInfo.order_id"></div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>下单时间</div>
        <div class="itemCom" v-text="orderInfo.add_time"></div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>支付方式</div>
        <div
          class="itemCom"
          v-if="orderInfo.pay_type == 'weixin' && orderInfo.is_channel == 2"
        >
          H5微信支付
        </div>
        <div
          class="itemCom"
          v-if="orderInfo.pay_type == 'weixin' && orderInfo.is_channel == 0"
        >
          微信支付
        </div>
        <div class="itemCom" v-if="orderInfo.pay_type == 'yue'">余额支付</div>
        <div class="itemCom" v-if="orderInfo.pay_type == 'offline'">
          线下支付
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>支付金额</div>
        <div class="itemCom" v-text="orderInfo.pay_price"></div>
      </div>
      <!--失败时加上这个  -->
      <div
        class="item acea-row row-between-wrapper"
        v-if="
          orderInfo.paid == 0 &&
            orderInfo.pay_type != 'offline' &&
            isWeixin &&
            msgContent
        "
      >
        <div>失败原因</div>
        <div class="itemCom" v-text="msgContent"></div>
      </div>
    </div>
    <!--失败时： 重新购买 -->
    <div v-if="orderInfo.pay_type == 'weixin' && orderInfo.is_channel == 2">
      <div class="returnBnt bg-color-red" @click="goPages()">查看支付结果</div>
      <div class="returnBnt cart-color" @click="goPages()">
        支付失败重新支付
      </div>
    </div>
    <div v-else>
      <div class="returnBnt bg-color-red" @click="goPages()">查看订单</div>
      <div class="returnBnt cart-color" @click="goPages('/')">返回首页</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { orderDetail } from "@api/order";
import { isWeixin } from "@utils";

const NAME = "PayMentStatus";

export default {
  name: NAME,
  props: {},
  data: function() {
    return {
      id: "",
      status: 0,
      msgContent: "",
      orderInfo: {},
      isWeixin: isWeixin()
    };
  },
  watch: {
    $route(n) {
      if (n.query.msg) this.msgContent = n.query.msg;
      if (n.name === NAME && this.id !== n.params.id) {
        this.id = n.params.id;
        this.status = parseInt(n.params.status);
        this.getOrderInfo();
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.id = this.$route.params.id;
    this.msgContent = this.$route.query.msg;
    this.status = parseInt(this.$route.params.status);
    this.getOrderInfo();
  },
  methods: {
    goPages(route) {
      let routes =
        route !== undefined
          ? route
          : "/order/detail/" + this.orderInfo.order_id;
      if (this.status === 5 && route === undefined) routes = "/order/list/0";
      return this.$router.push({
        path: routes
      });
    },
    getOrderInfo() {
      orderDetail(this.id).then(res => {
        this.orderInfo = res.data;
        if (this.isWeixin) {
          document.title = this.orderInfo.paid ? "支付成功" : "支付失败";
        } else {
          document.title = "订单创建成功";
        }
      });
    }
  }
};
</script>
