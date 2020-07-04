<template>
  <div
    :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']"
    v-show="domStatus"
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
      <ProductConSwiper :imgUrls="imgUrls"></ProductConSwiper>
      <div class="nav acea-row row-between-wrapper">
        <div class="money">
          ￥<span class="num" v-text="storeInfo.price"></span
          ><span class="y-money" v-text="'￥' + storeInfo.ot_price"></span>
        </div>
        <div class="acea-row row-middle" v-if="$route.params.status === '1'">
          <div class="times">
            <div>距秒杀结束仅剩</div>
            <CountDown
              :is-day="false"
              :tip-text="''"
              :day-text="''"
              :hour-text="' : '"
              :minute-text="' : '"
              :second-text="''"
              :datatime="datatime"
            ></CountDown>
          </div>
        </div>
      </div>
      <div class="wrapperRush">
        <div class="introduce acea-row row-between">
          <div class="infor" v-text="storeInfo.title"></div>
          <div
            class="iconfont icon-fenxiang"
            @click="setPosterImageStatus"
          ></div>
        </div>
        <div class="label acea-row row-middle">
          <div class="stock">
            累计销售：{{ storeInfo.total ? storeInfo.total : 0 }} 件
          </div>
          <div>
            限量: {{ storeInfo.quota_show ? storeInfo.quota_show : 0 }} 件
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
    </div>
    <div class="userEvaluation" id="title1">
      <div class="title acea-row row-between-wrapper">
        <div v-text="'用户评价(' + replyCount + ')'"></div>
        <div class="praise" @click="goReply">
          <span class="font-color-red" v-text="replyChance + '%'"></span
          >好评率<span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <UserEvaluation :reply="reply" v-if="reply.length !== 0"></UserEvaluation>
    </div>
    <div class="product-intro" id="title2">
      <div class="title">产品介绍</div>
      <div class="conter" v-html="storeInfo.description"></div>
    </div>
    <div style="height:1.2rem;"></div>
    <div class="footerRush acea-row row-between-wrapper">
      <div
        class="customerSer acea-row row-center-wrapper row-column"
        @click="$router.push({ path: '/customer/list' })"
      >
        <div class="iconfont icon-kefu"></div>
        <div>客服</div>
      </div>
      <div
        class="item acea-row row-center-wrapper row-column"
        @click="setCollect"
      >
        <div
          class="iconfont"
          :class="storeInfo.userCollect ? 'icon-shoucang1' : 'icon-shoucang'"
        ></div>
        <div>收藏</div>
      </div>
      <div
        class="bnt acea-row"
        v-if="
          $route.params.status === '1' &&
            attr.productSelect.quota > 0 &&
            attr.productSelect.product_stock > 0
        "
      >
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy" @click="tapBuy">立即抢购</div>
      </div>
      <div
        class="bnt acea-row"
        v-if="
          $route.params.status === '1' &&
            (attr.productSelect.quota <= 0 ||
              attr.productSelect.product_stock <= 0)
        "
      >
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">已售罄</div>
      </div>
      <div class="bnt acea-row" v-if="$route.params.status === '2'">
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">未开始</div>
      </div>
      <div class="bnt acea-row" v-if="$route.params.status === '0'">
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">已结束</div>
      </div>
    </div>
    <ProductWindow v-on:changeFun="changeFun" :attr="attr"></ProductWindow>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
  </div>
</template>
<script>
import ProductConSwiper from "@components/ProductConSwiper";
import CountDown from "@components/CountDown";
import ProductWindow from "@components/ProductWindow";
import StorePoster from "@components/StorePoster";
import UserEvaluation from "@components/UserEvaluation";
import { getSeckillDetail } from "@api/activity";
import { postCartAdd } from "@api/store";
import { imageBase64 } from "@api/public";
import { isWeixin } from "@utils/index";
import { openShareAll } from "@libs/wechat";
import { getCollectAdd, getCollectDel } from "@api/user";
import debounce from "lodash.debounce";
const NAME = "SeckillDetails";
export default {
  name: "SeckillDetails",
  components: {
    ProductConSwiper,
    CountDown,
    ProductWindow,
    StorePoster,
    UserEvaluation
  },
  props: {},
  data: function() {
    return {
      domStatus: false,
      posterData: {
        image: "",
        title: "",
        price: "",
        code: ""
      },
      posterImageStatus: false,
      action: "",
      imgUrls: [],
      storeInfo: [],
      replyCount: 0,
      replyChance: 0,
      reply: [],
      cartNum: 1,
      attr: {
        cartAttr: false,
        productSelect: {
          image: "",
          store_name: "",
          price: "",
          quota: 0,
          unique: "",
          cart_num: 1,
          quota_show: 0,
          product_stock: 0
        },
        productAttr: []
      },
      datatime: 0,
      attrTxt: "请选择",
      isOpen: false, //是否打开属性组件
      attrValue: "",
      cart_num: 1, //购买数量
      productValue: [],
      navList: [],
      lock: false,
      navActive: 0,
      opacity: 0,
      storeSelfMention: true,
      storeItems: {},
      activity: []
    };
  },
  watch: {
    $route: function(n) {
      var that = this;
      if (n.name === NAME) {
        that.mountedStart();
      }
    }
  },
  mounted: function() {
    document.addEventListener("scroll", this.onScroll, false);
    window.addEventListener("scroll", this.handleScroll);
    this.mountedStart();
  },
  methods: {
    // 去评价页面
    goReply: function() {
      var that = this;
      that.$router.push({
        path: "/evaluate_list/" + that.storeInfo.product_id
      });
    },
    //收藏商品
    setCollect: function() {
      let that = this,
        id = that.storeInfo.product_id,
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
    //打开属性插件；
    selecAttrTap: function() {
      if (this.$route.params.status === "1") {
        this.attr.cartAttr = true;
        this.isOpen = true;
      }
    },
    openAlone: function() {
      this.$router.push({ path: "/detail/" + this.storeInfo.product_id });
    },
    mountedStart: function() {
      var that = this;
      let id = that.$route.params.id;
      let status = that.$route.params.status;
      that.datatime = parseInt(that.$route.params.time);
      getSeckillDetail(id, that.datatime, status)
        .then(res => {
          that.$set(that, "storeInfo", res.data.storeInfo);
          that.$set(that, "imgUrls", res.data.storeInfo.images);
          that.$set(that, "replyCount", res.data.replyCount);
          that.$set(that, "replyChance", res.data.replyChance);
          if (res.data.reply)
            that.$set(that, "reply", Array.from(res.data.reply) || []);
          that.posterData.image = that.storeInfo.image_base;
          that.attr.productAttr = res.data.productAttr;
          that.productValue = res.data.productValue;
          let navList = ["商品", "评价", "详情"];
          that.navList = navList;
          that.updateTitle();
          if (that.storeInfo.title.length > 30) {
            that.posterData.title =
              that.storeInfo.title.substring(0, 30) + "...";
          } else {
            that.posterData.title = that.storeInfo.title;
          }
          that.posterData.price = that.storeInfo.price;
          that.posterData.code = that.storeInfo.code_base;
          that.setProductSelect();
          that.domStatus = true;
          that.getImageBase64();
          that.setShare();
          that.DefaultSelect();
        })
        .catch(err => {
          that.$dialog.error(err.msg);
          that.$router.go(-1);
        });
    },
    setShare: function() {
      isWeixin() &&
        openShareAll({
          desc: this.storeInfo.info,
          title: this.storeInfo.title,
          link: location.href,
          imgUrl: this.storeInfo.image
        });
    },
    getImageBase64: function() {
      let that = this;
      imageBase64(this.posterData.image, that.posterData.code).then(res => {
        that.posterData.image = res.data.image;
        that.posterData.code = res.data.code;
      });
    },
    updateTitle() {
      document.title = this.storeInfo.title || this.$route.meta.title;
    },
    setPosterImageStatus: function() {
      var sTop = document.body || document.documentElement;
      sTop.scrollTop = 0;
      this.posterImageStatus = !this.posterImageStatus;
    },
    //将父级向子集多次传送的函数合二为一；
    changeFun: function(opt) {
      if (typeof opt !== "object") opt = {};
      let action = opt.action || "";
      let value = opt.value === undefined ? "" : opt.value;
      this[action] && this[action](value);
    },
    changeattr: function(res) {
      var that = this;
      that.attr.cartAttr = res;
    },
    //选择属性；
    ChangeAttr: function(res) {
      let productSelect = this.productValue[res];
      this.$set(this.attr.productSelect, "num", this.storeInfo.num);
      if (productSelect) {
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "quota", productSelect.quota);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(
          this.attr.productSelect,
          "product_stock",
          productSelect.product_stock
        );
        this.$set(
          this.attr.productSelect,
          "quota_show",
          productSelect.quota_show
        );
        this.$set(this, "attrValue", res);
        this.$set(this, "attrTxt", "已选择");
      } else {
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "quota", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this.attr.productSelect, "quota_show", 0);
        this.$set(this.attr.productSelect, "product_stock", 0);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      }
    },
    ChangeCartNum: function(res) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.productValue[this.attrValue];
      //如果没有属性,赋值给商品默认库存
      if (productSelect === undefined && !this.attr.productAttr.length)
        productSelect = this.attr.productSelect;
      if (productSelect === undefined) return;
      let quota = productSelect.quota || 0;
      let nums = this.storeInfo.num || 0;
      let num = this.attr.productSelect;
      let productStock = num.product_stock || 0;
      if (res) {
        num.cart_num++;
        let arrMin = [];
        arrMin.push(nums);
        arrMin.push(quota);
        arrMin.push(productStock);
        let minN = Math.min.apply(null, arrMin);
        if (num.cart_num >= minN) {
          this.$set(this.attr.productSelect, "cart_num", minN ? minN : 1);
          this.$set(this, "cart_num", minN ? minN : 1);
        }
        // if (num.cart_num > quota) {
        //   this.$set(this.attr.productSelect, "cart_num", quota);
        //   this.$set(this, "cart_num", quota);
        // }
      } else {
        num.cart_num--;
        if (num.cart_num < 1) {
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "cart_num", 1);
        }
      }
    },
    //默认选中属性；
    DefaultSelect: function() {
      let productAttr = this.attr.productAttr,
        value = [];
      for (var key in this.productValue) {
        if (this.productValue[key].quota > 0) {
          value = this.attr.productAttr.length ? key.split(",") : [];
          break;
        }
      }
      for (let i = 0; i < productAttr.length; i++) {
        this.$set(productAttr[i], "index", value[i]);
      }
      this.$set(this.attr.productSelect, "num", this.storeInfo.num);
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.productValue[value.sort().join(",")];
      if (productSelect && productAttr.length) {
        this.$set(this.attr.productSelect, "store_name", this.storeInfo.title);
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "quota", productSelect.quota);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(
          this.attr.productSelect,
          "product_stock",
          productSelect.product_stock
        );
        this.$set(
          this.attr.productSelect,
          "quota_show",
          productSelect.quota_show
        );
        this.$set(this, "attrValue", value.sort().join(","));
        this.$set(this, "attrTxt", "已选择");
      } else if (!productSelect && productAttr.length) {
        this.$set(this.attr.productSelect, "store_name", this.storeInfo.title);
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "quota", this.storeInfo.quota || 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(
          this.attr.productSelect,
          "quota_show",
          this.storeInfo.quota_show || 0
        );
        this.$set(
          this.attr.productSelect,
          "product_stock",
          this.storeInfo.product_stock || 0
        );
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      } else if (!productSelect && !productAttr.length) {
        this.$set(this.attr.productSelect, "store_name", this.storeInfo.title);
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "quota", this.storeInfo.quota);
        this.$set(
          this.attr.productSelect,
          "quota_show",
          this.storeInfo.quota_show
        );
        this.$set(
          this.attr.productSelect,
          "product_stock",
          this.storeInfo.product_stock
        );
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
    setProductSelect: function() {
      var that = this;
      var attr = that.attr;
      attr.productSelect.image = that.storeInfo.image;
      attr.productSelect.store_name = that.storeInfo.title;
      attr.productSelect.price = that.storeInfo.price;
      attr.productSelect.quota = 0;
      attr.productSelect.product_stock = 0;
      attr.cartAttr = false;
      that.$set(attr.productSelect, "num", that.storeInfo.num);
      that.$set(that, "attr", attr);
    },
    tapBuy: function() {
      var that = this;
      if (that.attr.cartAttr == false) {
        that.attr.cartAttr = !this.attr.attrcartAttr;
      } else {
        var data = {};
        data.productId = that.storeInfo.product_id;
        data.cartNum = that.attr.productSelect.cart_num;
        data.uniqueId = that.attr.productSelect.unique;
        data.secKillId = that.storeInfo.id;
        data.new = 1;
        postCartAdd(data)
          .then(res => {
            that.$router.push({
              path: "/order/submit/" + res.data.cartId
            });
          })
          .catch(res => {
            this.$dialog.error(res.msg);
          });
      }
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
      titles.push(document.querySelector("#title2"));
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
    }, 500)
  },
  beforeDestroy: function() {
    document.removeEventListener("scroll", this.onScroll, false);
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped>
.product-con .header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.96rem;
  font-size: 0.3rem !important;
  color: #050505;
  background-color: #fff;
  z-index: 11;
  border-bottom: 0.01rem solid #eee;
}
.product-con .header .item {
  position: relative;
  margin: 0 0.35rem;
  font-size: 0.3rem !important;
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
.noscroll {
  height: 100%;
  overflow: hidden;
}
.bg-color-hui {
  background: #bbbbbb !important;
  line-height: 0.76rem;
  text-align: center;
}
.item {
  font-size: 0.2rem;
  color: #666;
  text-align: center;
}
.product-con .nav {
  padding: 0 0.2rem;
}
.product-con .bnt {
  width: 77% !important;
}
.product-con .bnt > div {
  width: 50% !important;
}
.icon-shoucang1 {
  color: #e93323;
}
</style>
