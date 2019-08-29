<template>
  <div class="return-list" ref="container">
    <div class="goodWrapper" v-for="order in orderList" :key="order.order_id">
      <div
        class="iconfont icon-tuikuanzhong powder"
        v-if="order._status._type === -1"
      ></div>
      <div
        class="iconfont icon-yituikuan"
        v-if="order._status._type === -2"
      ></div>
      <div class="orderNum">订单号：{{ order.order_id }}</div>
      <div
        class="item acea-row row-between-wrapper"
        v-for="cart in order.cartInfo"
        :key="cart.id"
        @click="$router.push({ path: '/order/detail/' + order.order_id })"
      >
        <div class="pictrue">
          <img
            :src="cart.productInfo.image"
            class="image"
            @click.stop="
              $router.push({ path: '/detail/' + cart.productInfo.id })
            "
          />
        </div>
        <div class="text">
          <div class="acea-row row-between-wrapper">
            <div class="name line1">{{ cart.productInfo.store_name }}</div>
            <div class="num">x {{ cart.cart_num }}</div>
          </div>
          <div class="attr line1" v-if="cart.productInfo.attrInfo">
            {{ cart.productInfo.attrInfo.suk }}
          </div>
          <div class="attr line1" v-else>{{ cart.productInfo.store_name }}</div>
          <div class="money">￥{{ cart.productInfo.price }}</div>
        </div>
      </div>
      <div class="totalSum">
        共{{ order.cartInfo.length || 0 }}件商品，总金额
        <span class="font-color-red price">￥{{ order.pay_price }}</span>
      </div>
    </div>
    <div class="noCart" v-if="orderList.length === 0 && page > 1">
      <div class="pictrue"><img src="@assets/images/noOrder.png" /></div>
    </div>
    <Loading :loaded="loaded" :loading="loading"></Loading>
  </div>
</template>

<script>
import { getOrderList } from "@api/order";
import Loading from "@components/Loading";

export default {
  name: "ReturnList",
  components: {
    Loading
  },
  data() {
    return {
      orderList: [],
      page: 1,
      limit: 20,
      loading: false,
      loaded: false
    };
  },
  methods: {
    getOrderList() {
      const { page, limit } = this;
      if (this.loading || this.loaded) return;
      this.loading = true;
      getOrderList({
        page,
        limit,
        type: -3
      }).then(res => {
        this.orderList = this.orderList.concat(res.data);
        this.loading = false;
        this.loaded = res.data.length < limit;
        this.page++;
      });
    }
  },
  mounted() {
    this.getOrderList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getOrderList();
    });
  }
};
</script>
