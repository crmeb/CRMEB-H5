<template>
  <div class="promotionGood" v-if="benefit.length > 0">
    <!--<router-link-->
    <!--:to="{ path: '/detail/' + item.id }"-->
    <!--class="item acea-row row-between-wrapper"-->
    <!--v-for="(item, index) in benefit"-->
    <!--:key="index"-->
    <!--&gt;-->
    <div
      @click="goDetail(item)"
      v-for="(item, index) in benefit"
      :key="index"
      class="item acea-row row-between-wrapper"
    >
      <div class="pictrue">
        <img v-lazy="item.image" alt="img" class="image" />
        <span
          class="pictrue_log pictrue_log_class"
          v-if="item.activity && item.activity.type === '1'"
          >秒杀</span
        >
        <span
          class="pictrue_log pictrue_log_class"
          v-if="item.activity && item.activity.type === '2'"
          >砍价</span
        >
        <span
          class="pictrue_log pictrue_log_class"
          v-if="item.activity && item.activity.type === '3'"
          >拼团</span
        >
      </div>
      <div class="text">
        <div class="name line1">{{ item.store_name }}</div>
        <div class="sp-money acea-row">
          <div class="moneyCon">
            促销价: ￥<span class="num">{{ item.price }}</span>
          </div>
        </div>
        <div class="acea-row row-between-wrapper">
          <div class="money">日常价：￥{{ item.ot_price }}</div>
          <div>仅剩：{{ item.stock }}{{ item.unit_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { goShopDetail } from "@libs/order";
export default {
  name: "PromotionGood",
  props: {
    benefit: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {};
  },
  methods: {
    // 商品详情跳转
    goDetail(item) {
      goShopDetail(item).then(() => {
        this.$router.push({ path: "/detail/" + item.id });
      });
    }
  }
};
</script>
