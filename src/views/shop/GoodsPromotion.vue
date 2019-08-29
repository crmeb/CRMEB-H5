<template>
  <div class="quality-recommend">
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
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import PromotionGood from "@components/PromotionGood";
import { getGroomList } from "@api/store";
export default {
  name: "GoodsPromotion",
  components: {
    swiper,
    swiperSlide,
    PromotionGood
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
      }
    };
  },
  mounted: function() {
    this.getIndexGroomList();
  },
  methods: {
    getIndexGroomList: function() {
      let that = this;
      getGroomList(4)
        .then(res => {
          that.imgUrls = res.data.banner;
          that.goodsList = res.data.list;
        })
        .catch(function(res) {
          this.$dialog.toast({ mes: res.msg });
        });
    }
  }
};
</script>
