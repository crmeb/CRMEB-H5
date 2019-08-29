<template>
  <div class="orderGoods">
    <div class="total">共{{ cartInfo.length }}件商品</div>
    <div class="goodWrapper">
      <div
        class="item acea-row row-between-wrapper"
        v-for="cart in cartInfo"
        :key="cart.id"
      >
        <div class="pictrue">
          <img :src="cart.productInfo.image" class="image" />
        </div>
        <div class="text">
          <div class="acea-row row-between-wrapper">
            <div class="name line1">{{ cart.productInfo.store_name }}</div>
            <div class="num">x {{ cart.cart_num }}</div>
          </div>
          <div class="attr line1" v-if="cart.productInfo.attrInfo">
            {{ cart.productInfo.attrInfo.suk }}
          </div>
          <div class="money font-color-red">￥{{ cart.truePrice }}</div>
          <div
            class="evaluate"
            v-if="evaluate === 3"
            @click="$router.push({ path: '/goods_evaluate/' + cart.unique })"
          >
            评价
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderGoods",
  props: {
    evaluate: Number,
    cartInfo: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {}
};
</script>
