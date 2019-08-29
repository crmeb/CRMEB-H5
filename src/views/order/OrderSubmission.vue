<template>
  <div class="order-submission">
    <div class="line">
      <img src="@assets/images/line.jpg" />
    </div>
    <div class="address acea-row row-between-wrapper" @click="addressTap">
      <div class="addressCon" v-if="addressInfo.real_name">
        <div class="name">
          {{ addressInfo.real_name }}
          <span class="phone">{{ addressInfo.phone }}</span>
        </div>
        <div>
          <span class="default font-color-red" v-if="addressInfo.is_default"
            >[默认]</span
          >
          {{ addressInfo.province }}{{ addressInfo.city
          }}{{ addressInfo.district }}{{ addressInfo.detail }}
        </div>
      </div>
      <div class="addressCon" v-else>
        <div class="setaddress">设置收货地址</div>
      </div>
      <div class="iconfont icon-jiantou"></div>
    </div>
    <OrderGoods :evaluate="0" :cartInfo="orderGroupInfo.cartInfo"></OrderGoods>
    <div class="wrapper">
      <div
        class="item acea-row row-between-wrapper"
        @click="couponTap"
        v-if="deduction === false"
      >
        <div>优惠券</div>
        <div class="discount">
          {{ usableCoupon.coupon_title || "请选择" }}
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="deduction === false">
        <div>积分抵扣</div>
        <div class="discount">
          <div class="select-btn">
            <div class="checkbox-wrapper">
              <label class="well-check">
                <input type="checkbox" v-model="useIntegral" />
                <i class="icon"></i>
                <span class="integral">
                  当前积分
                  <span class="num font-color-red">
                    {{ userInfo.integral || 0 }}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>快递费用</div>
        <div class="discount">
          {{
            orderGroupInfo.priceGroup.storePostage > 0
              ? orderGroupInfo.priceGroup.storePostage
              : "免运费"
          }}
        </div>
      </div>
      <div class="item">
        <div>备注信息</div>
        <textarea
          placeholder="请添加备注（150字以内）"
          v-model="mark"
        ></textarea>
      </div>
    </div>
    <div class="wrapper">
      <div class="item">
        <div>支付方式</div>
        <div class="list">
          <div
            class="payItem acea-row row-middle"
            :class="active === 'weixin' ? 'on' : ''"
            @click="payItem('weixin')"
            v-show="isWeixin"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-weixin2"
                :class="active === 'weixin' ? 'bounceIn' : ''"
              ></div>
              微信支付
            </div>
            <div class="tip">微信快捷支付</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'weixin' ? 'on' : ''"
            @click="payItem('weixin')"
            v-show="!isWeixin"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-weixin2"
                :class="active === 'weixin' ? 'bounceIn' : ''"
              ></div>
              微信支付
            </div>
            <div class="tip">微信快捷支付</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'yue' ? 'on' : ''"
            @click="payItem('yue')"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-icon-test"
                :class="active === 'yue' ? 'bounceIn' : ''"
              ></div>
              余额支付
            </div>
            <div class="tip">可用余额：{{ userInfo.now_money || 0 }}</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'offline' ? 'on' : ''"
            @click="payItem('offline')"
            v-if="offlinePayStatus === 1 && deduction === false"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-yinhangqia"
                :class="active === 'offline' ? 'bounceIn' : ''"
              ></div>
              线下支付
            </div>
            <div class="tip">线下方便支付</div>
          </div>
        </div>
      </div>
    </div>
    <div class="moneyList">
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.total_price !== undefined"
      >
        <div>商品总价：</div>
        <div class="money">￥{{ orderPrice.total_price }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.pay_postage > 0"
      >
        <div>运费：</div>
        <div class="money">￥{{ orderPrice.pay_postage }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.coupon_price > 0"
      >
        <div>优惠券抵扣：</div>
        <div class="money">-￥{{ orderPrice.coupon_price }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.deduction_price > 0"
      >
        <div>积分抵扣：</div>
        <div class="money">-￥{{ orderPrice.deduction_price }}</div>
      </div>
    </div>
    <div style="height:1.2rem"></div>
    <div class="footer acea-row row-between-wrapper">
      <div>
        合计:
        <span class="font-color-red">￥{{ orderPrice.pay_price }}</span>
      </div>
      <div class="settlement" @click="createOrder">立即结算</div>
    </div>
    <CouponListWindow
      v-on:couponchange="changecoupon($event)"
      v-model="showCoupon"
      :price="orderPrice.total_price"
      :checked="usableCoupon.id"
      @checked="changeCoupon"
    ></CouponListWindow>
    <AddressWindow
      @checked="changeAddress"
      @redirect="addressRedirect"
      v-model="showAddress"
      :checked="addressInfo.id"
      ref="mychild"
    ></AddressWindow>
  </div>
</template>
<script>
import OrderGoods from "@components/OrderGoods";
import CouponListWindow from "@components/CouponListWindow";
import AddressWindow from "@components/AddressWindow";
import { postOrderConfirm, postOrderComputed, createOrder } from "@api/order";
import { mapGetters } from "vuex";
import { pay } from "@libs/wechat";
import { isWeixin } from "@utils";

const NAME = "OrderSubmission",
  _isWeixin = isWeixin();
export default {
  name: NAME,
  components: {
    OrderGoods,
    CouponListWindow,
    AddressWindow
  },
  props: {},
  data: function() {
    return {
      offlinePayStatus: 2,
      from: _isWeixin ? "weixin" : "weixinh5",
      deduction: true,
      isWeixin: _isWeixin,
      pinkId: 0,
      active: _isWeixin ? "weixin" : "yue",
      showCoupon: false,
      showAddress: false,
      addressInfo: {},
      couponId: 0,
      orderGroupInfo: {
        priceGroup: {}
      },
      usableCoupon: {},
      addressLoaded: false,
      useIntegral: false,
      orderPrice: {
        pay_price: "计算中"
      },
      mark: ""
    };
  },
  computed: mapGetters(["userInfo"]),
  watch: {
    useIntegral() {
      this.computedPrice();
    },
    $route(n) {
      if (n.name === NAME) this.getCartInfo();
    }
  },
  mounted: function() {
    var that = this;
    this.getCartInfo();
    if (that.$route.query.pinkid !== undefined)
      that.pinkId = that.$route.query.pinkid;
  },
  methods: {
    computedPrice() {
      postOrderComputed(this.orderGroupInfo.orderKey, {
        addressId: this.addressInfo.id,
        useIntegral: this.useIntegral ? 1 : 0,
        couponId: this.usableCoupon.id || 0
      }).then(res => {
        const data = res.data;
        if (data.status === "EXTEND_ORDER") {
          this.$router.replace({
            path: "/order/detail/" + data.result.orderId
          });
        } else {
          this.orderPrice = data.result;
        }
      });
    },
    getCartInfo() {
      const cartIds = this.$route.params.id;
      if (!cartIds) {
        this.$dialog.error("参数有误");
        return this.$router.go(-1);
      }

      postOrderConfirm(cartIds)
        .then(res => {
          this.offlinePayStatus = res.data.offline_pay_status;
          this.orderGroupInfo = res.data;
          this.deduction = res.data.deduction;
          this.usableCoupon = res.data.usableCoupon || {};
          this.addressInfo = res.data.addressInfo || {};
          this.computedPrice();
        })
        .catch(() => {
          this.$dialog.error("加载订单数据失败");
        });
    },
    addressTap: function() {
      this.showAddress = true;
      if (!this.addressLoaded) {
        this.addressLoaded = true;
        this.$refs.mychild.getAddressList();
      }
    },
    addressRedirect() {
      this.addressLoaded = false;
      this.showAddress = false;
    },
    couponTap: function() {
      this.showCoupon = true;
    },
    changeCoupon: function(coupon) {
      if (!coupon) {
        this.usableCoupon = { coupon_title: "不使用优惠券", id: 0 };
      } else {
        this.usableCoupon = coupon;
      }
      this.computedPrice();
    },
    payItem: function(index) {
      this.active = index;
    },
    changeAddress(addressInfo) {
      this.addressInfo = addressInfo;
    },
    createOrder() {
      if (!this.active) return this.$dialog.toast({ mes: "请选择支付方式" });
      if (!this.addressInfo.id)
        return this.$dialog.toast({ mes: "请选择收货地址" });
      this.$dialog.loading.open("生成订单中");
      createOrder(this.orderGroupInfo.orderKey, {
        addressId: this.addressInfo.id,
        useIntegral: this.useIntegral ? 1 : 0,
        couponId: this.usableCoupon.id || 0,
        payType: this.active,
        pinkId: this.pinkId,
        seckill_id: this.orderGroupInfo.seckill_id,
        combinationId: this.orderGroupInfo.combination_id,
        bargainId: this.orderGroupInfo.bargain_id,
        from: this.from,
        mark: this.mark || ""
      })
        .then(res => {
          this.$dialog.loading.close();
          const data = res.data;
          switch (data.status) {
            case "ORDER_EXIST":
            case "EXTEND_ORDER":
            case "PAY_DEFICIENCY":
            case "PAY_ERROR":
              this.$dialog.toast({ mes: res.msg });
              this.$router.replace({
                path: "/order/detail/" + data.result.orderId
              });
              break;
            case "SUCCESS":
              this.$dialog.success(res.msg);
              this.$router.replace({
                path: "/order/detail/" + data.result.orderId
              });
              break;
            case "WECHAT_H5_PAY":
              this.$router.replace({
                path: "/order/detail/" + data.result.orderId
              });
              setTimeout(() => {
                location.href = data.result.jsConfig.mweb_url;
              }, 100);
              break;
            case "WECHAT_PAY":
              pay(data.result.jsConfig).finally(() => {
                this.$router.replace({
                  path: "/order/detail/" + data.result.orderId
                });
              });
          }
        })
        .catch(err => {
          console.log(err);
          this.$dialog.loading.close();
          this.$dialog.error(err.msg || "创建订单失败");
        });
    }
  }
};
</script>
