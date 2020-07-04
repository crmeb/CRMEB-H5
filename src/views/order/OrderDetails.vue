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
          <div
            :class="{ on: status.type === 1 }"
            v-if="orderInfo.shipping_type === 2"
          >
            待核销
          </div>
          <div :class="{ on: status.type === 1 }" v-else>待发货</div>
          <div
            :class="{ on: status.type === 2 }"
            v-if="orderInfo.shipping_type === 1"
          >
            待收货
          </div>
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
            v-if="orderInfo.shipping_type === 1"
          ></div>
          <div
            class="iconfont"
            :class="[
              status.type === 2 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 2 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
            v-if="orderInfo.shipping_type === 1"
          ></div>
          <div
            class="line"
            :class="{
              'bg-color-red':
                status.type > 2 && status.type != 6 && status.type != 9
            }"
          ></div>
          <div
            class="iconfont"
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
            class="iconfont"
            :class="[
              status.type == 4 ? 'icon-webicon318' : 'icon-yuandianxiao',
              status.type >= 4 && status.type != 6 && status.type != 9
                ? 'font-color-red'
                : ''
            ]"
          ></div>
        </div>
      </div>
      <div
        class="writeOff"
        v-if="orderInfo.shipping_type === 2 && orderInfo.paid === 1"
      >
        <div class="title">核销信息</div>
        <div class="grayBg">
          <div class="pictrue"><img :src="orderInfo.code" /></div>
        </div>
        <div class="gear"><img src="@assets/images/writeOff.jpg" /></div>
        <div class="num">{{ orderInfo._verify_code }}</div>
        <div class="rules">
          <div class="item">
            <div class="rulesTitle acea-row row-middle">
              <span class="iconfont icon-shijian"></span>核销时间
            </div>
            <div class="info">
              每日：<span class="time">{{ system_store.day_time }}</span>
            </div>
          </div>
          <div class="item">
            <div class="rulesTitle acea-row row-middle">
              <span class="iconfont icon-shuoming1"></span>使用说明
            </div>
            <div class="info">可将二维码出示给店员扫描或提供数字核销码</div>
          </div>
        </div>
      </div>
      <div
        class="map acea-row row-between-wrapper"
        v-if="orderInfo.shipping_type === 2 && orderInfo.paid === 1"
      >
        <div>自提地址信息</div>
        <div
          class="place cart-color acea-row row-center-wrapper"
          @click="showChang"
        >
          <span class="iconfont icon-weizhi"></span>查看位置
        </div>
      </div>
      <div class="address" v-if="orderInfo.shipping_type === 1">
        <div class="name">
          {{ orderInfo.real_name
          }}<span class="phone">{{ orderInfo.user_phone }}</span>
        </div>
        <div>{{ orderInfo.user_address }}</div>
      </div>
      <div class="address" v-else>
        <div class="name">
          {{ system_store.name
          }}<span class="phone">{{ system_store.phone }}</span>
          <a
            class="iconfont icon-tonghua font-color-red"
            :href="'tel:' + system_store.phone"
          ></a>
        </div>
        <div>{{ system_store._detailed_address }}</div>
      </div>
      <div class="line" v-if="orderInfo.shipping_type === 1">
        <img src="@assets/images/line.jpg" />
      </div>
    </template>
    <OrderGoods
      :evaluate="status.type || 0"
      :cartInfo="orderInfo.cartInfo || []"
    ></OrderGoods>
    <div
      class="goodCall"
      @click="
        $router.push({
          path: '/customer/list?orderId=' + orderInfo.order_id
        })
      "
    >
      <span class="iconfont icon-kefu"></span><span>联系客服</span>
    </div>
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

      <div class="wrapper" v-if="orderInfo.delivery_type === 'send'">
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
            {{ orderInfo.delivery_id || ""
            }}<a :href="'tel:' + orderInfo.delivery_id"
              ><span class="copy">拨打</span></a
            >
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
          v-if="orderInfo.paid === 1 && orderInfo.refund_status === 0"
          class="bnt cancel"
          @click="$router.push({ path: '/order/refund/' + orderInfo.order_id })"
        >
          申请退款
        </div>
        <div
          class="bnt default"
          v-if="orderInfo.delivery_type === 'express'"
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
      <template v-if="status.type === 3">
        <div
          v-if="orderInfo.paid === 1 && orderInfo.refund_status === 0"
          class="bnt cancel"
          @click="$router.push({ path: '/order/refund/' + orderInfo.order_id })"
        >
          申请退款
        </div>
        <div
          v-if="orderInfo.delivery_type === 'express'"
          class="bnt default"
          @click="
            $router.push({ path: '/order/logistics/' + orderInfo.order_id })
          "
        >
          查看物流
        </div>
      </template>
      <template v-if="status.type === 4">
        <div
          v-if="orderInfo.paid === 1 && orderInfo.refund_status === 0"
          class="bnt cancel"
          @click="$router.push({ path: '/order/refund/' + orderInfo.order_id })"
        >
          申请退款
        </div>
        <div class="bnt cancel" @click="delOrder">
          删除订单
        </div>
        <div
          v-if="orderInfo.delivery_type === 'express'"
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
          v-if="orderInfo.paid === 1 && orderInfo.refund_status === 0"
          class="bnt cancel"
          @click="$router.push({ path: '/order/refund/' + orderInfo.order_id })"
        >
          申请退款
        </div>
        <div
          class="bnt bg-color-red"
          @click="
            $router.push({ path: '/activity/group_rule/' + orderInfo.pink_id })
          "
        >
          查看拼团
        </div>
      </template>
      <div
        class="bnt bg-color-red"
        @click="goOrderConfirm(orderInfo)"
        v-if="
          orderInfo.paid === 1 &&
            orderInfo.refund_status === 0 &&
            orderInfo.status >= 2
        "
      >
        再次购买
      </div>
    </div>
    <Payment
      v-model="pay"
      :types="payType"
      @checked="toPay"
      :balance="userInfo.now_money"
    ></Payment>
    <div class="geoPage" v-if="mapShow">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="no"
        :src="
          'https://apis.map.qq.com/uri/v1/geocoder?coord=' +
            system_store.latitude +
            ',' +
            system_store.longitude +
            '&referer=' +
            mapKey
        "
      >
      </iframe>
    </div>
    <GeneralWindow
      :generalActive="generalActive"
      @closeGeneralWindow="closeGeneralWindow"
      :generalContent="generalContent"
    ></GeneralWindow>
  </div>
</template>
<style scoped>
.goodCall {
  color: #e93323;
  text-align: center;
  width: 100%;
  height: 0.86rem;
  padding: 0 0.3rem;
  border-bottom: 0.01rem solid #eee;
  font-size: 0.3rem;
  line-height: 0.86rem;
  background: #fff;
}
.iconfont {
  margin-right: 0.15rem;
}
.geoPage {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 10000;
}
.order-details .writeOff {
  background-color: #fff;
  margin-top: 0.13rem;
  padding-bottom: 0.3rem;
}
.order-details .writeOff .title {
  font-size: 0.3rem;
  color: #282828;
  height: 0.87rem;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 0.3rem;
  line-height: 0.87rem;
}
.order-details .writeOff .grayBg {
  background-color: #f2f5f7;
  width: 5.9rem;
  height: 3.84rem;
  border-radius: 0.2rem 0.2rem 0 0;
  margin: 0.5rem auto 0 auto;
  padding-top: 0.55rem;
}
.order-details .writeOff .grayBg .pictrue {
  width: 2.9rem;
  height: 2.9rem;
  margin: 0 auto;
}
.order-details .writeOff .grayBg .pictrue img {
  width: 100%;
  height: 100%;
  display: block;
}
.order-details .writeOff .gear {
  width: 5.9rem;
  height: 0.3rem;
  margin: 0 auto;
}
.order-details .writeOff .gear img {
  width: 100%;
  height: 100%;
  display: block;
}
.order-details .writeOff .num {
  background-color: #f0c34c;
  width: 5.9rem;
  height: 0.84rem;
  color: #282828;
  font-size: 0.48rem;
  margin: 0 auto;
  border-radius: 0 0 0.2rem 0.2rem;
  text-align: center;
  padding-top: 0.04rem;
}
.order-details .writeOff .rules {
  margin: 0.46rem 0.3rem 0 0.3rem;
  border-top: 0.01rem solid #f0f0f0;
  padding-top: 0.1rem;
}
.order-details .writeOff .rules .item {
  margin-top: 0.15rem;
}
.order-details .writeOff .rules .item .rulesTitle {
  font-size: 0.28rem;
  color: #282828;
}
.order-details .writeOff .rules .item .rulesTitle .iconfont {
  font-size: 0.3rem;
  color: #333;
  margin-right: 0.08rem;
  margin-top: 0.05rem;
}
.order-details .writeOff .rules .item .info {
  font-size: 0.28rem;
  color: #999;
  margin-top: 0.05rem;
}
.order-details .writeOff .rules .item .info .time {
  margin-left: 0.2rem;
}
.order-details .map {
  height: 0.86rem;
  font-size: 0.3rem;
  color: #282828;
  line-height: 0.86rem;
  border-bottom: 0.01rem solid #f0f0f0;
  margin-top: 0.13rem;
  background-color: #fff;
  padding: 0 0.3rem;
}
.order-details .map .place {
  font-size: 0.26rem;
  width: 1.76rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  line-height: 0.5rem;
  text-align: center;
}
.order-details .map .place .iconfont {
  font-size: 0.27rem;
  height: 0.27rem;
  line-height: 0.27rem;
  margin: 0.02rem 0.03rem 0 0;
}
.order-details .address .name .iconfont {
  font-size: 0.34rem;
  margin-left: 0.1rem;
}
</style>

<script>
import OrderGoods from "@components/OrderGoods";
import { orderDetail, orderAgain } from "@api/order";
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
import { wechatEvevt } from "@libs/wechat";
import GeneralWindow from "@components/GeneralWindow";
const NAME = "OrderDetails";
export default {
  name: NAME,
  components: {
    OrderGoods,
    Payment,
    GeneralWindow
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
      from: isWeixin() ? "weixin" : "weixinh5",
      system_store: {},
      mapKay: "",
      mapShow: false,
      generalActive: false,
      generalContent: {
        promoterNum: "",
        title: ""
      }
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
      let copybtn = document.getElementsByClassName("copy-data");
      const clipboard = new ClipboardJS(copybtn);
      clipboard.on("success", () => {
        this.$dialog.success("复制成功");
      });
    });
  },
  methods: {
    // 再次购买
    goOrderConfirm(e) {
      orderAgain(e.order_id)
        .then(res => {
          this.$router.push({
            path: "/order/submit/" + res.data.cateId
          });
        })
        .catch(res => {
          this.$dialog.error(res.msg);
        });
    },
    closeGeneralWindow(msg) {
      this.generalActive = msg;
      this.getDetail();
    },
    showChang: function() {
      if (isWeixin()) {
        let config = {
          latitude: parseFloat(this.system_store.latitude),
          longitude: parseFloat(this.system_store.longitude),
          name: this.system_store.name,
          address: this.system_store._detailed_address
        };
        wechatEvevt("openLocation", config)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            if (res.is_ready) {
              res.wx.openLocation(config);
            }
          });
      } else {
        if (!this.mapKey)
          return this.$dialog.error(
            "暂无法使用查看地图，请配置您的腾讯地图key"
          );
        this.mapShow = true;
      }
    },
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
      this.$dialog.loading.open("正在加载中");
      takeOrderHandle(this.orderInfo.order_id)
        .then(res => {
          if (
            (res.data.gain_integral != "0.00" &&
              res.data.gain_coupon != "0.00") ||
            (res.data.gain_integral > 0 && res.data.gain_coupon > 0)
          ) {
            this.$dialog.loading.close();
            this.generalActive = true;
            this.generalContent = {
              promoterNum: `恭喜您获得${res.data.gain_coupon}元优惠券以及${
                res.data.gain_integral
              }积分，购买商品时可抵现哦～`,
              title: "恭喜您获得优惠礼包"
            };
            return;
          } else if (
            res.data.gain_integral != "0.00" ||
            res.data.gain_integral > 0
          ) {
            this.$dialog.loading.close();
            this.generalActive = true;
            this.generalContent = {
              promoterNum: `恭喜您获得${
                res.data.gain_integral
              }积分，购买商品时可抵现哦～`,
              title: "赠送积分"
            };
            return;
          } else if (
            res.data.gain_coupon != "0.00" ||
            res.data.gain_coupon > 0
          ) {
            this.$dialog.loading.close();
            this.generalActive = true;
            this.generalContent = {
              promoterNum: `恭喜您获得${
                res.data.gain_coupon
              }元优惠券，购买商品时可抵现哦～`,
              title: "恭喜您获得优惠券"
            };
            return;
          } else {
            this.$dialog.loading.close();
            this.$dialog.success("收货成功");
          }
          this.getDetail();
        })
        .catch(res => {
          this.$dialog.loading.close();
          this.$dialog.error(res.msg);
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
          this.system_store = res.data.system_store || {};
          this.mapKey = res.data.mapKey;
          this.setOfflinePayStatus(this.orderInfo.offlinePayStatus);
          this.$nextTick(function() {
            let copybtn = document.getElementsByClassName("copy-data");
            const clipboard = new ClipboardJS(copybtn);
            clipboard.on("success", () => {
              this.$dialog.success("复制成功");
            });
          });
        })
        .catch(err => {
          this.$dialog.error(err.msg);
          this.$router.go(-1);
        });
    },
    async toPay(type) {
      var that = this;
      await payOrderHandle(this.orderInfo.order_id, type, that.from)
        .then(() => {})
        .catch(res => {
          if (res.status === "WECHAT_H5_PAY")
            that.$router.push({
              path: "/order/status/" + that.orderInfo.order_id + "/0"
            });
        });
      that.getDetail();
    }
  }
};
</script>
