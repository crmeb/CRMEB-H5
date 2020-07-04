<template>
  <div v-if="couponList.length > 0">
    <div class="coupon-window" :class="value ? 'on' : ''">
      <div class="couponWinList">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, index) in couponList"
          :key="index"
        >
          <div class="money font-color-red">
            <div>
              ￥<span class="num">{{ item.coupon_price }}</span>
            </div>
            <div class="pic-num">满{{ item.use_min_price }}元可用</div>
          </div>
          <div class="text acea-row row-between">
            <div class="pic acea-row row-column row-center">
              <div class="name line1">{{ item.title }}</div>
              <div v-if="item.end_time">
                {{ item.start_time ? item.start_time + "-" : ""
                }}{{ item.end_time }}
              </div>
            </div>
            <div class="type" v-if="item.type === 0">通用劵</div>
            <div class="type" v-else-if="item.type === 1">品类券</div>
            <div class="type" v-else>商品券</div>
          </div>
        </div>
        <div style="height:1.2rem"></div>
      </div>
      <div class="lid">
        <div class="bnt font-color-red" @click="checked">立即领取</div>
        <div class="iconfont icon-guanbi3" @click="close"></div>
      </div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="!value"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import toLogin from "@libs/login";
import { couponReceiveBatch } from "@api/user";

export default {
  name: "CouponWindow",
  props: {
    couponList: {
      type: Array,
      default: () => []
    }
  },
  computed: mapGetters(["isLogin"]),
  data: function() {
    return {
      value: true
    };
  },
  mounted: function() {},
  methods: {
    checked() {
      const isLogin = this.isLogin;
      if (!isLogin) return toLogin();

      const ids = this.couponList.reduce((initial, coupon) => {
        initial.push(coupon.id);
        return initial;
      }, []);
      couponReceiveBatch(ids)
        .then(() => {
          this.$emit("success");
          this.$dialog.toast({ mes: "领取成功" });
        })
        .catch(() => {
          this.$dialog.toast({ mes: "已领取" });
        });
      if (isLogin) {
        this.value = false;
        this.$emit("checked");
      }
    },
    close: function() {
      this.value = false;
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
.pic-num {
  color: #bbbbbb;
  font-size: 0.12rem;
}
</style>
