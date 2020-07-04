<template>
  <div class="generalWindow">
    <div :class="generalActive == true ? 'on' : ''" class="generalTip">
      <div class="pictrue">
        <img src="../assets/images/promoter.png" />
      </div>
      <div class="name" v-text="generalContent.title"></div>
      <div class="info" v-html="generalContent.promoterNum"></div>
      <div class="tipBnt" @click="close">我知道了</div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      v-show="generalActive"
      @click="close"
    ></div>
  </div>
</template>

<script>
export default {
  name: "GeneralWindow",
  props: {
    generalActive: {
      type: Boolean,
      default: false
    },
    generalContent: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    close: function() {
      this.$emit("closeGeneralWindow", false);
    }
  }
};
</script>

<style scoped>
.generalWindow .generalTip {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 5.6rem;
  margin-left: -2.8rem;
  z-index: 666;
  border-radius: 0.2rem;
  background-color: #fff;
  transition: all 0.3s ease-in-out 0s;
  opacity: 0;
  transform: scale(0);
  padding-bottom: 0.6rem;
  margin-top: -3.3rem;
}
.generalWindow .generalTip.on {
  opacity: 1;
  transform: scale(1);
}
.generalWindow .generalTip .pictrue {
  width: 100%;
  height: 2.7rem;
}
.generalWindow .generalTip .pictrue img {
  width: 100%;
  height: 100%;
  border-radius: 0.2rem 0.2rem 0 0;
}
.generalWindow .generalTip .name {
  font-size: 0.36rem;
  font-weight: bold;
  color: #282828;
  text-align: center;
  padding: 0 0.29rem;
  margin-top: 0.37rem;
}
.generalWindow .generalTip .info {
  font-size: 0.3rem;
  color: #666;
  padding: 0 0.29rem;
  text-align: center;
  margin-top: 0.21rem;
}
.generalWindow .generalTip .info .money {
  font-weight: bold;
  margin: 0 0.1rem;
}
.generalWindow .generalTip .help {
  font-size: 0.32rem;
  font-weight: bold;
  text-align: center;
  margin-top: 0.4rem;
}
.generalWindow .generalTip .tipBnt {
  font-size: 0.32rem;
  color: #fff;
  width: 3.6rem;
  height: 0.82rem;
  border-radius: 0.41rem;
  background-image: linear-gradient(to right, #f67a38 0%, #f11b09 100%);
  text-align: center;
  line-height: 0.82rem;
  margin: 0.5rem auto 0 auto;
}
</style>
