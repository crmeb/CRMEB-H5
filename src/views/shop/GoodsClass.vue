<template>
  <div class="productSort">
    <form @submit.prevent="submitForm">
      <div class="header acea-row row-center-wrapper" ref="header">
        <div class="acea-row row-between-wrapper input">
          <span class="iconfont icon-sousuo"></span>
          <input type="text" placeholder="搜索商品信息" v-model="search" />
        </div>
      </div>
    </form>
    <div class="aside">
      <div
        class="item acea-row row-center-wrapper"
        :class="index === navActive ? 'on' : ''"
        v-for="(item, index) in category"
        :key="index"
        @click="asideTap(index)"
      >
        <span>{{ item.cate_name }}</span>
      </div>
    </div>
    <div class="conter" @scroll.native="onScroll">
      <div class="listw" v-for="(item, index) in category" :key="index">
        <div class="title acea-row row-center-wrapper" ref="title">
          <div class="line"></div>
          <div class="name">{{ item.cate_name }}</div>
          <div class="line"></div>
        </div>
        <div class="list acea-row">
          <router-link
            class="item acea-row row-column row-middle"
            v-for="(child, index) in item.children"
            :key="index"
            :to="{
              path: '/goods_list',
              query: { id: child.id, title: child.cate_name }
            }"
          >
            <div class="picture"><img :src="child.pic" /></div>
            <div class="name line1">{{ child.cate_name }}</div>
          </router-link>
        </div>
      </div>
    </div>
    <div style="height:1.2rem;"></div>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import { getCategory } from "@api/store";
import { trim } from "../../utils";

export default {
  name: "GoodsClass",
  components: {},
  props: {},
  data: function() {
    return {
      category: [],
      navActive: 0,
      search: "",
      lock: false
    };
  },
  watch: {
    "$route.params.pid": function(n) {
      console.log(n);
      if (n) {
        this.activeCateId(n);
      }
    }
  },
  mounted: function() {
    document.addEventListener("scroll", this.onScroll, false);
    this.loadCategoryData();
  },
  methods: {
    activeCateId(n) {
      let index = 0;
      n = parseInt(n);
      if (!n) return;
      this.category.forEach((cate, i) => {
        if (cate.id === n) index = i;
      });

      if (index !== this.navActive) {
        this.asideTap(index);
      }
    },
    loadCategoryData() {
      getCategory().then(res => {
        this.category = res.data;
        this.$nextTick(() => {
          if (this.$route.params.pid) this.activeCateId(this.$route.params.pid);
          else this.onScroll();
        });
      });
    },
    submitForm: function() {
      var val = trim(this.search);
      if (val) {
        this.$router.push({
          path: "/goods_list",
          query: { s: val }
        });
        setTimeout(() => (this.search = ""), 500);
      }
    },
    asideTap(index) {
      const top =
        this.$refs.title[index].offsetTop -
        this.$refs.header.offsetHeight -
        window.scrollY;

      this.lock = true;

      window.scrollBy({ top, left: 0, behavior: "smooth" });
      this.navActive = index;
    },
    onScroll: debounce(function() {
      if (this.lock) {
        this.lock = false;
        return;
      }
      const headerHeight = this.$refs.header.offsetHeight,
        { scrollY } = window,
        titles = this.$refs.title;
      titles.reduce((initial, title, index) => {
        if (initial) return initial;
        const parent = title.parentNode || title.parentElement;
        if (
          scrollY + headerHeight + 15 <
          title.offsetTop + parent.offsetHeight
        ) {
          initial = true;
          this.navActive = index;
        }
        // else if (innerHeight + scrollY + 15 > offsetHeight) {
        //   this.navActive = titles.length - 1;
        //   initial = true;
        // }
        return initial;
      }, false);
    }, 500)
  },
  beforeDestroy: function() {
    document.removeEventListener("scroll", this.onScroll, false);
  }
};
</script>
