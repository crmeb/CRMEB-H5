<template>
  <div ref="container">
    <div class="searchGood">
      <div class="search acea-row row-between-wrapper">
        <div class="input acea-row row-between-wrapper">
          <span class="iconfont icon-sousuo2"></span>
          <form @submit.prevent="submit"></form>
          <input type="text" placeholder="点击搜索商品" v-model="search" />
        </div>
        <div class="bnt" @click="submit">搜索</div>
      </div>
      <div v-if="keywords.length">
        <div class="title">热门搜索</div>
        <div class="list acea-row">
          <div
            class="item"
            v-for="key of keywords"
            :key="key"
            @click="toSearch(key)"
          >
            {{ key }}
          </div>
        </div>
      </div>
      <div class="line"></div>
      <GoodList :goodList="goodList" :isSort="false"></GoodList>
      <Loading
        :loaded="loadend"
        :loading="loading"
        v-if="goodList.length"
      ></Loading>
    </div>
    <div
      class="noCommodity"
      v-cloak
      v-if="goodList.length === 0 && where.page > 1"
    >
      <div class="noPictrue">
        <img src="@assets/images/noSearch.png" class="image" />
      </div>
      <recommend></recommend>
    </div>
  </div>
</template>
<script>
import Loading from "@components/Loading";
import GoodList from "@components/GoodList";
import { getSearchKeyword } from "@api/store";
import { trim } from "@utils";
import { getProducts } from "@api/store";
import Recommend from "@components/Recommend";
export default {
  name: "GoodSearch",
  components: {
    GoodList,
    Loading,
    Recommend
    // Recommend,
    // GoodList
  },
  props: {},
  data: function() {
    return {
      keywords: [],
      search: "",
      where: {
        page: 1,
        limit: 20,
        keyword: ""
      },
      loading: false,
      loadend: false,
      goodList: []
    };
  },
  mounted: function() {
    this.getData();
    this.$scroll(this.$refs.container, () => {
      console.log(123);
      !this.loading && this.getGoodlist();
    });
  },
  methods: {
    submit() {
      const search = trim(this.search) || "";
      if (!search) return;
      this.where.keyword = search;
      this.$set(this, "goodList", []);
      this.where.page = 1;
      this.loadend = false;
      this.loading = false;
      this.getGoodlist();
    },
    // toSearch(s) {
    //   this.$router.push({ path: "/goods_list", query: { s } });
    // },
    getData() {
      getSearchKeyword().then(res => {
        this.keywords = res.data;
      });
    },
    toSearch: function(key) {
      this.where.keyword = key;
      this.$set(this, "goodList", []);
      this.where.page = 1;
      this.loadend = false;
      this.loading = false;
      this.getGoodlist();
    },
    getGoodlist: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = that.where;
      getProducts(q).then(res => {
        that.loading = false;
        that.goodList.push.apply(that.goodList, res.data);
        that.loadend = res.data.length < that.where.limit; //判断所有数据是否加载完成；
        that.where.page = that.where.page + 1;
      });
    }
  }
};
</script>
<style scoped>
.noCommodity {
  border-top: 0.05rem solid #f5f5f5;
}
</style>
