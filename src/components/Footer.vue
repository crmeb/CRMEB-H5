<template>
  <div id="footer" class="acea-row row-middle">
    <router-link
      :to="item.url"
      class="item"
      :class="{ on: item.url === $route.path }"
      v-for="(item, index) in footerList"
      :key="index"
    >
      <div
        class="iconfont"
        :class="item.icon1 + ' ' + (item.url === $route.path ? item.icon2 : '')"
      ></div>
      <div>{{ item.name }}</div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "Footer",
  props: {},
  data: function() {
    return {
      footerList: [
        {
          name: "首页",
          icon1: "icon-shouye-xianxing",
          icon2: "icon-shouye",
          url: "/"
        },
        {
          name: "分类",
          icon1: "icon-yingyongchengxu-xianxing",
          icon2: "icon-yingyongchengxu",
          url: "/category"
        },
        {
          name: "购物车",
          icon1: "icon-caigou-xianxing",
          icon2: "icon-caigou",
          url: "/cart"
        },
        {
          name: "我的",
          icon1: "icon-yonghu-xianxing",
          icon2: "icon-yonghu",
          url: "/user"
        }
      ]
    };
  },
  methods: {}
};
</script>
