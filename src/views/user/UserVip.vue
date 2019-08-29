<template>
  <div class="member-center">
    <div class="header">
      <div class="slider-banner banner">
        <swiper class="swiper-wrapper" :options="swiperVip" ref="mySwiper">
          <swiperSlide
            class="swiper-slide memberBg"
            :class="item.class"
            v-for="(item, index) in vipList"
            :key="index"
            :style="{ backgroundImage: 'url(' + item.image + ')' }"
          >
            <!--            <img :src="item.icon" />-->
            <div class="name">{{ item.name }}</div>
            <div class="discount">
              可享受商品折扣: {{ item.discount / 10 }}折<span
                class="iconfont icon-zhekou"
              ></span>
            </div>
            <div class="nav acea-row" v-if="item.grade == grade">
              <div
                class="item"
                v-for="(val, indexn) in vipComplete"
                :key="indexn"
              >
                <div class="num">{{ val.new_number }}</div>
                <div>{{ val.real_name }}</div>
              </div>
            </div>
            <div class="lock" v-if="item.grade > grade">
              <span class="iconfont icon-quanxianguanlisuozi"></span
              >该会员等级尚未解锁
            </div>
            <div class="lock" v-if="item.grade < grade">
              <span class="iconfont icon-xuanzhong1"></span>已解锁更高等级
            </div>
          </swiperSlide>
        </swiper>
      </div>
    </div>
    <div class="wrapper">
      <div class="title acea-row row-between-wrapper">
        <div><span class="iconfont icon-jingyanzhi"></span>会员升级要求</div>
        <div class="num">
          <span class="current">{{ taskCount }}</span
          >/{{ vipRequire.length }}
        </div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in vipComplete" :key="index">
          <div class="top acea-row row-between-wrapper">
            <div class="name">
              {{ item.name
              }}<span
                class="iconfont icon-wenti"
                v-if="item.illustrate"
                @click="showGrow(item)"
              ></span>
            </div>
            <div>{{ item.finish ? "已满足条件" : "未满足条件" }}</div>
          </div>
          <div class="cu-progress">
            <div class="bg-red" :style="{ width: item.speed + '%' }"></div>
          </div>
          <div class="experience acea-row row-between-wrapper">
            <div>{{ item.task_type_title }}</div>
            <div>
              <span class="num">{{ item.new_number }}</span
              >/{{ item.number }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Recommend></Recommend>
    <div class="growthValue" :class="growthValue === false ? 'on' : ''">
      <div class="pictrue">
        <img src="@assets/images/value.jpg" /><span
          class="iconfont icon-guanbi3"
          @click="growthTap"
        ></span>
      </div>
      <div class="conter">
        {{ illustrate }}
      </div>
    </div>
    <div class="mask" :hidden="growthValue" @click="growthTap"></div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import Recommend from "@components/Recommend";
import { getVipInfo, getVipTask } from "../../api/user";
export default {
  name: "Poster",
  components: {
    swiper,
    swiperSlide,
    Recommend
  },
  props: {},
  data: function() {
    return {
      vipList: [], //等级列表
      vipRequire: [], //等级要求
      vipComplete: [], //完成情况
      taskCount: 0, //任务数
      grade: 0, //当前会员等级
      swiperVip: {
        speed: 1000,
        effect: "coverflow",
        slidesPerView: "auto",
        centeredSlides: true,
        // loop: true,
        coverflowEffect: {
          rotate: 0, // 旋转的角度
          stretch: -20, // 拉伸   图片间左右的间距和密集度
          depth: 100, // 深度   切换图片间上下的间距和密集度
          modifier: 2, // 修正值 该值越大前面的效果越明显
          slideShadows: false // 页面阴影效果
        },
        observer: true,
        observeParents: true
      },
      loading: false,
      growthValue: true,
      illustrate: "",
      activeIndex: 0
    };
  },
  watch: {
    vipList: function() {
      let that = this;
      if (that.vipList.length > 0) {
        that.vipList.forEach(function(item, index) {
          if (item.is_clear === false) {
            that.swiper.slideTo(index);
            that.activeIndex = index;
            that.grade = item.grade;
          }
        });
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted: function() {
    let that = this;
    that.getInfo();
    that.swiper.on("slideChange", function() {
      that.activeIndex = that.swiper.activeIndex;
      that.getTask();
    });
  },
  methods: {
    growthTap: function() {
      this.growthValue = true;
    },
    getInfo: function() {
      let that = this;
      getVipInfo().then(
        res => {
          that.vipList = res.data.list;
          that.vipRequire = res.data.task.list;
          that.vipComplete = res.data.task.task;
          that.taskCount = res.data.task.reach_count;
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    },
    getTask: function() {
      let that = this;
      getVipTask(that.vipList[that.activeIndex].id).then(
        res => {
          that.vipRequire = res.data.list;
          that.vipComplete = res.data.task;
          that.taskCount = res.data.reach_count;
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    },
    showGrow: function(item) {
      if (this.illustrate != item.illustrate) this.illustrate = item.illustrate;
      this.growthValue = false;
    }
  }
};
</script>
