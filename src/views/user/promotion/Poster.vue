<template>
  <div class="distribution-posters">
    <div class="slider-banner banner">
      <swiper class="swiper-wrapper" :options="swiperPosters" ref="mySwiper">
        <swiperSlide
          class="swiper-slide"
          v-for="(item, index) in info"
          :key="index"
        >
          <img class="slide-image" :src="item.wap_poster" />
        </swiperSlide>
      </swiper>
    </div>
    <div class="keep bg-color-red" @click="saveImg">保存海报</div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import { getSpreadImg } from "../../../api/user";
export default {
  name: "Poster",
  components: {
    swiper,
    swiperSlide
  },
  props: {},
  data: function() {
    return {
      swiperPosters: {
        speed: 1000,
        effect: "coverflow",
        slidesPerView: "auto",
        centeredSlides: true,
        coverflowEffect: {
          rotate: 0, // 旋转的角度
          stretch: -20, // 拉伸   图片间左右的间距和密集度
          depth: 100, // 深度   切换图片间上下的间距和密集度
          modifier: 3, // 修正值 该值越大前面的效果越明显
          slideShadows: false // 页面阴影效果
        },
        observer: true,
        observeParents: true
      },
      info: [],
      activeIndex: 0
    };
  },
  mounted: function() {
    this.getIndex();
    let that = this;
    this.swiper.on("slideChange", function() {
      that.activeIndex = that.swiper.activeIndex;
    });
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    getIndex: function() {
      let that = this;
      getSpreadImg().then(
        res => {
          that.info = res.data;
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    },
    downloadIamge: function(imgsrc, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    saveImg: function() {
      console.log(this.info[this.activeIndex].wap_poster);
      this.downloadIamge(
        this.info[this.activeIndex].wap_poster,
        "poster" + this.activeIndex
      );
    }
  }
};
</script>
