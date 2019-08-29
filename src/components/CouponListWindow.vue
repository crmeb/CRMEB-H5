<template>
  <div>
    <div class="coupon-list-window" :class="value === true ? 'on' : ''">
      <div class="title">
        优惠券
        <span class="iconfont icon-guanbi" @click="close"></span>
      </div>
      <div v-if="couponList.length > 0">
        <div class="coupon-list">
          <div
            class="item acea-row row-center-wrapper"
            v-for="coupon in couponList"
            :key="coupon.id"
            @click="click(coupon)"
          >
            <div class="money">
              ￥
              <span class="num">{{ coupon.coupon_price }}</span>
            </div>
            <div class="text">
              <div class="condition line1">{{ coupon.coupon_title }}</div>
              <div class="data acea-row row-between-wrapper">
                <div v-if="coupon.end_time === 0">不限时</div>
                <div v-else>{{ coupon.add_time }}-{{ coupon.end_time }}</div>
                <div
                  class="iconfont icon-xuanzhong1 font-color-red"
                  v-if="checked === coupon.id"
                ></div>
                <div class="iconfont icon-weixuanzhong" v-else></div>
              </div>
            </div>
          </div>
        </div>
        <div class="couponNo bg-color-red" @click="couponNo">不使用优惠券</div>
      </div>
      <div v-if="!couponList.length && loaded">
        <div class="pictrue">
          <img src="@assets/images/noCoupon.png" class="image" />
        </div>
      </div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      :hidden="value === false"
      @click="close"
    ></div>
  </div>
</template>
<style scoped>
.coupon-list-window .iconfont {
  font-size: 0.4rem;
}
.couponNo {
  font-size: 0.3rem;
  font-weight: bold;
  color: #fff;
  width: 6.9rem;
  height: 0.86rem;
  border-radius: 0.43rem;
  text-align: center;
  line-height: 0.86rem;
  margin: 0.6rem auto;
}
</style>
<script>
import { getOrderCoupon } from "@api/order";

export default {
  name: "CouponListWindow",
  props: {
    value: Boolean,
    checked: Number,
    price: {
      type: [Number, String],
      default: undefined
    }
  },
  data: function() {
    return {
      couponList: [],
      loaded: false
    };
  },
  watch: {
    price(n) {
      if (n === undefined || n == null) return;
      this.getCoupon();
    }
  },
  mounted: function() {},
  methods: {
    close: function() {
      this.$emit("input", false);
      this.$emit("close");
    },
    getCoupon() {
      getOrderCoupon(this.price).then(res => {
        this.couponList = res.data;
        this.loaded = true;
      });
    },
    click(coupon) {
      this.$emit("checked", coupon);
      this.$emit("input", false);
    },
    couponNo: function() {
      this.$emit("checked", null);
      this.$emit("input", false);
    }
  }
};
</script>
