<template>
  <div class="goodList">
    <router-link
      :to="{ path: '/detail/' + item.id }"
      class="item acea-row row-between-wrapper"
      v-for="(item, index) in goodList"
      :key="index"
    >
      <div class="pictrue">
        <img :src="item.image" class="image" />
        <img
          src="@assets/images/one.png"
          class="numPic"
          v-if="isSort === true && index === 0"
        />
        <img
          src="@assets/images/two.png"
          class="numPic"
          v-if="isSort === true && index === 1"
        />
        <img
          src="@assets/images/three.png"
          class="numPic"
          v-if="isSort === true && index === 2"
        />
      </div>
      <div class="underline">
        <div class="text">
          <div class="line1">{{ item.store_name }}</div>
          <div class="money font-color-red">
            ￥<span class="num">{{ item.price }}</span>
          </div>
          <div class="vip-money acea-row row-middle">
            <div class="vip" v-if="item.vip_price && item.vip_price > 0">
              ￥{{ item.vip_price || 0
              }}<img src="@assets/images/vip.png" class="image" />
            </div>
            <span class="num">已售{{ item.sales }}{{ item.unit_name }}</span>
          </div>
        </div>
      </div>
      <div
        class="iconfont icon-gouwuche cart-color acea-row row-center-wrapper"
      ></div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "GoodList",
  props: {
    goodList: {
      type: Array,
      default: () => []
    },
    isSort: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {};
  }
};
</script>
