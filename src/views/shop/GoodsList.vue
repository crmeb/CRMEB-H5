<template>
  <div class="productList" ref="container">
    <form @submit.prevent="submitForm">
      <div class="search bg-color-red acea-row row-between-wrapper">
        <div class="input acea-row row-between-wrapper">
          <span class="iconfont icon-sousuo"></span>
          <input placeholder="搜索商品信息" v-model="where.keyword" />
        </div>
        <div
          class="iconfont"
          :class="Switch === true ? 'icon-pailie' : 'icon-tupianpailie'"
          @click="switchTap"
        ></div>
      </div>
    </form>
    <div class="nav acea-row row-middle">
      <div
        class="item"
        :class="title ? 'font-color-red' : ''"
        @click="set_where(0)"
      >
        {{ title ? title : "默认" }}
      </div>
      <div class="item" @click="set_where(1)">
        价格
        <img src="@assets/images/horn.png" v-if="price === 0" />
        <img src="@assets/images/up.png" v-if="price === 1" />
        <img src="@assets/images/down.png" v-if="price === 2" />
      </div>
      <div class="item" @click="set_where(2)">
        销量
        <img src="@assets/images/horn.png" v-if="stock === 0" />
        <img src="@assets/images/up.png" v-if="stock === 1" />
        <img src="@assets/images/down.png" v-if="stock === 2" />
      </div>
      <!-- down -->
      <div
        class="item"
        :class="nows ? 'font-color-red' : ''"
        @click="set_where(3)"
      >
        新品
      </div>
    </div>
    <div
      class="list acea-row row-between-wrapper"
      :class="Switch === true ? '' : 'on'"
      ref="container"
    >
      <router-link
        :to="{
          path: '/detail/' + item.id
        }"
        class="item"
        :class="Switch === true ? '' : 'on'"
        v-for="(item, index) in productList"
        :key="index"
        :title="item.store_name"
      >
        <div class="pictrue" :class="Switch === true ? '' : 'on'">
          <img :src="item.image" :class="Switch === true ? '' : 'on'" />
        </div>
        <div class="text" :class="Switch === true ? '' : 'on'">
          <div class="name line1">{{ item.store_name }}</div>
          <div
            class="money font-color-red"
            :class="Switch === true ? '' : 'on'"
          >
            ￥<span class="num">{{ item.price }}</span>
          </div>
          <div
            class="vip acea-row row-between-wrapper"
            :class="Switch === true ? '' : 'on'"
          >
            <div class="vip-money" v-if="item.vip_price && item.vip_price > 0">
              ￥{{ item.vip_price }}<img src="@assets/images/vip.png" />
            </div>
            <div>已售{{ item.sales }}件</div>
          </div>
        </div>
      </router-link>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <div
      class="noCommodity"
      v-cloak
      style="background-color: #fff;"
      v-if="productList.length === 0 && where.page > 1"
    >
      <div class="noPictrue">
        <img src="@assets/images/noGood.png" class="image" />
      </div>
    </div>
    <Recommend v-if="productList.length === 0 && where.page > 1"></Recommend>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import { getProducts } from "@api/store";
import debounce from "lodash.debounce";
import Loading from "@components/Loading";

export default {
  name: "GoodsList",
  components: {
    Recommend,
    Loading
  },
  props: {},
  data: function() {
    const { s = "", id = 0, title = "" } = this.$route.query;

    return {
      hostProduct: [],
      productList: [],
      Switch: true,
      where: {
        page: 1,
        limit: 8,
        keyword: s,
        sid: id, //二级分类id
        news: 0,
        priceOrder: "",
        salesOrder: ""
      },
      title: title && id ? title : "",
      loadTitle: "",
      loading: false,
      loadend: false,
      price: 0,
      stock: 0,
      nows: false
    };
  },
  watch: {
    title() {
      this.updateTitle();
    },
    $route(to) {
      if (to.name !== "GoodsList") return;
      const { s = "", id = 0, title = "" } = to.query;

      if (s !== this.where.keyword || id !== this.where.sid) {
        this.where.keyword = s;
        this.loadend = false;
        this.loading = false;
        this.where.page = 1;
        this.where.sid = id;
        this.title = title && id ? title : "";
        this.nows = false;
        this.$set(this, "productList", []);
        this.price = 0;
        this.stock = 0;
        this.get_product_list();
      }
    }
  },
  mounted: function() {
    this.updateTitle();
    this.get_product_list();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.get_product_list();
    });
  },
  methods: {
    updateTitle() {
      document.title = this.title || this.$route.meta.title;
    },
    get_product_list: debounce(function() {
      var that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      this.setWhere();
      let q = that.where;
      getProducts(q).then(res => {
        that.loading = false;
        that.productList.push.apply(that.productList, res.data);
        that.loadend = res.data.length < that.where.limit; //判断所有数据是否加载完成；
        that.where.page = that.where.page + 1;
      });
    }, 300),
    submitForm: function() {
      this.$set(this, "productList", []);
      this.where.page = 1;
      this.loadend = false;
      this.loading = false;
      this.get_product_list();
    },
    //点击事件处理
    set_where: function(index) {
      let that = this;
      switch (index) {
        case 0:
          return that.$router.push({ path: "/category" });
        case 1:
          if (that.price === 0) that.price = 1;
          else if (that.price === 1) that.price = 2;
          else if (that.price === 2) that.price = 0;
          that.stock = 0;
          break;
        case 2:
          if (that.stock === 0) that.stock = 1;
          else if (that.stock === 1) that.stock = 2;
          else if (that.stock === 2) that.stock = 0;
          that.price = 0;
          break;
        case 3:
          that.nows = !that.nows;
          break;
        default:
          break;
      }
      that.$set(that, "productList", []);
      that.where.page = 1;
      that.loadend = false;
      that.get_product_list();
    },
    //设置where条件
    setWhere: function() {
      let that = this;
      if (that.price === 0) {
        that.where.priceOrder = "";
      } else if (that.price === 1) {
        that.where.priceOrder = "asc";
      } else if (that.price === 2) {
        that.where.priceOrder = "desc";
      }
      if (that.stock === 0) {
        that.where.salesOrder = "";
      } else if (that.stock === 1) {
        that.where.salesOrder = "asc";
      } else if (that.stock === 2) {
        that.where.salesOrder = "desc";
      }
      that.where.news = that.nows ? "1" : "0";
    },
    switchTap: function() {
      let that = this;
      that.Switch = !that.Switch;
    }
  }
};
</script>
<style scoped>
.noCommodity {
  border-top: 3px solid #f5f5f5;
  padding-bottom: 1px;
}
</style>
