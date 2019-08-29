<template>
  <div class="promotionGood" v-if="benefit.length > 0">
    <router-link
      :to="{ path: '/detail/' + item.id }"
      class="item acea-row row-between-wrapper"
      v-for="(item, index) in benefit"
      :key="index"
    >
      <div class="pictrue">
        <img :src="item.image" class="image" />
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
    </router-link>
  </div>
</template>
<script>
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
  }
};
</script>
