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
              <div>
                ￥<span class="num">{{ coupon.coupon_price }}</span>
              </div>
              <div class="pic-num">满{{ coupon.use_min_price }}元可用</div>
            </div>
            <div class="text">
              <div class="condition line1">
                <span class="line-title" v-if="coupon.type === 0">通用劵</span>
                <span class="line-title" v-else-if="coupon.type === 1"
                  >品类券</span
                >
                <span class="line-title" v-else>商品券</span>
                <span>{{ coupon.title }}</span>
              </div>
              <div class="data acea-row row-between-wrapper">
                <div>
                  {{ coupon.start_time ? coupon.start_time + "-" : ""
                  }}{{ coupon.end_time }}
                </div>
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
.condition .line-title {
  width: 0.9rem;
  padding: 0 0.1rem;
  box-sizing: border-box;
  background: rgba(255, 247, 247, 1);
  border: 1px solid rgba(232, 51, 35, 1);
  opacity: 1;
  border-radius: 0.22rem;
  font-size: 0.2rem;
  color: #e83323;
  margin-right: 0.12rem;
}
.coupon-list .pic-num {
  color: #ffffff;
  font-size: 0.24rem;
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
    },
    cartid: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      couponList: [],
      loaded: false,
      cartids: this.cartid
    };
  },
  watch: {
    cartid(n) {
      if (n === undefined || n == null) return;
      this.cartids = n;
      this.getCoupon();
    },
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
      let data = {
        cartId: this.cartids
      };
      getOrderCoupon(this.price, data)
        .then(res => {
          this.couponList = res.data;
          this.loaded = true;
        })
        .catch(err => {
          this.$dialog.error(err.msg);
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
