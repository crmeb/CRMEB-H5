<template>
  <div class="sharing-packets" :class="state === true ? 'on' : ''">
    <div
      class="iconfont icon-guanbi acea-row row-center-wrapper"
      @click="closeShare"
    ></div>
    <div class="line"></div>
    <div class="sharing-con" @click="goShare">
      <img src="@assets/images/red-packets.png" class="image" />
      <div class="text font-color-red">
        <div>会员分享返</div>
        <div class="money"><span class="label">￥</span>{{ priceName }}</div>
        <div class="tip">下单即返佣金</div>
        <div class="shareBut">立即分享</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShareRedPackets",
  props: {
    priceName: {
      type: [String, Number],
      default: ""
    }
  },
  data: function() {
    return {
      state: false
    };
  },
  mounted: function() {},
  methods: {
    goShare: function() {
      this.$emit("changeFun", { action: "shareCode", value: false });
    },
    closeShare: function() {
      this.state = true;
    }
  }
};
</script>
