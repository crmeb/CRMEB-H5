<template>
  <div
    :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']"
    ref="box"
    @scroll.native="onScroll"
  >
    <div
      class="header acea-row row-center-wrapper"
      :style="'opacity:' + opacity"
      ref="header"
    >
      <div
        class="item"
        :class="navActive === index ? 'on' : ''"
        v-for="(item, index) in navList"
        :key="index"
        @click="asideTap(index)"
      >
        {{ item }}
      </div>
    </div>
    <div id="title0">
      <product-con-swiper
        :img-urls="storeInfo.slider_image"
        :videoline="storeInfo.video_link"
      ></product-con-swiper>
      <div class="wrapper">
        <div class="share acea-row row-between row-bottom">
          <div class="money font-color-red">
            ￥<span class="num">{{ storeInfo.price }}</span
            ><span
              class="vip-money"
              v-if="storeInfo.vip_price && storeInfo.vip_price > 0"
              >￥{{ storeInfo.vip_price }}</span
            ><img
              src="@assets/images/vip.png"
              class="image"
              v-if="storeInfo.vip_price && storeInfo.vip_price > 0"
            />
          </div>
          <div
            class="iconfont icon-fenxiang"
            @click="listenerActionSheet"
          ></div>
        </div>
        <div class="introduce">{{ storeInfo.store_name }}</div>
        <div class="label acea-row row-between-wrapper">
          <div>原价:￥{{ storeInfo.ot_price }}</div>
          <div>库存:{{ storeInfo.stock }}{{ storeInfo.unit_name }}</div>
          <div>销量:{{ storeInfo.fsales }}{{ storeInfo.unit_name }}</div>
        </div>
        <div
          class="coupon acea-row row-between-wrapper"
          @click="couponTap"
          v-if="couponList.length"
        >
          <div class="hide line1 acea-row">
            优惠券：
            <div
              class="activity"
              v-for="(item, index) in couponList"
              :key="index"
            >
              满{{ item.use_min_price }}减{{ item.coupon_price }}
            </div>
          </div>
          <div class="iconfont icon-jiantou"></div>
        </div>
        <div class="coupon acea-row row-between-wrapper" v-if="activity.length">
          <div class="line1 acea-row">
            活&nbsp;&nbsp;&nbsp;动：
            <div
              v-for="(item, index) in activity"
              :key="index"
              @click="goDetail(item)"
            >
              <div
                class="acea-row row-center-wrapper"
                v-if="item.type === '1'"
                :class="{
                  activity_pin: index === 0,
                  activity_miao: index === 1,
                  activity_kan: index === 2
                }"
              >
                <span class="iconfonts iconfont icon-shenhezhong"></span>
                <span class="activity_title">&nbsp;参与秒杀</span>
              </div>
              <div
                class="acea-row row-center-wrapper"
                v-if="item.type === '2'"
                :class="{
                  activity_pin: index === 0,
                  activity_miao: index === 1,
                  activity_kan: index === 2
                }"
              >
                <span class="iconfonts iconfont icon-kanjia"></span>
                <span class="activity_title">&nbsp;参与砍价</span>
              </div>
              <div
                class="acea-row row-center-wrapper"
                v-if="item.type === '3'"
                :class="{
                  activity_pin: index === 0,
                  activity_miao: index === 1,
                  activity_kan: index === 2
                }"
              >
                <span class="iconfonts iconfont icon-pintuan"></span>
                <span class="activity_title">&nbsp;参与拼团</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="attribute acea-row row-between-wrapper"
        @click="selecAttrTap"
        v-if="attr.productAttr.length"
      >
        <div>
          {{ attrTxt }}：<span class="atterTxt">{{ attrValue }}</span>
        </div>
        <div class="iconfont icon-jiantou"></div>
      </div>
      <!--<div-->
      <!--class="store-info"-->
      <!--v-if="system_store.id !== undefined && storeSelfMention"-->
      <!--&gt;-->
      <!--<div-->
      <!--class="acea-row row-between-wrapper store-box"-->
      <!--@click="showStoreList"-->
      <!--&gt;-->
      <!--<div class="title">门店信息</div>-->
      <!--<div class="iconfont icon-jiantou"></div>-->
      <!--</div>-->
      <!--<div class="info acea-row row-between-wrapper">-->
      <!--<div class="pictrue"><img :src="storeItems.image" /></div>-->
      <!--<div class="text">-->
      <!--<div class="name line1">-->
      <!--{{ storeItems.name }}-->
      <!--</div>-->
      <!--<div class="address acea-row row-middle" @click="showChang">-->
      <!--<span class="addressTxt line1 address_tit"-->
      <!--&gt;{{ storeItems.address-->
      <!--}}{{ ", " + storeItems.detailed_address }}</span-->
      <!--&gt;<span class="iconfont icon-youjian"></span>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="addressBox">-->
      <!--<a-->
      <!--class="iconfont icon-dadianhua01 font-color-red phone"-->
      <!--:href="'tel:' + storeItems.phone"-->
      <!--&gt;</a>-->
      <!--<div-->
      <!--class="addressTxt corlor-red"-->
      <!--@click="showChang"-->
      <!--v-if="storeItems.range"-->
      <!--&gt;-->
      <!--距离{{ storeItems.range }}千米-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <div class="userEvaluation" id="title1">
      <div class="title acea-row row-between-wrapper">
        <div>用户评价({{ replyCount }})</div>
        <router-link :to="{ path: '/evaluate_list/' + id }" class="praise"
          ><span class="font-color-red">{{ replyChance }}%</span>好评率<span
            class="iconfont icon-jiantou"
          ></span
        ></router-link>
      </div>
      <user-evaluation :reply="reply"></user-evaluation>
    </div>
    <div class="superior" v-if="goodList.length > 0" id="title2">
      <div class="title acea-row row-center-wrapper">
        <img src="@assets/images/ling.png" />
        <div class="titleTxt">优品推荐</div>
        <img src="@assets/images/ling.png" />
      </div>
      <template>
        <div class="slider-banner banner">
          <swiper :options="swiperRecommend">
            <swiper-slide v-for="(item, index) in goodList" :key="index">
              <div class="list acea-row row-middle">
                <div
                  class="item"
                  v-for="val in item.list"
                  :key="val.image"
                  @click="goGoods(val)"
                >
                  <div class="pictrue">
                    <img :src="val.image" />
                    <span
                      class="pictrue_log pictrue_log_class"
                      v-if="val.activity && val.activity.type === '1'"
                      >秒杀</span
                    >
                    <span
                      class="pictrue_log pictrue_log_class"
                      v-if="val.activity && val.activity.type === '2'"
                      >砍价</span
                    >
                    <span
                      class="pictrue_log pictrue_log_class"
                      v-if="val.activity && val.activity.type === '3'"
                      >拼团</span
                    >
                  </div>
                  <div class="name line1">{{ val.store_name }}</div>
                  <div class="money font-color-red">¥{{ val.price }}</div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </template>
    </div>
    <div class="product-intro" id="title3">
      <div class="title">产品介绍</div>
      <div class="conter" v-html="storeInfo.description"></div>
    </div>
    <div style="height:1.2rem;"></div>
    <div class="footer acea-row row-between-wrapper">
      <div class="item" @click="$router.push({ path: '/customer/list/' + id })">
        <div class="iconfont icon-kefu"></div>
        <div>客服</div>
      </div>
      <div class="item" @click="setCollect">
        <div
          class="iconfont"
          :class="storeInfo.userCollect ? 'icon-shoucang1' : 'icon-shoucang'"
        ></div>
        <div>收藏</div>
      </div>
      <router-link
        :to="'/cart'"
        class="item animated"
        :class="animated === true ? 'bounceIn' : ''"
      >
        <div class="iconfont icon-gouwuche1">
          <span class="num bg-color-red" v-if="CartCount > 0">{{
            CartCount
          }}</span>
        </div>
        <div>购物车</div>
      </router-link>
      <div class="bnt acea-row">
        <div class="joinCart" @click="joinCart">加入购物车</div>
        <div class="buy" @click="tapBuy" v-if="attr.productSelect.stock > 0">
          立即购买
        </div>
        <div class="buy bg-color-hui" v-else>已售罄</div>
      </div>
    </div>
    <Share-red-packets
      :priceName="priceName"
      v-on:changeFun="changeFun"
      v-if="priceName !== 0"
    ></Share-red-packets>
    <CouponPop v-on:changeFun="changeFun" :coupon="coupon"></CouponPop>
    <Product-window
      v-on:changeFun="changeFun"
      :attr="attr"
      :iSplus="iSplus"
    ></Product-window>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
    <ShareInfo
      v-on:setShareInfoStatus="setShareInfoStatus"
      :shareInfoStatus="shareInfoStatus"
    ></ShareInfo>
    <div
      class="generate-posters acea-row row-middle"
      :class="posters ? 'on' : ''"
    >
      <div
        class="item"
        v-if="weixinStatus === true"
        @click="setShareInfoStatus"
      >
        <div class="iconfont icon-weixin3"></div>
        <div class="">发送给朋友</div>
      </div>
      <div class="item" @click="setPosterImageStatus">
        <div class="iconfont icon-haibao"></div>
        <div class="">生成海报</div>
      </div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      @click="listenerActionClose"
      v-show="posters"
    ></div>
    <div class="geoPage" v-if="mapShow">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="no"
        :src="
          'https://apis.map.qq.com/uri/v1/geocoder?coord=' +
            system_store.latitude +
            ',' +
            system_store.longitude +
            '&referer=' +
            mapKey
        "
      >
      </iframe>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import ProductConSwiper from "@components/ProductConSwiper";
import UserEvaluation from "@components/UserEvaluation";
import ShareRedPackets from "@components/ShareRedPackets";
import CouponPop from "@components/CouponPop";
import ProductWindow from "@components/ProductWindow";
import StorePoster from "@components/StorePoster";
import ShareInfo from "@components/ShareInfo";
import { goShopDetail } from "@libs/order";
import debounce from "lodash.debounce";
import {
  getProductDetail,
  postCartAdd,
  getCartCount,
  getProductCode,
  storeListApi
} from "@api/store";
import {
  getCoupon,
  getCollectAdd,
  getCollectDel,
  getUserInfo
} from "@api/user";
import { isWeixin } from "@utils/index";
import { wechatEvevt } from "@libs/wechat";
import { imageBase64 } from "@api/public";
import { mapGetters } from "vuex";
import cookie from "@utils/store/cookie";
let NAME = "GoodsCon";
const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";
export default {
  name: NAME,
  components: {
    swiper,
    swiperSlide,
    ProductConSwiper,
    UserEvaluation,
    ShareRedPackets,
    CouponPop,
    ProductWindow,
    StorePoster,
    ShareInfo
  },
  data: function() {
    return {
      iSplus: true,
      shareInfoStatus: false,
      weixinStatus: false,
      mapShow: false,
      mapKey: "",
      posterData: {
        image: "",
        title: "",
        price: "",
        code: ""
      },
      posterImageStatus: false,
      animated: false,
      coupon: {
        coupon: false,
        list: []
      },
      attr: {
        cartAttr: false,
        productAttr: [],
        productSelect: {}
      },
      isOpen: false, //是否打开属性组件
      productValue: [],
      id: 0,
      storeInfo: {},
      couponList: [],
      attrTxt: "请选择",
      attrValue: "",
      cart_num: 1, //购买数量
      replyCount: "",
      replyChance: "",
      reply: [],
      priceName: 0,
      CartCount: 0,
      posters: false,
      banner: [{}, {}],
      swiperRecommend: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: false,
        loop: false,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      goodList: [],
      system_store: {},
      storeSelfMention: true,
      storeItems: {},
      activity: [],
      navList: [],
      lock: false,
      navActive: 0,
      opacity: 0
    };
  },
  computed: mapGetters(["isLogin"]),
  watch: {
    $route(n) {
      if (n.name === NAME) {
        this.id = n.params.id;
        this.storeInfo.slider_image = [];
        this.productCon();
      }
    }
  },
  updated() {
    // window.scroll(0, 0);
  },
  mounted: function() {
    document.addEventListener("scroll", this.onScroll, false);
    this.id = this.$route.params.id;
    this.storeInfo.slider_image = [];
    this.productCon();
    this.coupons();
    window.addEventListener("scroll", this.handleScroll);
    this.getList();
  },
  methods: {
    // 商品详情跳转
    goDetail(item) {
      if (item.type === "1") {
        this.$router.push({
          path: "/activity/seckill_detail/" + item.id + "/" + item.time + "/1"
        });
      } else if (item.type === "2") {
        this.$router.push({
          path: "/activity/dargain_detail/" + item.id
        });
      } else {
        this.$router.push({
          path: "/activity/group_detail/" + item.id
        });
      }
    },
    // 获取门店列表数据
    getList() {
      let data = {
        latitude: cookie.get(LATITUDE) || "", //纬度
        longitude: cookie.get(LONGITUDE) || "", //经度
        page: 1,
        limit: 10
      };
      storeListApi(data)
        .then(res => {
          this.storeItems = res.data.list[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleScroll() {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      let opacity = top / 350;
      opacity = opacity > 1 ? 1 : opacity;
      this.opacity = opacity;
    },
    asideTap(a) {
      this.$nextTick(() => {
        let index = a;
        this.navActive = index;
        if (!this.goodList.length && index === 2) {
          index = 3;
        }
        let element = document.querySelector("#title" + index);
        const top =
          element.offsetTop - this.$refs.header.offsetHeight - window.scrollY;
        this.lock = true;
        window.scrollBy({ top, left: 0, behavior: "smooth" });
      });
    },
    onScroll: debounce(function() {
      if (this.lock) {
        this.lock = false;
        return;
      }
      const headerHeight = this.$refs.header.offsetHeight,
        { scrollY } = window,
        titles = [];
      titles.push(document.querySelector("#title0"));
      titles.push(document.querySelector("#title1"));
      if (this.goodList.length) {
        titles.push(document.querySelector("#title2"));
      }
      titles.push(document.querySelector("#title3"));
      titles.reduce((initial, title, index) => {
        if (
          !document.querySelector("#title0") &&
          !document.querySelector("#title1") &&
          !document.querySelector("#title2")
        ) {
          return;
        }
        if (initial) return initial;
        if (scrollY + headerHeight < title.offsetTop + title.offsetHeight) {
          initial = true;
          this.navActive = index;
        }
        return initial;
      }, false);
    }, 500),
    showChang: function() {
      if (isWeixin()) {
        let config = {
          latitude: parseFloat(this.storeItems.latitude),
          longitude: parseFloat(this.storeItems.longitude),
          name: this.storeItems.name,
          address: this.storeItems.address + this.system_store.detailed_address
        };
        wechatEvevt("openLocation", config)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            if (res.is_ready) {
              res.wx.openLocation(config);
            }
          });
      } else {
        if (!this.mapKey)
          return this.$dialog.error(
            "暂无法使用查看地图，请配置您的腾讯地图key"
          );
        this.mapShow = true;
      }
    },
    updateTitle() {
      document.title = this.storeInfo.store_name || this.$route.meta.title;
    },
    // 调转到门店列表
    showStoreList() {
      this.$store.commit("GET_TO", "details");
      this.$router.push("/shop/storeList/details");
    },
    setOpenShare: function() {
      var data = this.storeInfo;
      var href = location.href;
      if (isWeixin()) {
        if (this.isLogin) {
          getUserInfo().then(res => {
            href =
              href.indexOf("?") === -1
                ? href + "?spread=" + res.data.uid
                : href + "&spread=" + res.data.uid;
            var configAppMessage = {
              desc: data.store_info,
              title: data.store_name,
              link: href,
              imgUrl: data.image
            };
            wechatEvevt(
              [
                "updateAppMessageShareData",
                "updateTimelineShareData",
                "onMenuShareAppMessage",
                "onMenuShareTimeline"
              ],
              configAppMessage
            )
              .then(res => {
                console.log(res);
              })
              .catch(res => {
                if (res.is_ready) {
                  res.wx.updateAppMessageShareData(configAppMessage);
                  res.wx.onMenuShareAppMessage(configAppMessage);
                  res.wx.updateTimelineShareData(configAppMessage);
                  res.wx.onMenuShareTimeline(configAppMessage);
                }
              });
          });
        } else {
          var configAppMessage = {
            desc: data.store_info,
            title: data.store_name,
            link: href,
            imgUrl: data.image
          };
          wechatEvevt(
            [
              "updateAppMessageShareData",
              "updateTimelineShareData",
              "onMenuShareAppMessage",
              "onMenuShareTimeline"
            ],
            configAppMessage
          )
            .then(res => {
              console.log(res);
            })
            .catch(res => {
              if (res.is_ready) {
                res.wx.updateAppMessageShareData(configAppMessage);
                res.wx.onMenuShareAppMessage(configAppMessage);
                res.wx.updateTimelineShareData(configAppMessage);
                res.wx.onMenuShareTimeline(configAppMessage);
              }
            });
        }
      }
    },
    setShareInfoStatus: function() {
      this.shareInfoStatus = !this.shareInfoStatus;
      this.posters = false;
    },
    shareCode: function(value) {
      var that = this;
      getProductCode(that.id).then(res => {
        if (res.data.code) that.posterData.code = res.data.code;
        value === false && that.listenerActionSheet();
      });
    },
    setPosterImageStatus: function() {
      var sTop = document.body || document.documentElement;
      sTop.scrollTop = 0;
      this.posterImageStatus = !this.posterImageStatus;
      this.posters = false;
    },
    //产品详情接口；
    productCon: function() {
      let that = this;
      getProductDetail(that.id)
        .then(res => {
          that.$set(that, "storeInfo", res.data.storeInfo);
          that.$set(that.attr, "productAttr", res.data.productAttr);
          that.$set(that, "productValue", res.data.productValue);
          that.$set(that, "replyCount", res.data.replyCount);
          that.$set(that, "replyChance", res.data.replyChance);
          that.reply = res.data.reply ? [res.data.reply] : [];
          that.$set(that, "reply", that.reply);
          that.$set(that, "priceName", res.data.priceName);
          that.posterData.image = that.storeInfo.image_base;
          that.activity = res.data.activity ? res.data.activity : [];
          if (that.storeInfo.store_name.length > 30) {
            that.posterData.title =
              that.storeInfo.store_name.substring(0, 30) + "...";
          } else {
            that.posterData.title = that.storeInfo.store_name;
          }
          that.storeSelfMention = res.data.store_self_mention ? true : false;
          that.posterData.price = that.storeInfo.price;
          that.posterData.code = that.storeInfo.code_base;
          that.system_store = res.data.system_store;
          let good_list = res.data.good_list || [];
          let goodArray = [];
          let count = Math.ceil(good_list.length / 6);
          for (let i = 0; i < count; i++) {
            var list = good_list.slice(i * 6, i * 6 + 6);
            if (list.length) goodArray.push({ list: list });
          }
          that.mapKey = res.data.mapKey;
          that.$set(that, "goodList", goodArray);
          let navList = ["商品", "评价", "详情"];
          if (goodArray.length) {
            navList.splice(2, 0, "推荐");
          }
          that.navList = navList;
          that.updateTitle();
          that.DefaultSelect();
          that.getCartCount();
          that.getImageBase64();
          that.setOpenShare();
        })
        .catch(res => {
          that.$dialog.error(res.msg);
          that.$router.go(-1);
        });
    },
    getImageBase64: function() {
      let that = this;
      imageBase64(this.posterData.image, that.posterData.code)
        .then(res => {
          that.posterData.image = res.data.image;
          that.posterData.code = res.data.code;
          that.isLogin && that.shareCode();
        })
        .catch(() => {
          that.isLogin && that.shareCode();
        });
    },
    //默认选中属性；
    DefaultSelect: function() {
      let productAttr = this.attr.productAttr,
        value = [];
      for (var key in this.productValue) {
        if (this.productValue[key].stock > 0) {
          value = this.attr.productAttr.length ? key.split(",") : [];
          break;
        }
      }
      for (let i = 0; i < productAttr.length; i++) {
        this.$set(productAttr[i], "index", value[i]);
      }
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.productValue[value.sort().join(",")];
      if (productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", value.sort().join(","));
        this.$set(this, "attrTxt", "已选择");
      } else if (!productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      } else if (!productSelect && !productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
        this.$set(
          this.attr.productSelect,
          "unique",
          this.storeInfo.unique || ""
        );
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      }
    },
    //购物车；
    ChangeCartNum: function(changeValue) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.productValue[this.attrValue];
      //如果没有属性,赋值给商品默认库存
      if (productSelect === undefined && !this.attr.productAttr.length)
        productSelect = this.attr.productSelect;
      //无属性值即库存为0；不存在加减；
      if (productSelect === undefined) return;
      let stock = productSelect.stock || 0;
      let num = this.attr.productSelect;
      if (changeValue) {
        num.cart_num++;
        if (num.cart_num > stock) {
          this.$set(this.attr.productSelect, "cart_num", stock ? stock : 1);
          this.$set(this, "cart_num", stock ? stock : 1);
        }
      } else {
        num.cart_num--;
        if (num.cart_num < 1) {
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "cart_num", 1);
        }
      }
    },
    //将父级向子集多次传送的函数合二为一；
    changeFun: function(opt) {
      if (typeof opt !== "object") opt = {};
      let action = opt.action || "";
      let value = opt.value === undefined ? "" : opt.value;
      this[action] && this[action](value);
    },
    //打开优惠券插件；
    couponTap: function() {
      let that = this;
      that.coupons();
      that.coupon.coupon = true;
    },
    changecoupon: function(msg) {
      this.coupon.coupon = msg;
      this.coupons();
    },
    currentcoupon: function(res) {
      let that = this;
      that.coupon.coupon = false;
      that.$set(that.coupon.list[res], "is_use", true);
    },
    //可领取优惠券接口；
    coupons: function() {
      let that = this,
        q = { page: 1, limit: 20, type: 1, product_id: that.id };
      getCoupon(q).then(res => {
        that.$set(that, "couponList", res.data || []);
        that.$set(that.coupon, "list", res.data);
      });
    },
    //打开属性插件；
    selecAttrTap: function() {
      this.attr.cartAttr = true;
      this.isOpen = true;
    },
    changeattr: function(msg) {
      this.attr.cartAttr = msg;
      this.isOpen = false;
    },
    //选择属性；
    ChangeAttr: function(res) {
      let productSelect = this.productValue[res];
      if (productSelect) {
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", res);
        this.$set(this, "attrTxt", "已选择");
      } else {
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      }
    },
    //收藏商品
    setCollect: function() {
      let that = this,
        id = that.storeInfo.id,
        category = "product";
      if (that.storeInfo.userCollect) {
        getCollectDel(id, category).then(function() {
          that.storeInfo.userCollect = !that.storeInfo.userCollect;
        });
      } else {
        getCollectAdd(id, category).then(function() {
          that.storeInfo.userCollect = !that.storeInfo.userCollect;
        });
      }
    },
    goGoods(item) {
      goShopDetail(item).then(() => {
        window.scroll(0, 0);
        this.$router.push({ path: "/detail/" + item.id });
      });
    },
    //  点击加入购物车按钮
    joinCart: function() {
      //0=加入购物车
      this.goCat(0);
    },
    // 加入购物车；
    goCat: function(news) {
      let that = this,
        productSelect = that.productValue[this.attrValue];
      //打开属性
      if (that.attrValue) {
        //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
        that.attr.cartAttr = !that.isOpen ? true : false;
      } else {
        if (that.isOpen) that.attr.cartAttr = true;
        else that.attr.cartAttr = !that.attr.cartAttr;
      }
      //只有关闭属性弹窗时进行加入购物车
      if (that.attr.cartAttr === true && that.isOpen === false)
        return (that.isOpen = true);
      if (
        !this.attr.productSelect.cart_num ||
        parseInt(this.attr.productSelect.cart_num) <= 0
      )
        return that.$dialog.toast({ mes: "请输入购买数量" });
      //如果有属性,没有选择,提示用户选择
      if (
        that.attr.productAttr.length &&
        productSelect === undefined &&
        that.isOpen === true
      )
        return that.$dialog.toast({ mes: "产品库存不足，请选择其它" });
      let q = {
        productId: that.id,
        cartNum: that.attr.productSelect.cart_num,
        new: news,
        uniqueId:
          that.attr.productSelect !== undefined
            ? that.attr.productSelect.unique
            : ""
      };
      postCartAdd(q)
        .then(function(res) {
          that.isOpen = false;
          that.attr.cartAttr = false;
          if (news) {
            that.$router.push({ path: "/order/submit/" + res.data.cartId });
          } else {
            that.$dialog.toast({
              mes: "添加购物车成功",
              callback: () => {
                that.getCartCount(true);
              }
            });
          }
        })
        .catch(res => {
          that.isOpen = false;
          return that.$dialog.toast({ mes: res.msg });
        });
    },
    //获取购物车数量
    getCartCount: function(isAnima) {
      let that = this;
      const isLogin = that.isLogin;
      if (isLogin) {
        getCartCount({ numType: 0 }).then(res => {
          that.CartCount = res.data.count;
          //加入购物车后重置属性
          if (isAnima) {
            that.animated = true;
            setTimeout(function() {
              that.animated = false;
            }, 500);
          }
        });
      }
    },
    //立即购买；
    tapBuy: function() {
      //  1=直接购买
      this.goCat(1);
    },
    listenerActionSheet: function() {
      if (isWeixin() === true) {
        this.weixinStatus = true;
      }
      this.posters = true;
    },
    listenerActionClose: function() {
      this.posters = false;
    }
  },
  beforeDestroy: function() {
    document.removeEventListener("scroll", this.onScroll, false);
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
<style scoped>
.mask {
  z-index: 888 !important;
}
.activity_pin {
  width: auto;
  height: 0.44rem;
  background: linear-gradient(
    90deg,
    rgba(233, 51, 35, 1) 0%,
    rgba(250, 101, 20, 1) 100%
  );
  opacity: 1;
  border-radius: 0.22rem;
  padding: 0 0.2rem;
  margin-left: 0.19rem;
}
.activity_miao {
  width: auto;
  height: 0.44rem;
  padding: 0 0.2rem;
  background: linear-gradient(
    90deg,
    rgba(250, 102, 24, 1) 0%,
    rgba(254, 161, 15, 1) 100%
  );
  opacity: 1;
  border-radius: 0.22rem;
  margin-left: 0.19rem;
}
.iconfonts {
  color: #fff !important;
  font-size: 0.28rem;
  display: block;
}
.activity_title {
  font-size: 0.24rem;
  color: #fff;
}
.activity_kan {
  width: auto;
  height: 0.44rem;
  padding: 0 0.2rem;
  background: linear-gradient(
    90deg,
    rgba(254, 159, 15, 1) 0%,
    rgba(254, 178, 15, 1) 100%
  );
  opacity: 1;
  border-radius: 0.22rem;
  margin-left: 0.19rem;
}
.addressBox .phone {
  margin-left: 1.1rem;
}
.corlor-red {
  color: #fc4141;
}
.store-box {
  padding: 0 0.3rem;
  border-bottom: 1px solid #f5f5f5;
}
.geoPage {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 10000;
}
.product-con .header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.96rem;
  font-size: 0.3rem;
  color: #050505;
  background-color: #fff;
  z-index: 11;
  border-bottom: 0.01rem solid #eee;
}
.product-con .header .item {
  position: relative;
  margin: 0 0.35rem;
}
.product-con .header .item.on:before {
  position: absolute;
  width: 0.6rem;
  height: 0.05rem;
  background-repeat: no-repeat;
  content: "";
  background: linear-gradient(to left, #ff3366 0%, #ff6533 100%);
  background: -webkit-linear-gradient(to left, #ff3366 0%, #ff6533 100%);
  background: -moz-linear-gradient(to left, #ff3366 0%, #ff6533 100%);
  bottom: -0.1rem;
}
.product-con .store-info {
  margin-top: 0.2rem;
  background-color: #fff;
}
.product-con .store-info .title {
  font-size: 0.28rem;
  color: #282828;
  height: 0.8rem;
  line-height: 0.8rem;
  border-bottom: 0.01rem solid #f5f5f5;
}
.product-con .store-info .info {
  padding: 0 0.3rem;
  height: 1.26rem;
}
.store-info .icon-jiantou {
  color: #7a7a7a;
  font-size: 0.28rem;
}
.product-con .store-info .info .pictrue {
  width: 0.76rem;
  height: 0.76rem;
}
.product-con .store-info .info .pictrue img {
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
}
.product-con .store-info .info .text {
  width: 56%;
}
.product-con .store-info .info .text .name {
  font-size: 0.3rem;
  color: #282828;
}
.product-con .store-info .info .text .address {
  font-size: 0.24rem;
  color: #666;
  margin-top: 0.03rem;
}
.product-con .store-info .info .text .address .iconfont {
  color: #707070;
  font-size: 0.18rem;
  margin-left: 0.1rem;
}
.address_tit {
  max-width: 88% !important;
}
.addressTxt {
  width: auto;
  font-size: 0.24rem;
}
.product-con .store-info .info .iconfont {
  font-size: 0.4rem;
}
.product-con .superior {
  background-color: #fff;
  margin-top: 0.2rem;
}
.product-con .superior .title {
  height: 0.98rem;
}
.product-con .superior .title img {
  width: 0.3rem;
  height: 0.3rem;
}
.product-con .superior .title .titleTxt {
  margin: 0 0.2rem;
  font-size: 0.3rem;
  background-image: linear-gradient(to right, #f57a37 0%, #f21b07 100%);
  background-image: -webkit-linear-gradient(to right, #f57a37 0%, #f21b07 100%);
  background-image: -moz-linear-gradient(to right, #f57a37 0%, #f21b07 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.product-con .superior .slider-banner {
  width: 6.9rem;
  margin: 0 auto;
  padding-bottom: 0.2rem;
}
.product-con .superior .slider-banner .list {
  width: 100%;
  padding-bottom: 0.2rem;
}
.product-con .superior .slider-banner .list .item {
  width: 2.15rem;
  margin: 0 0.21rem 0.2rem 0;
  font-size: 0.26rem;
}
.product-con .superior .slider-banner .list .item:nth-of-type(3n) {
  margin-right: 0;
}
.product-con .superior .slider-banner .list .item .pictrue {
  width: 100%;
  height: 2.15rem;
  position: relative;
}
.product-con .superior .slider-banner .list .item .pictrue img {
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
}
.product-con .superior .slider-banner .list .item .name {
  color: #282828;
  margin-top: 0.12rem;
}
.product-con .superior .slider-banner .swiper-pagination-bullet {
  background-color: #999;
}
.product-con .superior .slider-banner .swiper-pagination-bullet-active {
  background-color: #e93323;
}

.mask {
  -webkit-filter: blur(2px);
  -moz-filter: blur(2px);
  -ms-filter: blur(2px);
  filter: blur(2px);
  z-index: 888 !important;
}
.footer .icon-shoucang1 {
  color: #e93323;
}
.product-con .product-intro .conter div {
  width: 100% !important;
}
.generate-posters {
  width: 100%;
  height: 1.7rem;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  transform: translate3d(0, 100%, 0);
  -webkit-transform: translate3d(0, 100%, 0);
  -ms-transform: translate3d(0, 100%, 0);
  -moz-transform: translate3d(0, 100%, 0);
  -o-transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -o-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  opacity: 0;
}
.generate-posters.on {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  opacity: 1;
}
.generate-posters .item {
  flex: 50%;
  -webkit-flex: 50%;
  -ms-flex: 50%;
  text-align: center;
}
.generate-posters .item .iconfont {
  font-size: 0.8rem;
  color: #5eae72;
}
.generate-posters .item .iconfont.icon-haibao {
  color: #5391f1;
}
.noscroll {
  height: 100%;
  overflow: hidden;
}
</style>
