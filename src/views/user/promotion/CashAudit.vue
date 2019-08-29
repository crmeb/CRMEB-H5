<template>
  <div class="cash-audit">
    <div class="pictrue"><img src="@assets/images/examine.png" /></div>
    <div class="tip">提现申请已提交，等待人工审核</div>
    <div class="time">{{ time }}</div>
    <div
      class="bnt bg-color-red"
      @click="$router.push({ path: '/user/user_promotion' })"
    >
      好的
    </div>
  </div>
</template>
<script>
export default {
  name: "CashAudit",
  components: {},
  props: {},
  data: function() {
    return {
      time: ""
    };
  },
  mounted: function() {
    let myData = new Date();
    this.time = myData.toLocaleString();
  },
  methods: {}
};
</script>
