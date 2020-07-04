<template>
  <div>
    <div class="coupon-list-window" :class="coupon.coupon === true ? 'on' : ''">
      <div class="title">
        优惠券<span class="iconfont icon-guanbi" @click="close"></span>
      </div>
      <div class="coupon-list" v-if="coupon.list.length > 0">
        <div
          class="item acea-row row-center-wrapper"
          v-for="(item, index) in coupon.list"
          :key="index"
          @click="getCouponUser(index, item.id)"
        >
          <div class="money" :class="!item.is_use ? '' : 'moneyGray'">
            <div>
              ￥<span class="num">{{ item.coupon_price }}</span>
            </div>
            <div class="pic-num">满{{ item.use_min_price }}元可用</div>
          </div>
          <div class="text">
            <div class="condition line1">
              <span
                class="line-title"
                :class="!item.is_use ? 'bg-color-check' : 'bg-color-huic'"
                v-if="item.type === 0"
                >通用劵</span
              >
              <span
                class="line-title"
                :class="!item.is_use ? 'bg-color-check' : 'bg-color-huic'"
                v-else-if="item.type === 1"
                >品类券</span
              >
              <span
                class="line-title"
                :class="!item.is_use ? 'bg-color-check' : 'bg-color-huic'"
                v-else
                >商品券</span
              >
              <span>{{ item.title }}</span>
            </div>
            <div class="data acea-row row-between-wrapper">
              <div>
                {{ item.start_time ? item.start_time + "-" : ""
                }}{{ item.end_time }}
              </div>
              <div
                class="bnt acea-row row-center-wrapper"
                :class="!item.is_use ? 'bg-color-red' : 'gray'"
              >
                {{ !item.is_use ? "立即领取" : "已领取" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--无优惠券-->
      <div class="pictrue" v-else>
        <img src="@assets/images/noCoupon.png" class="image" />
      </div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      :hidden="coupon.coupon === false"
      @click="close"
    ></div>
  </div>
</template>
<script>
import { getCouponReceive } from "@api/user";
export default {
  name: "CouponPop",
  props: {
    coupon: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    close: function() {
      this.$emit("changeFun", { action: "changecoupon", value: false }); //$emit():注册事件；
    },
    getCouponUser: function(index, id) {
      let that = this,
        list = that.coupon.list;
      if (list[index].is_use === true) return;
      getCouponReceive(id)
        .then(function() {
          that.$dialog.toast({ mes: "已领取" });
          that.$set(list[index], "is_use", true);
          that.$emit("changefun", { action: "currentcoupon", value: index });
          that.$emit("changeFun", { action: "changecoupon", value: false });
        })
        .catch(function(res) {
          that.$dialog.toast({ mes: res.msg });
        });
    }
  }
};
</script>
<style scoped>
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
