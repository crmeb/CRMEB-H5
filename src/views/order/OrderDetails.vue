<template>
  <div class="order-details">
    <!-- 给header上与data上加on为退款订单-->
    <div
      class="header bg-color-red acea-row row-middle"
      :class="refundOrder ? 'on' : ''"
    >
      <div class="pictrue" v-if="!refundOrder">
        <img :src="orderInfo.status_pic" />
      </div>
      <div class="data" :class="refundOrder ? 'on' : ''">
        <div class="state">{{ orderInfo._status._msg }}</div>
        <div>
          {{ orderInfo.add_time_y
          }}<span class="time">{{ orderInfo.add_time_h }}</span>
        </div>
      </div>
    </div>
    <template v-if="!refundOrder">
      <div class="nav">
        <div class="navCon acea-row row-between-wrapper">
          <div :class="{ on: status.type === 0 || status.type === 9 }">
            待付款
          </div>
          <div :class="{ on: status.type === 1 }">待发货</div>
          <div :class="{ on: status.type === 2 }">待收货</div>
          <div :class="{ on: status.type === 3 }">待评价</div>
          <div :class="{ on: status.type === 4 }">已完成</div>
        </div>
        <div class="progress acea-row row-between-wrapper">
          <div
            class="iconfont"
            :class="[
              status.type === 0 || status.type === 9
                ? 'icon-webicon318'
                : 'icon-yuandianxiao',
              status.type >= 0 ? 'font-color-red' : ''
            ]"
          ></div>
          <div
            class="line"
            :class="{ 'bg-color-red': status.type > 0 && status.type != 9 }"
          ></div>
          <div
            class="iconfont"
            :class="[
              status.type === 1 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 1 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
          ></div>
          <div
            class="line"
            :class="{
              'bg-color-red':
                status.type > 1 && status.type != 6 && status.type != 9
            }"
          ></div>
          <div
            class="iconfont icon-yuandianxiao"
            :class="[
              status.type === 2 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 2 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
          ></div>
          <div
            class="line"
            :class="{
              'bg-color-red':
                status.type > 2 && status.type != 6 && status.type != 9
            }"
          ></div>
          <div
            class="iconfont icon-yuandianxiao"
            :class="[
              status.type === 3 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 3 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
          ></div>
          <div
            class="line"
            :class="{
              'bg-color-red':
                status.type > 3 && status.type != 6 && status.type != 9
            }"
          ></div>
          <div
            class="iconfont icon-yuandianxiao"
            :class="[
              status.type == 4 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 4 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
          ></div>
        </div>
      </div>
      <div class="address">
        <div class="name">
          {{ orderInfo.real_name
          }}<span class="phone">{{ orderInfo.user_phone }}</span>
        </div>
        <div>{{ orderInfo.user_address }}</div>
      </div>
      <div class="line"><img src="@assets/images/line.jpg" /></div>
    </template>
    <OrderGoods
      :evaluate="status.type || 0"
      :cartInfo="orderInfo.cartInfo || []"
    ></OrderGoods>
    <div class="wrapper">
      <div class="item acea-row row-between">
        <div>订单编号：</div>
        <div class="conter acea-row row-middle row-right">
          {{ orderInfo.order_id
          }}<span
            class="copy copy-data"
            :data-clipboard-text="orderInfo.order_id"
            >复制</span
          >
        </div>
      </div>
      <div class="item acea-row row-between">
        <div>下单时间：</div>
        <div class="conter">
          {{ orderInfo.add_time_y + " " + orderInfo.add_time_h }}
        </div>
      </div>
      <div class="item acea-row row-between">
        <div>订单类型：</div>
        <div class="conter">
          {{ orderTypeName }}
        </div>
      </div>
      <div class="item acea-row row-between">
        <div>支付状态：</div>
        <div class="conter">{{ orderInfo.paid ? "已支付" : "未支付" }}</div>
      </div>
      <div class="item acea-row row-between">
        <div>支付方式：</div>
        <div class="conter">{{ orderInfo._status._payType }}</div>
      </div>
      <div class="item acea-row row-between" v-if="orderInfo.mark">
        <div>买家留言：</div>
        <div class="conter">{{ orderInfo.mark }}</div>
      </div>
    </div>

    <div v-if="orderInfo.status != 0">
      <div class="wrapper" v-if="orderInfo.delivery_type === 'express'">
        <div class="item acea-row row-between">
          <div>配送方式：</div>
          <div class="conter">
            发货
          </div>
        </div>
        <div class="item acea-row row-between">
          <div>快递公司：</div>
          <div class="conter">{{ orderInfo.delivery_name || "" }}</div>
        </div>
        <div class="item acea-row row-between">
          <div>快递号：</div>
          <div class="conter">{{ orderInfo.delivery_id || "" }}</div>
        </div>
      </div>

      <div class="wrapper" v-else>
        <div class="item acea-row row-between">
          <div>配送方式：</div>
          <div class="conter">
            送货
          </div>
        </div>
        <div class="item acea-row row-between">
          <div>配送人：</div>
          <div class="conter">{{ orderInfo.delivery_name || "" }}</div>
        </div>
        <div class="item acea-row row-between">
          <div>配送电话：</div>
          <div class="conter acea-row row-middle row-right">
            {{ orderInfo.delivery_id || "" }}<span class="copy">拨打</span>
          </div>
        </div>
      </div>
    </div>
    <!--     退款订单详情 -->
    <div class="wrapper" v-if="refundOrder">
      <div class="item acea-row row-between">
        <div>收货人：</div>
        <div class="conter">{{ orderInfo.real_name }}</div>
      </div>
      <div class="item acea-row row-between">
        <div>联系电话：</div>
        <div class="conter">{{ orderInfo.user_phone }}</div>
      </div>
      <div class="item acea-row row-between">
        <div>收货地址：</div>
        <div class="conter">{{ orderInfo.user_address }}</div>
      </div>
    </div>
    <div class="wrapper">
      <div class="item acea-row row-between">
        <div>支付金额：</div>
        <div class="conter">￥{{ orderInfo.total_price }}</div>
      </div>
      <div class="item acea-row row-between" v-if="orderInfo.coupon_price > 0">
        <div>优惠券抵扣：</div>
        <div class="conter">-￥{{ orderInfo.coupon_price }}</div>
      </div>
      <div class="item acea-row row-between" v-if="orderInfo.use_integral > 0">
        <div>积分抵扣：</div>
        <div class="conter">-￥{{ orderInfo.deduction_price }}</div>
      </div>
      <div class="item acea-row row-between" v-if="orderInfo.pay_postage > 0">
        <div>运费：</div>
        <div class="conter">￥{{ orderInfo.pay_postage }}</div>
      </div>
      <div class="actualPay acea-row row-right">
        实付款：<span class="money font-color-red"
          >￥{{ orderInfo.pay_price }}</span
        >
      </div>
    </div>
    <div style="height:1.2rem;" v-if="!refundOrder && offlineStatus"></div>
    <div
      class="footer acea-row row-right row-middle"
      v-if="!refundOrder && offlineStatus"
    >
      <template v-if="status.type === 0">
        <div class="bnt cancel" @click="cancelOrder">取消订单</div>
        <div class="bnt bg-color-red" @click="pay = true">立即付款</div>
      </template>
      <template v-if="status.type === 1">
        <div
          class="bnt cancel"
          @click="$router.push({ path: '/order/refund/' + orderInfo.order_id })"
        >
          申请退款
        </div>
      </template>
      <template v-if="status.type === 2">
        <div
          class="bnt default"
          @click="
            $router.push({ path: '/order/logistics/' + orderInfo.order_id })
          "
        >
          查看物流
        </div>
        <div class="bnt bg-color-red" @click="takeOrder">
          确认收货
        </div>
      </template>
      <template
        v-if="status.type === 3 && orderInfo.delivery_type === 'express'"
      >
        <div
          class="bnt default"
          @click="
            $router.push({ path: '/order/logistics/' + orderInfo.order_id })
          "
        >
          查看物流
        </div>
      </template>
      <template v-if="status.type === 4">
        <div class="bnt cancel" @click="delOrder">
          删除订单
        </div>
        <div
          class="bnt default"
          @click="
            $router.push({ path: '/order/logistics/' + orderInfo.order_id })
          "
        >
          查看物流
        </div>
      </template>
      <template v-if="status.type === 6">
        <div
          class="bnt bg-color-red"
          @click="
            $router.push({ path: '/activity/group_rule/' + orderInfo.pink_id })
          "
        >
          查看拼团
        </div>
      </template>
    </div>
    <Payment
      v-model="pay"
      :types="payType"
      @checked="toPay"
      :balance="userInfo.now_money"
    ></Payment>
  </div>
</template>
<script>
import OrderGoods from "@components/OrderGoods";
import { orderDetail } from "@api/order";
import ClipboardJS from "clipboard";
import Payment from "@components/Payment";
import { isWeixin } from "@utils";
import { mapGetters } from "vuex";
import {
  cancelOrderHandle,
  takeOrderHandle,
  delOrderHandle,
  payOrderHandle
} from "@libs/order";

const NAME = "OrderDetails";

export default {
  name: NAME,
  components: {
    OrderGoods,
    Payment
  },
  props: {},
  data: function() {
    return {
      offlinePayStatus: 2,
      orderTypeName: "普通订单",
      orderTypeNameStatus: true,
      offlineStatus: true,
      id: this.$route.params.id,
      orderInfo: {
        _status: {}
      },
      status: {},
      pay: false,
      payType: ["yue", "weixin"],
      from: isWeixin() ? "weixin" : "weixinh5"
    };
  },
  computed: {
    refundOrder() {
      return this.orderInfo.refund_status > 0;
    },
    ...mapGetters(["userInfo"])
  },
  watch: {
    $route(n) {
      if (n.name === NAME && this.id !== n.params.id) {
        this.id = n.params.id;
        this.getDetail();
      }
    }
  },
  inject: ["app"],
  mounted: function() {
    this.getDetail();
    this.$nextTick(function() {
      var copybtn = document.getElementsByClassName("copy-data");
      const clipboard = new ClipboardJS(copybtn);
      clipboard.on("success", () => {
        this.$dialog.success("复制成功");
      });
    });
  },
  methods: {
    goBack() {
      const history = this.app.history,
        last = history[history.length - 1] || {};
      if (last.name === "MyOrder") return this.$router.go(-1);
      else return this.$router.replace({ path: "/order/list/" });
    },
    cancelOrder() {
      cancelOrderHandle(this.orderInfo.order_id)
        .then(() => {
          setTimeout(() => this.goBack(), 300);
        })
        .catch(() => {
          this.getDetail();
        });
    },
    takeOrder() {
      takeOrderHandle(this.orderInfo.order_id).finally(() => {
        this.getDetail();
      });
    },
    delOrder() {
      delOrderHandle(this.orderInfo.order_id).then(() => {
        setTimeout(() => this.goBack(), 300);
      });
    },
    setOfflinePayStatus: function(status) {
      var that = this;
      that.offlinePayStatus = status;
      if (status === 1 && that.orderTypeNameStatus === true) {
        that.payType.push("offline");
      }
    },
    getOrderStatus: function() {
      let orderInfo = this.orderInfo || {},
        _status = orderInfo._status || { _type: 0 },
        status = {};
      let type = parseInt(_status._type),
        delivery_type = orderInfo.delivery_type,
        seckill_id = orderInfo.seckill_id ? parseInt(orderInfo.seckill_id) : 0,
        bargain_id = orderInfo.bargain_id ? parseInt(orderInfo.bargain_id) : 0,
        combination_id = orderInfo.combination_id
          ? parseInt(orderInfo.combination_id)
          : 0;
      status = {
        type: type,
        class_status: 0
      };
      if (type === 1 && combination_id > 0) {
        status.type = 6;
        status.class_status = 1;
      } //查看拼团
      if (type === 2 && delivery_type === "express") status.class_status = 2; //查看物流
      if (type === 2) status.class_status = 3; //确认收货
      if (type === 4 || type === 0) status.class_status = 4; //删除订单
      if (
        !seckill_id &&
        !bargain_id &&
        !combination_id &&
        (type === 3 || type === 4)
      )
        status.class_status = 5; //再次购买
      if (type == 9) {
        //线下付款
        status.class_status = 0;
        this.offlineStatus = false;
      }
      this.status = status;
    },
    getDetail() {
      const id = this.id;
      if (!id) return this.$dialog.error("订单不存在");
      orderDetail(id)
        .then(res => {
          this.orderInfo = res.data;
          this.getOrderStatus();
          if (this.orderInfo.combination_id > 0) {
            this.orderTypeName = "拼团订单";
            this.orderTypeNameStatus = false;
          } else if (this.orderInfo.bargain_id > 0) {
            this.orderTypeName = "砍价订单";
            this.orderTypeNameStatus = false;
          } else if (this.orderInfo.seckill_id > 0) {
            this.orderTypeName = "秒杀订单";
            this.orderTypeNameStatus = false;
          }
          this.setOfflinePayStatus(this.orderInfo.offlinePayStatus);
        })
        .catch(err => {
          this.$dialog.error(err.msg);
        });
    },
    async toPay(type) {
      var that = this;
      await payOrderHandle(this.orderInfo.order_id, type, that.from);
      that.getDetail();
    }
  }
};
</script>
