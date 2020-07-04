<template>
  <div class="quality-recommend" ref="container">
    <div class="slider-banner swiper">
      <swiper class="swiper-wrapper" :options="RecommendSwiper">
        <swiperSlide
          class="swiper-slide"
          v-for="(item, index) in imgUrls"
          :key="index"
        >
          <img :src="item.img" class="slide-image" />
        </swiperSlide>
      </swiper>
      <div class="swiper-pagination"></div>
    </div>
    <div class="title acea-row row-center-wrapper">
      <div class="line"></div>
      <div class="name">
        <span class="iconfont" :class="icon"></span>{{ name }}
      </div>
      <div class="line"></div>
    </div>
    <GoodList :good-list="goodsList" :is-sort="false"></GoodList>
    <Loading :loadend="loadend" :loading="loading"></Loading>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import GoodList from "@components/GoodList";
import Loading from "@components/Loading";
import { getGroomList } from "@api/store";
export default {
  name: "HotNewGoods",
  components: {
    swiper,
    swiperSlide,
    GoodList,
    Loading
  },
  props: {},
  data: function() {
    return {
      imgUrls: [],
      goodsList: [],
      name: "",
      icon: "",
      RecommendSwiper: {
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
      },
      page: 1,
      limit: 20,
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.titleInfo();
    this.getIndexGroomList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getIndexGroomList();
    });
  },
  methods: {
    titleInfo: function() {
      let type = this.$route.params.type;
      if (type === "1") {
        this.name = "精品推荐";
        this.icon = "icon-jingpintuijian";
        document.title = "精品推荐";
      } else if (type === "2") {
        this.name = "热门榜单";
        this.icon = "icon-remen";
        document.title = "热门榜单";
      } else if (type === "3") {
        this.name = "首发新品";
        this.icon = "icon-xinpin";
        document.title = "首发新品";
      }
    },
    getIndexGroomList: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let type = this.$route.params.type;
      let q = { page: that.page, limit: that.limit };
      getGroomList(type, q)
        .then(res => {
          that.loading = false;
          that.imgUrls = res.data.banner;
          //apply();js将一个数组插入另一个数组;
          that.goodsList.push.apply(that.goodsList, res.data.list);
          that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
          that.page = that.page + 1;
        })
        .catch(res => {
          this.$dialog.toast({ mes: res.msg });
        });
    }
  }
};
</script>
