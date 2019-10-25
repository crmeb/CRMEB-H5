<template>
  <div class="my-promotion">
    <div class="header">
      <div class="name acea-row row-center-wrapper">
        <div>当前佣金</div>
        <router-link class="record" :to="'/user/cashrecord'">
          提现记录<span class="iconfont icon-xiangyou"></span>
        </router-link>
      </div>
      <div class="num">{{ userInfo.brokerage_price || 0 }}</div>
      <div class="profit acea-row row-between-wrapper">
        <div class="item">
          <div>昨日收益</div>
          <div class="money">{{ userInfo.yesterDay || 0 }}</div>
        </div>
        <div class="item">
          <div>累积已提</div>
          <div class="money">{{ userInfo.extractTotalPrice || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="bnt bg-color-red" @click="toCash">立即提现</div>
    <div class="list acea-row row-between-wrapper">
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/poster'"
      >
        <span class="iconfont icon-erweima"></span>
        <div>推广名片</div>
      </router-link>
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/promoter_list'"
      >
        <span class="iconfont icon-tongji"></span>
        <div>推广人统计</div>
      </router-link>
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/commission'"
      >
        <span class="iconfont icon-qiandai"></span>
        <div>佣金明细</div>
      </router-link>
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/promoter_order'"
      >
        <span class="iconfont icon-dingdan"></span>
        <div>推广人订单</div>
      </router-link>
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/promoter_rank'"
      >
        <span class="iconfont icon-paihang1"></span>
        <div>推广人排行</div>
      </router-link>
      <router-link
        class="item acea-row row-center-wrapper row-column"
        :to="'/user/commission/rank'"
      >
        <span class="iconfont icon-paihang"></span>
        <div>佣金排行</div>
      </router-link>
    </div>
  </div>
</template>
<script>
import { getUser } from "../../../api/user";

export default {
  name: "UserPromotion",
  components: {},
  props: {},
  data: function() {
    return {
      userInfo: {}
    };
  },
  mounted: function() {
    this.getInfo();
  },
  methods: {
    getInfo: function() {
      let that = this;
      getUser().then(
        res => {
          that.userInfo = res.data;
          console.log(that.userInfo);
        },
        function(err) {
          that.$dialog.message(err.msg);
        }
      );
    },
    toCash: function() {
      this.$router.push({ path: "/user/user_cash" });
    }
  }
};
</script>
