<template>
  <div class="newsDetail">
    <div class="title">{{ articleInfo.title }}</div>
    <div class="list acea-row row-middle">
      <div class="label cart-color line1">{{ articleInfo.cart_name }}</div>
      <div class="item">
        <span class="iconfont icon-shenhezhong"></span
        >{{ articleInfo.add_time }}
      </div>
      <div class="item">
        <span class="iconfont icon-liulan"></span>{{ articleInfo.visit }}
      </div>
    </div>
    <div class="conter" v-html="articleInfo.content"></div>
  </div>
</template>
<script>
import { getArticleDetails } from "@api/public";
export default {
  name: "NewsDetail",
  components: {},
  props: {},
  data: function() {
    return {
      articleInfo: {}
    };
  },
  watch: {
    $route(to) {
      if (to.name === "NewsDetail") this.articleDetails();
    }
  },
  mounted: function() {
    this.articleDetails();
  },
  methods: {
    updateTitle() {
      document.title = this.articleInfo.title || this.$route.meta.title;
    },
    articleDetails: function() {
      let that = this,
        id = this.$route.params.id;
      getArticleDetails(id).then(res => {
        that.articleInfo = res.data;
        that.updateTitle();
      });
    }
  }
};
</script>
