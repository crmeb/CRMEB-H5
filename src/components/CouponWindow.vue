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
            ￥<span class="num">{{ item.coupon_price }}</span>
          </div>
          <div class="text">
            <div class="name">
              购物买{{ item.use_min_price }}减{{ item.coupon_price }}
            </div>
            <div v-if="item.end_time">
              {{ item.start_time ? item.start_time + "-" : ""
              }}{{ item.end_time }}
            </div>
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
