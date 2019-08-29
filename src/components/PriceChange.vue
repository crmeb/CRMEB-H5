<template>
  <div>
    <div class="priceChange" :class="change === true ? 'on' : ''">
      <div class="priceTitle">
        {{
          status == 0
            ? orderInfo.refund_status === 1
              ? "立即退款"
              : "一键改价"
            : "订单备注"
        }}
        <span class="iconfont icon-guanbi" @click="close"></span>
      </div>
      <div class="listChange" v-if="status == 0">
        <div
          class="item acea-row row-between-wrapper"
          v-if="orderInfo.refund_status === 0"
        >
          <div>商品总价(¥)</div>
          <div class="money">
            {{ orderInfo.total_price }}<span class="iconfont icon-suozi"></span>
          </div>
        </div>
        <div
          class="item acea-row row-between-wrapper"
          v-if="orderInfo.refund_status === 0"
        >
          <div>原始邮费(¥)</div>
          <div class="money">
            {{ orderInfo.pay_postage }}<span class="iconfont icon-suozi"></span>
          </div>
        </div>
        <div
          class="item acea-row row-between-wrapper"
          v-if="orderInfo.refund_status === 0"
        >
          <div>实际支付(¥)</div>
          <div class="money">
            <input
              type="text"
              v-model="price"
              :class="focus === true ? 'on' : ''"
              @focus="priceChange"
            />
          </div>
        </div>
        <div
          class="item acea-row row-between-wrapper"
          v-if="orderInfo.refund_status === 1"
        >
          <div>实际支付(¥)</div>
          <div class="money">
            {{ orderInfo.pay_price }}<span class="iconfont icon-suozi"></span>
          </div>
        </div>
        <div
          class="item acea-row row-between-wrapper"
          v-if="orderInfo.refund_status === 1"
        >
          <div>退款金额(¥)</div>
          <div class="money">
            <input
              type="text"
              v-model="refund_price"
              :class="focus === true ? 'on' : ''"
              @focus="priceChange"
            />
          </div>
        </div>
      </div>
      <div class="listChange" v-else>
        <textarea
          :placeholder="
            orderInfo.remark ? orderInfo.remark : '请填写备注信息...'
          "
          v-model="remark"
        ></textarea>
      </div>
      <div class="modify" @click="save">
        {{ orderInfo.refund_status === 0 ? "立即修改" : "确认退款" }}
      </div>
      <div class="modify1" @click="refuse" v-if="orderInfo.refund_status === 1">
        拒绝退款
      </div>
    </div>
    <div class="mask" @touchmove.prevent v-show="change === true"></div>
  </div>
</template>
<style scoped>
.priceChange .listChange textarea {
  border: 1px solid #eee;
  width: 100%;
  height: 2rem;
  margin-top: 0.5rem;
  border-radius: 0.1rem;
  color: #333;
  padding: 0.2rem;
}
</style>
<script>
export default {
  name: "PriceChange",
  components: {},
  props: {
    change: Boolean,
    orderInfo: Object,
    status: String
  },
  data: function() {
    return {
      focus: false,
      price: 0,
      refund_price: 0,
      remark: ""
    };
  },
  watch: {
    orderInfo: function() {
      this.price = this.orderInfo.pay_price;
      this.refund_price = this.orderInfo.pay_price;
      this.remark = "";
    }
  },
  mounted: function() {},
  methods: {
    priceChange: function() {
      this.focus = true;
    },
    close: function() {
      this.price = this.orderInfo.pay_price;
      this.$emit("closechange", false);
    },
    save: function() {
      let that = this;
      that.$emit("savePrice", {
        price: that.price,
        refund_price: that.refund_price,
        type: 1,
        remark: that.remark
      });
    },
    refuse: function() {
      let that = this;
      that.$emit("savePrice", {
        price: that.price,
        refund_price: that.refund_price,
        type: 2,
        remark: that.remark
      });
    }
  }
};
</script>
