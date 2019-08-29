<template>
  <div class="logistics">
    <div
      class="header acea-row row-between row-top"
      v-for="cart in cartInfo"
      :key="cart.id"
    >
      <div class="pictrue"><img :src="cart.productInfo.image" /></div>
      <div class="text acea-row row-between">
        <div class="name line2">
          {{ cart.productInfo.store_name }}
        </div>
        <div class="money">
          <div>￥{{ cart.truePrice }}</div>
          <div>x{{ cart.cart_num }}</div>
        </div>
      </div>
    </div>
    <div class="logisticsCon">
      <div class="company acea-row row-between-wrapper">
        <div class="picTxt acea-row row-between-wrapper">
          <div class="iconfont icon-wuliu"></div>
          <div class="text">
            <div>
              <span class="name line1">物流公司：</span>
              {{ orderInfo.delivery_name }}
            </div>
            <div class="express line1">
              <span class="name">快递单号：</span> {{ orderInfo.delivery_id }}
            </div>
          </div>
        </div>
        <div
          class="copy acea-row row-center-wrapper copy-data"
          :data-clipboard-text="orderInfo.delivery_id"
        >
          复制单号
        </div>
      </div>
      <div class="item" v-for="(express, index) in expressList" :key="index">
        <div class="circular" :class="index === 0 ? 'on' : ''"></div>
        <div class="text">
          <div :class="index === 0 ? 'font-color-red' : ''">
            {{ express.status }}
          </div>
          <div class="data">{{ express.time }}</div>
        </div>
      </div>
    </div>
    <div class="no-express" v-if="loaded && !expressList.length">
      <img src="@assets/images/noExpress.png" />
    </div>
    <Recommend></Recommend>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import ClipboardJS from "clipboard";
import { express } from "@api/order";

const NAME = "Logistics";

export default {
  name: NAME,
  components: {
    Recommend
  },
  data: function() {
    return {
      id: this.$route.params.id,
      cartInfo: [],
      orderInfo: {},
      expressList: [],
      loaded: false
    };
  },
  watch: {
    $route(n) {
      if (n.name === NAME && this.$route.params.id !== this.id) {
        this.id = this.$route.params.id;
        this.getExpress();
      }
    }
  },
  mounted: function() {
    this.getExpress();
  },
  methods: {
    getExpress() {
      if (!this.id) return this.$dialog.error("订单不存在");
      this.loaded = false;
      express(this.id)
        .then(res => {
          const result = res.data.express.result || {};
          this.cartInfo = res.data.order.cartInfo;
          this.orderInfo = res.data.order;
          this.expressList = result.list || [];
          this.loaded = true;
          this.$nextTick(function() {
            var copybtn = document.getElementsByClassName("copy-data");
            const clipboard = new ClipboardJS(copybtn);
            clipboard.on("success", () => {
              this.$dialog.success("复制成功");
            });
          });
        })
        .catch(e => {
          this.$dialog.error(e.msg || "加载失败");
        });
    }
  }
};
</script>

<style scoped>
.no-express {
  margin: 1.5rem 0;
}

.no-express img {
  width: 6rem;
  margin: 0 auto;
  display: block;
}
</style>
