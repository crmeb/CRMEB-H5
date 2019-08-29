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
        <span class="iconfont" :class="icon"></span>{{ name }}
      </div>
      <div class="line"></div>
    </div>
    <GoodList :good-list="goodsList" :is-sort="false"></GoodList>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import GoodList from "@components/GoodList";
import { getGroomList } from "@api/store";
export default {
  name: "HotNewGoods",
  components: {
    swiper,
    swiperSlide,
    GoodList
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
      }
    };
  },
  mounted: function() {
    this.titleInfo();
    this.getIndexGroomList();
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
      let type = this.$route.params.type;
      console.log(type);
      getGroomList(type)
        .then(res => {
          that.imgUrls = res.data.banner;
          that.goodsList = res.data.list;
          console.log(res.data.list);
        })
        .catch(function(res) {
          this.$dialog.toast({ mes: res.msg });
        });
    }
  }
};
</script>
