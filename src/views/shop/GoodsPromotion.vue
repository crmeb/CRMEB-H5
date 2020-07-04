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
        <span class="iconfont icon-cuxiaoguanli"></span>促销单品
      </div>
      <div class="line"></div>
    </div>
    <Promotion-good :benefit="goodsList"></Promotion-good>
    <Loading :loadend="loadend" :loading="loading"></Loading>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import PromotionGood from "@components/PromotionGood";
import Loading from "@components/Loading";
import { getGroomList } from "@api/store";
export default {
  name: "GoodsPromotion",
  components: {
    swiper,
    swiperSlide,
    PromotionGood,
    Loading
  },
  props: {},
  data: function() {
    return {
      imgUrls: [],
      goodsList: [],
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
    this.getIndexGroomList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getIndexGroomList();
    });
  },
  methods: {
    getIndexGroomList: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = { page: that.page, limit: that.limit };
      getGroomList(4, q)
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
