<template>
  <div ref="container">
    <div class="coupon-list" v-if="couponsList.length > 0">
      <div
        class="item acea-row row-center-wrapper"
        v-for="(item, index) in couponsList"
        :key="index"
      >
        <div class="money" :class="item.is_use ? 'moneyGray' : ''">
          ￥<span class="num">{{ item.coupon_price }}</span>
        </div>
        <div class="text">
          <div class="condition line1">
            购物满{{ item.use_min_price }}元可用
          </div>
          <div class="data acea-row row-between-wrapper">
            <div v-if="item.end_time !== 0">
              {{ item.start_time ? item.start_time + "-" : ""
              }}{{ item.end_time }}
            </div>
            <div v-else>不限时</div>
            <div class="bnt gray" v-if="item.is_use === true">已领取</div>
            <div class="bnt gray" v-else-if="item.is_use === 2">已领完</div>
            <div
              class="bnt bg-color-red"
              v-else
              @click="getCoupon(item.id, index)"
            >
              立即领取
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <!--暂无优惠券-->
    <div
      class="noCommodity"
      v-cloak
      v-if="couponsList.length === 0 && page > 1"
    >
      <div class="noPictrue">
        <img src="@assets/images/noCoupon.png" class="image" />
      </div>
    </div>
  </div>
</template>
<script>
import { getCoupon, getCouponReceive } from "@api/user";
import Loading from "@components/Loading";
export default {
  name: "getCoupon",
  components: {
    Loading
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 10,
      couponsList: [],
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.getUseCoupons();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getUseCoupons();
    });
  },
  methods: {
    getCoupon: function(id, index) {
      let that = this;
      let list = that.couponsList;
      getCouponReceive(id)
        .then(function() {
          list[index].is_use = true;
          that.$dialog.toast({ mes: "领取成功" });
        })
        .catch(function(res) {
          that.$dialog.toast({ mes: res.msg });
        });
    },
    getUseCoupons: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = { page: that.page, limit: that.limit };
      getCoupon(q).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.couponsList.push.apply(that.couponsList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
