<template>
  <div
    :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']"
    v-show="domStatus"
  >
    <ProductConSwiper :imgUrls="imgUrls"></ProductConSwiper>
    <div class="nav acea-row row-between-wrapper">
      <div class="money">
        ￥<span class="num" v-text="storeInfo.price"></span
        ><span class="y-money" v-text="'￥' + storeInfo.ot_price"></span>
      </div>
      <div class="acea-row row-middle">
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
        <div class="iconfont icon-jiantou"></div>
      </div>
    </div>
    <div class="wrapperRush">
      <div class="introduce acea-row row-between">
        <div class="infor" v-text="storeInfo.title"></div>
        <div class="iconfont icon-fenxiang" @click="setPosterImageStatus"></div>
      </div>
      <div class="label acea-row row-middle">
        <div class="stock" v-text="'库存:' + storeInfo.stock + '件'"></div>
        <div v-text="'销量:' + storeInfo.sales + '件'"></div>
      </div>
    </div>
    <div class="product-intro">
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
      <div class="bnt bg-color-red" @click="tapBuy">立即购买</div>
    </div>
    <ProductWindow v-on:changeFun="changeFun" :attr="attr"></ProductWindow>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
  </div>
</template>
<style scoped>
.noscroll {
  height: 100%;
  overflow: hidden;
}
</style>
<script>
import ProductConSwiper from "@components/ProductConSwiper";
import CountDown from "@components/CountDown";
import ProductWindow from "@components/ProductWindow";
import StorePoster from "@components/StorePoster";
import { getSeckillDetail } from "@api/activity";
import { postCartAdd } from "@api/store";
import { imageBase64 } from "@api/public";
import { isWeixin } from "@utils/index";
import { openShareAll } from "@libs/wechat";

const NAME = "SeckillDetails";

export default {
  name: "SeckillDetails",
  components: {
    ProductConSwiper,
    CountDown,
    ProductWindow,
    StorePoster
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
      reply: [],
      cartNum: 1,
      attr: {
        cartAttr: false,
        productSelect: {
          image: "",
          store_name: "",
          price: "",
          stock: "",
          unique: "",
          cart_num: 1
        }
      },
      datatime: 0
    };
  },
  watch: {
    $route: function(n) {
      var that = this;
      console.log(n);
      if (n.name === NAME) {
        that.mountedStart();
      }
    }
  },
  mounted: function() {
    this.mountedStart();
  },
  methods: {
    mountedStart: function() {
      var that = this;
      let id = that.$route.params.id;
      that.datatime = parseInt(that.$route.params.time);
      getSeckillDetail(id).then(res => {
        that.$set(that, "storeInfo", res.data.storeInfo);
        that.$set(that, "imgUrls", res.data.storeInfo.images);
        that.$set(that, "replyCount", res.data.replyCount);
        that.$set(that, "reply", res.data.reply);
        that.posterData.image = that.storeInfo.image_base;
        that.updateTitle();
        if (that.storeInfo.title.length > 30) {
          that.posterData.title = that.storeInfo.title.substring(0, 30) + "...";
        } else {
          that.posterData.title = that.storeInfo.title;
        }
        that.posterData.price = that.storeInfo.price;
        that.posterData.code = that.storeInfo.code_base;
        that.setProductSelect();
        that.domStatus = true;
        that.getImageBase64();
        that.setShare();
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
    ChangeCartNum: function(res) {
      var that = this;
      if (res) {
        if (that.attr.productSelect.cart_num < that.storeInfo.stock) {
          that.attr.productSelect.cart_num++;
        }
      } else {
        if (that.attr.productSelect.cart_num > 1) {
          that.attr.productSelect.cart_num--;
        }
      }
    },
    setProductSelect: function() {
      var that = this;
      var attr = that.attr;
      attr.productSelect.image = that.storeInfo.image;
      attr.productSelect.store_name = that.storeInfo.title;
      attr.productSelect.price = that.storeInfo.price;
      attr.productSelect.stock = that.storeInfo.stock;
      attr.cartAttr = false;
      that.$set(that, "attr", attr);
    },
    selecAttrTap: function() {
      this.cartAttr = true;
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
    }
  }
};
</script>
<style scoped>
.product-con .nav {
  padding: 0 0.2rem;
}
</style>
