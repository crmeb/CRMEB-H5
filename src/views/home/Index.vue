<template>
  <div class="index" v-cloak>
    <div
      class="follow acea-row row-between-wrapper"
      v-if="followHid && isWeixin"
    >
      <div>点击“立即关注”即可关注公众号</div>
      <div class="acea-row row-middle">
        <div class="bnt" @click="followTap">立即关注</div>
        <span class="iconfont icon-guanbi" @click="closeFollow"></span>
      </div>
    </div>
    <div class="followCode" v-if="followCode">
      <div class="pictrue"><img :src="followUrl" /></div>
      <div class="mask" @click="closeFollowCode"></div>
    </div>
    <div class="header acea-row row-center-wrapper">
      <div class="logo"><img :src="logoUrl" /></div>
      <router-link :to="'/search'" class="search acea-row row-middle">
        <span class="iconfont icon-xiazai5"></span>搜索商品
      </router-link>
    </div>
    <div class="slider-banner banner">
      <swiper :options="swiperOption" v-if="banner.length > 0">
        <swiper-slide v-for="(item, index) in banner" :key="index">
          <img :src="item.pic" />
        </swiper-slide>
        <div class="swiper-pagination paginationBanner" slot="pagination"></div>
      </swiper>
    </div>
    <div class="nav acea-row">
      <router-link
        :to="item.wap_url ? item.wap_url : ''"
        class="item"
        v-for="(item, index) in menus"
        :key="index"
      >
        <div class="pictrue"><img v-lazy="item.pic" alt="img" /></div>
        <div>{{ item.name }}</div>
      </router-link>
    </div>
    <div class="news acea-row row-between-wrapper">
      <div class="pictrue"><img src="@assets/images/news.png" /></div>
      <div class="swiper-no-swiping new-banner">
        <swiper
          class="swiper-wrapper"
          :options="swiperRoll"
          v-if="roll.length > 0"
        >
          <swiper-slide
            class="swiper-slide"
            v-for="(item, index) in roll"
            :key="index"
          >
            <router-link
              :to="item.wap_url ? item.wap_url : ''"
              class="acea-row row-between-wrapper"
            >
              <div class="text acea-row row-between-wrapper">
                <div class="label" v-if="item.show === '是'">最新</div>
                <div class="newsTitle line1">{{ item.info }}</div>
              </div>
              <div class="iconfont icon-xiangyou"></div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div
      class="specialArea acea-row row-between-wrapper"
      v-if="activityOne.wap_link !== undefined || activity.length"
    >
      <router-link
        :to="activityOne.wap_link ? activityOne.wap_link : ''"
        v-if="activityOne.wap_link !== undefined"
        class="assemble"
      >
        <img v-lazy="activityOne.pic" alt="img" />
        <div class="text">
          <div class="name">{{ activityOne.title }}</div>
          <div class="infor">{{ activityOne.info }}</div>
        </div>
      </router-link>
      <div class="list acea-row row-column-between">
        <router-link
          :to="item.wap_link ? item.wap_link : ''"
          class="item"
          v-for="(item, index) in activity"
          :key="index"
        >
          <img v-lazy="item.pic" alt="img" />
          <div class="text">
            <div class="name">{{ item.title }}</div>
            <div class="infor">{{ item.info }}</div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="wrapper" v-if="info.fastList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">快速选择</div>
          <div class="line1">{{ info.fastInfo }}</div>
        </div>
        <router-link :to="'/category'" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
      <div class="scroll-product">
        <swiper class="swiper-wrapper" :options="swiperScroll">
          <swiper-slide
            v-for="(item, index) in info.fastList"
            :key="index"
            class="swiper-slide"
          >
            <router-link
              :to="{
                path: '/goods_list',
                query: { id: item.id, title: item.cate_name }
              }"
            >
              <div class="img-box">
                <img v-lazy="item.pic" alt="img" />
              </div>
              <div class="pro-info line1">{{ item.cate_name }}</div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div
      class="wrapper"
      v-if="info.bastList.length > 0 || info.bastBanner.length > 0"
    >
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">精品推荐</div>
          <div class="line1">{{ info.bastInfo }}</div>
        </div>
        <router-link :to="{ path: '/hot_new_goods/' + 1 }" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
      <div class="slider-banner boutique">
        <swiper class="swiper-wrapper" :options="swiperBoutique">
          <swiper-slide
            class="swiper-slide"
            v-for="(item, index) in info.bastBanner"
            :key="index"
          >
            <router-link :to="item.wap_link ? item.wap_link : ''"
              ><img :src="item.img"
            /></router-link>
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination paginationBoutique"></div>
      </div>
      <Good-list :good-list="info.bastList" :is-sort="false"></Good-list>
    </div>
    <div class="hotList" v-if="likeInfo.length > 0">
      <div class="hot-bg">
        <div class="title acea-row row-between-wrapper">
          <div class="text line1">
            <span class="label">热门榜单</span>根据销量、搜索、好评等综合得出
          </div>
          <router-link :to="{ path: '/hot_new_goods/' + 2 }" class="more">
            更多<span class="iconfont icon-jiantou"></span>
          </router-link>
        </div>
      </div>
      <div class="list acea-row row-middle">
        <router-link
          :to="{ path: '/detail/' + item.id }"
          class="item"
          v-for="(item, index) in likeInfo"
          :key="index"
        >
          <div class="pictrue">
            <img v-lazy="item.image" alt="img" />
            <img
              src="@assets/images/one.png"
              class="numPic"
              v-if="index === 0"
            />
            <img
              src="@assets/images/two.png"
              class="numPic"
              v-else-if="index === 1"
            />
            <img
              src="@assets/images/three.png"
              class="numPic"
              v-else-if="index === 2"
            />
          </div>
          <div class="name line1">{{ item.store_name }}</div>
          <div class="money font-color-red">
            ￥<span class="num">{{ item.price }}</span>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="newGoodsBananr">
      <div class="adver">
        <img v-lazy="newGoodsBananr" alt="img" />
      </div>
    </div>
    <div class="wrapper" v-if="info.firstList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">
            首发新品<span class="new font-color-red">NEW~</span>
          </div>
          <div class="line1">{{ info.firstInfo }}</div>
        </div>
        <router-link :to="{ path: '/hot_new_goods/' + 3 }" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
      <div class="newProducts">
        <swiper class="swiper-wrapper" :options="swiperProducts">
          <swiper-slide
            class="swiper-slide"
            v-for="(item, index) in info.firstList"
            :key="index"
          >
            <div @click="goDetail(item)">
              <div class="img-box">
                <img v-lazy="item.image" alt="img" />
                <span
                  class="pictrue_log_medium pictrue_log_class"
                  v-if="item.activity && item.activity.type === '1'"
                  >秒杀</span
                >
                <span
                  class="pictrue_log_medium pictrue_log_class"
                  v-if="item.activity && item.activity.type === '2'"
                  >砍价</span
                >
                <span
                  class="pictrue_log_medium pictrue_log_class"
                  v-if="item.activity && item.activity.type === '3'"
                  >拼团</span
                >
              </div>
              <div class="pro-info line1">{{ item.store_name }}</div>
              <div class="money font-color-red">￥{{ item.price }}</div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="wrapper" v-if="benefit.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">促销单品</div>
          <div class="line1">{{ info.salesInfo }}</div>
        </div>
        <router-link :to="'/promotion'" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
    </div>
    <Promotion-good :benefit="benefit"></Promotion-good>
    <Coupon-window
      :coupon-list="couponList"
      v-if="showCoupon"
      @checked="couponClose"
      @close="couponClose"
    ></Coupon-window>
    <div style="height:1.2rem;"></div>
    <div>
      <iframe
        v-if="mapKey && !isWeixin"
        ref="geoPage"
        width="0"
        height="0"
        frameborder="0"
        scrolling="no"
        :src="
          'https://apis.map.qq.com/tools/geolocation?key=' +
            mapKey +
            '&referer=myapp'
        "
      >
      </iframe>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import GoodList from "@components/GoodList";
import PromotionGood from "@components/PromotionGood";
import CouponWindow from "@components/CouponWindow";
import { getHomeData, getShare, follow } from "@api/public";
import cookie from "@utils/store/cookie";
import { openShareAll, wxShowLocation } from "@libs/wechat";
import { isWeixin } from "@utils/index";
import { goShopDetail } from "@libs/order";
const HAS_COUPON_WINDOW = "has_coupon_window";
const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";
const MAPKEY = "mapKey";
let vm = null;
export default {
  name: "Index",
  components: {
    swiper,
    swiperSlide,
    GoodList,
    PromotionGood,
    CouponWindow
  },
  props: {},
  data: function() {
    return {
      newGoodsBananr: "",
      isWeixin: isWeixin(),
      followUrl: "",
      subscribe: false,
      followHid: false,
      followCode: false,
      showCoupon: false,
      logoUrl: "",
      banner: [],
      menus: [],
      roll: [],
      activity: [],
      activityOne: {},
      info: {
        fastList: [],
        bastBanner: [],
        firstList: [],
        bastList: []
      },
      likeInfo: [],
      lovely: [],
      benefit: [],
      couponList: [],
      swiperOption: {
        pagination: {
          el: ".paginationBanner",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true,
        on: {
          tap: function() {
            const realIndex = this.realIndex;
            vm.goUrl(realIndex);
          }
        }
      },
      swiperRoll: {
        direction: "vertical",
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperScroll: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      },
      swiperBoutique: {
        pagination: {
          el: ".paginationBoutique",
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
      swiperProducts: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      },
      mapKey: ""
    };
  },
  created() {
    vm = this;
  },
  mounted: function() {
    this.getFollow();
    let that = this;
    getHomeData().then(res => {
      that.mapKey = res.data.tengxun_map_key;
      cookie.set(MAPKEY, that.mapKey);
      that.logoUrl = res.data.logoUrl;
      that.newGoodsBananr = res.data.newGoodsBananr;
      that.$set(that, "banner", res.data.banner);
      that.$set(that, "menus", res.data.menus);
      that.$set(that, "roll", res.data.roll);
      that.$set(that, "activity", res.data.activity);
      if (res.data.activity.length) {
        var activityOne = res.data.activity.shift();
        that.$set(that, "activityOne", activityOne);
      }
      that.$set(that, "info", res.data.info);
      that.$set(that, "likeInfo", res.data.likeInfo);
      that.$set(
        that,
        "lovely",
        res.data.lovely.length ? res.data.lovely[0] : {}
      );
      that.$set(that, "benefit", res.data.benefit);
      that.$set(that, "couponList", res.data.couponList);
      that.subscribe = res.data.subscribe;
      if (!that.subscribe && that.followUrl) {
        setTimeout(function() {
          that.followHid = true;
        }, 200);
      } else {
        that.followHid = false;
      }
      if (res.data.site_name) document.title = res.data.site_name;
      that.setOpenShare();
      this.showCoupon =
        !cookie.has(HAS_COUPON_WINDOW) &&
        res.data.couponList.some(coupon => coupon.is_use);
      if (!cookie.get(LATITUDE) && !cookie.get(LONGITUDE)) this.getWXLocation();
    });
  },
  methods: {
    // 轮播图跳转
    goUrl(index) {
      let url = this.banner[index].wap_url;
      let newStr = url.indexOf("http") === 0;
      if (newStr) {
        window.location.href = url;
      } else {
        this.$router.push({
          path: url
        });
      }
    },
    // 商品详情跳转
    goDetail(item) {
      goShopDetail(item).then(() => {
        this.$router.push({ path: "/detail/" + item.id });
      });
    },
    getWXLocation() {
      if (isWeixin()) {
        wxShowLocation();
      } else {
        if (!this.mapKey)
          console.log("暂无法使用查看地图，请配置您的腾讯地图key");
        let loc;
        // if (_this.$route.params.mapKey) _this.locationShow = true;
        //监听定位组件的message事件
        window.addEventListener(
          "message",
          function(event) {
            loc = event.data; // 接收位置信息 LONGITUDE
            console.log("location", loc);
            if (loc && loc.module == "geolocation") {
              cookie.set(LATITUDE, loc.lat);
              cookie.set(LONGITUDE, loc.lng);
            } else {
              cookie.remove(LATITUDE);
              cookie.remove(LONGITUDE);
              //定位组件在定位失败后，也会触发message, event.data为null
              console.log("定位失败");
            }
          },
          false
        );
      }
    },
    closeFollow() {
      this.followHid = false;
    },
    followTap() {
      this.followCode = true;
      this.followHid = false;
    },
    closeFollowCode() {
      this.followCode = false;
      this.followHid = true;
    },
    couponClose() {
      cookie.set(HAS_COUPON_WINDOW, 1);
    },
    getFollow() {
      follow()
        .then(res => {
          this.followUrl = res.data.path;
        })
        .catch(() => {});
    },
    setOpenShare() {
      if (isWeixin()) {
        getShare().then(res => {
          var data = res.data.data;
          var configAppMessage = {
            desc: data.synopsis,
            title: data.title,
            link: location.href,
            imgUrl: data.img
          };
          openShareAll(configAppMessage);
        });
      }
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.index {
  background-color: #fff;
}

.index .follow {
  z-index: 100000;
}
.keep {
  text-align: center;
}
</style>
