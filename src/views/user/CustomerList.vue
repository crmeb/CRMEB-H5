<template>
  <div class="CustomerList">
    <div
      class="item acea-row row-between-wrapper"
      v-for="item in list"
      :key="item.id"
      @click="
        $router.push(
          '/customer/chat/' +
            item.uid +
            '/' +
            productId +
            (orderId ? '?orderId=' + orderId : '')
        )
      "
    >
      <div class="pictrue"><img :src="item.avatar" /></div>
      <div class="text line1">{{ item.nickname }}</div>
    </div>
  </div>
</template>
<script>
import { serviceList } from "@api/user";

export default {
  name: "CustomerList",
  data() {
    return {
      list: [],
      productId: 0,
      orderId: ""
    };
  },
  watch: {
    $route(n) {
      if (n.name === "CustomerList") {
        if (n.params.productId) this.productId = n.params.productId;
        else this.productId = 0;

        if (n.query.orderId) this.orderId = n.query.orderId;
        else this.orderId = "";
      }
    }
  },
  methods: {
    getList() {
      serviceList().then(res => {
        this.list = res.data;
      });
    }
  },
  mounted() {
    this.getList();
    if (this.$route.params.productId)
      this.productId = this.$route.params.productId;
    if (this.$route.query.orderId) this.orderId = this.$route.query.orderId;
  }
};
</script>
<style scoped>
.CustomerList {
  margin-top: 0.13rem;
}
.CustomerList .item {
  height: 1.38rem;
  border-bottom: 1px solid #eee;
  padding: 0 0.24rem;
  background-color: #fff;
}
.CustomerList .item .pictrue {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: 0.03rem solid #fff;
  box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
  -webkit-box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
  -moz-box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
}
.CustomerList .item .pictrue img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.CustomerList .item .text {
  width: 5.82rem;
  font-size: 0.32rem;
  color: #000;
}
</style>
