<template>
  <div class="newsList" ref="container">
    <div class="slider-banner swiperNews" v-if="imgUrls.length > 0">
      <swiper class="swiper-wrapper" :options="swiperNew">
        <swiperSlide
          class="swiper-slide"
          v-for="(item, index) in imgUrls"
          :key="index"
        >
          <img :src="item.image_input[0]" class="slide-image" />
        </swiperSlide>
      </swiper>
      <div class="swiper-pagination"></div>
    </div>
    <Tabs
      @click="onClick"
      class="newsSwitch"
      line-height="0.04rem"
      line-width="0.24rem"
      color="#e93323"
      v-model="active"
      animated
      title-inactive-color="2"
      nav-right="0.46rem"
      sticky
    >
      <Tab
        v-for="(item, index) in navLsit"
        :key="index"
        :title="item.title"
        title-inactive-color="#999"
        title-active-color="#282828"
      >
        <div class="list" v-for="(item, index) in articleList" :key="index">
          <router-link
            :to="{ path: '/news_detail/' + item.id }"
            class="item acea-row row-between-wrapper"
            v-if="item.image_input.length === 1"
          >
            <div class="text acea-row row-column-between">
              <div class="name line2">{{ item.title }}</div>
              <div>{{ item.add_time }}</div>
            </div>
            <div class="pictrue"><img :src="item.image_input[0]" /></div>
          </router-link>
          <router-link
            :to="{ path: '/news_detail/' + item.id }"
            class="item"
            v-if="item.image_input.length === 2"
          >
            <div class="title line1">
              {{ item.title }}
            </div>
            <div class="picList acea-row row-between-wrapper">
              <div
                class="pictrue"
                v-for="(itemImg, index) in item.image_input"
                :key="index"
              >
                <img :src="itemImg" />
              </div>
            </div>
            <div class="time">{{ item.add_time }}</div>
          </router-link>
          <router-link
            :to="{ path: '/news_detail/' + item.id }"
            class="item"
            v-if="item.image_input.length === 3"
          >
            <div class="title line1">
              {{ item.title }}
            </div>
            <div class="picList on acea-row row-between-wrapper">
              <div
                class="pictrue"
                v-for="(itemImg, index) in item.image_input"
                :key="index"
              >
                <img :src="itemImg" />
              </div>
            </div>
            <div class="time">{{ item.add_time }}</div>
          </router-link>
        </div>
        <Loading
          :loaded="loadend"
          :loading="loading"
          v-if="index > 0 && articleList.length > 0"
        ></Loading>
        <!--暂无新闻-->
        <div class="noCommodity" v-if="articleList.length === 0 && page > 1">
          <div class="noPictrue">
            <img src="@assets/images/noNews.png" class="image" />
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import { Tab, Tabs } from "vant";
import {
  getArticleBanner,
  getArticleCategory,
  getArticleHotList,
  getArticleList
} from "@api/public";
import Loading from "@components/Loading";

export default {
  name: "NewsList",
  components: {
    swiper,
    swiperSlide,
    Tab,
    Tabs,
    Loading
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 20,
      loadTitle: "",
      loading: false,
      loadend: false,
      imgUrls: [],
      navLsit: [],
      articleList: [],
      active: 0,
      cid: 0,
      swiperNew: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      }
    };
  },
  mounted: function() {
    this.articleBanner();
    this.articleCategory();
    this.articleHotList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getArticleLists();
    });
  },
  methods: {
    articleBanner: function() {
      let that = this;
      getArticleBanner().then(res => {
        that.imgUrls = res.data;
      });
    },
    articleCategory: function() {
      let that = this;
      getArticleCategory().then(res => {
        that.navLsit = res.data;
      });
    },
    articleHotList: function() {
      let that = this;
      getArticleHotList().then(res => {
        that.articleList = res.data;
      });
    },
    getArticleLists: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = {
        page: that.page,
        limit: that.limit
      };
      getArticleList(q, that.cid).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.articleList.push.apply(that.articleList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    },
    onClick: function(name) {
      if (name === 0) this.articleHotList();
      else {
        this.cid = this.navLsit[name].id;
        this.articleList = [];
        this.page = 1;
        this.loadend = false;
        this.loading = false;
        this.getArticleLists(name);
      }
    }
  }
};
</script>
