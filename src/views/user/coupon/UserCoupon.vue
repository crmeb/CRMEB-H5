<template>
  <div ref="container">
    <div class="coupon-list" v-if="couponsList.length > 0">
      <div
        class="item acea-row row-center-wrapper"
        v-cloak
        v-for="(item, index) in couponsList"
        :key="index"
      >
        <div class="money" :class="item._type === 0 ? 'moneyGray' : ''">
          ￥<span class="num">{{ item.coupon_price }}</span>
        </div>
        <div class="text">
          <div class="condition line1">{{ item.coupon_title }}</div>
          <div class="data acea-row row-between-wrapper">
            <div v-if="item._end_time === 0">不限时</div>
            <div v-else>{{ item._add_time }}-{{ item._end_time }}</div>
            <div class="bnt gray" v-if="item._type === 0">{{ item._msg }}</div>
            <div class="bnt bg-color-red" v-else>{{ item._msg }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--暂无优惠券-->
    <div
      class="noCommodity"
      v-if="couponsList.length === 0 && loading === true"
    >
      <div class="noPictrue">
        <img src="@assets/images/noCoupon.png" class="image" />
      </div>
    </div>
  </div>
</template>
<script>
import { getCouponsUser } from "@api/user";
const NAME = "UserCoupon";

export default {
  name: "UserCoupon",
  components: {},
  props: {},
  data: function() {
    return {
      couponsList: [],
      loading: false
    };
  },
  watch: {
    $route: function(n) {
      var that = this;
      if (n.name === NAME) {
        that.getUseCoupons();
      }
    }
  },
  mounted: function() {
    this.getUseCoupons();
  },
  methods: {
    getUseCoupons: function() {
      let that = this,
        type = 0;
      getCouponsUser(type).then(res => {
        that.couponsList = res.data;
        that.loading = true;
      });
    }
  }
};
</script>
