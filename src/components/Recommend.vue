<template>
  <div class="recommend" ref="container">
    <div class="title acea-row row-center-wrapper">
      <span class="iconfont icon-zhuangshixian"></span>
      <span class="name">为你推荐</span>
      <span class="iconfont icon-zhuangshixian lefticon"></span>
    </div>
    <div class="recommendList acea-row row-between-wrapper">
      <div
        @click="goDetail(item)"
        v-for="(item, index) in hostProduct"
        :key="index"
        class="item"
      >
        <div class="pictrue">
          <img v-lazy="item.image" alt="img" class="image" />
          <span
            class="pictrue_log_big pictrue_log_class"
            v-if="item.activity && item.activity.type === '1'"
            >秒杀</span
          >
          <span
            class="pictrue_log_big pictrue_log_class"
            v-if="item.activity && item.activity.type === '2'"
            >砍价</span
          >
          <span
            class="pictrue_log_big pictrue_log_class"
            v-if="item.activity && item.activity.type === '3'"
            >拼团</span
          >
        </div>
        <div class="name line1">{{ item.store_name }}</div>
        <div class="money font-color-red">
          ￥<span class="num">{{ item.price }}</span>
        </div>
      </div>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
  </div>
</template>
<script>
import { getHostProducts } from "@api/store";
import Loading from "@components/Loading";
import { goShopDetail } from "@libs/order";
export default {
  name: "Recommend",
  props: {},
  components: {
    Loading
  },
  data: function() {
    return {
      hostProduct: [],
      page: 1,
      limit: 20,
      loadTitle: "",
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.hostProducts();
    this.$scroll(this.$refs.container.parentElement, () => {
      !this.loading && this.hostProducts();
    });
  },
  methods: {
    // 商品详情跳转
    goDetail(item) {
      goShopDetail(item).then(() => {
        this.$router.push({ path: "/detail/" + item.id });
      });
    },
    hostProducts: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      getHostProducts(that.page, that.limit).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.hostProduct.push.apply(that.hostProduct, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
