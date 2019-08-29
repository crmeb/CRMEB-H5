<template>
  <div class="sign">
    <div class="header bg-color-red">
      <div class="headerCon acea-row row-between-wrapper">
        <div class="left acea-row row-between-wrapper">
          <div class="pictrue"><img :src="userInfo.avatar" /></div>
          <div class="text">
            <div class="line1">{{ userInfo.nickname }}</div>
            <div class="integral acea-row">
              <span>积分: {{ userInfo.integral }}</span>
            </div>
          </div>
        </div>
        <router-link
          :to="'/user/sign_record'"
          class="right acea-row row-middle"
        >
          <div class="iconfont icon-caidan"></div>
          <div>明细</div>
        </router-link>
      </div>
    </div>
    <div class="wrapper">
      <div class="list acea-row row-between-wrapper">
        <div class="item" v-for="(item, index) in signSystemList" :key="index">
          <div :class="index + 1 === signSystemList.length ? 'rewardTxt' : ''">
            {{ item.day }}
          </div>
          <div
            class="venus"
            :class="
              (index + 1 === signSystemList.length ? 'reward' : '') +
                ' ' +
                (sign_index >= index + 1 ? 'venusSelect' : '')
            "
          ></div>
          <div class="num" :class="sign_index >= index + 1 ? 'on' : ''">
            +{{ item.sign_num }}
          </div>
        </div>
      </div>
      <!--加在 but 上 on 为已签到-->
      <div
        class="but bg-color-red"
        :class="userInfo.is_day_sgin ? 'on' : ''"
        @click="goSign"
      >
        {{ userInfo.is_day_sgin ? "已签到" : "立即签到" }}
      </div>
      <div class="lock"></div>
    </div>
    <div class="wrapper wrapper2">
      <div class="tip">已累计签到</div>
      <div class="list2 acea-row row-center row-bottom">
        <div class="item" v-for="(item, index) in signCount" :key="index">
          {{ item || 0 }}
        </div>
        <div class="data">天</div>
      </div>
      <div class="tip2">
        据说连续签到第{{ day }}天可获得超额积分，一定要坚持签到哦~~~
      </div>
      <div class="list3">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, index) in signList"
          :key="index"
        >
          <div>
            <div class="name line1">{{ item.title }}</div>
            <div class="data">{{ item.add_time }}</div>
          </div>
          <div class="num font-color-red">+{{ item.number }}</div>
        </div>
        <router-link
          :to="'/user/sign_record'"
          class="Loads acea-row row-center-wrapper"
          v-if="signList.length > 0"
        >
          点击加载更多
          <div class="iconfont icon-xiangyou acea-row row-center-wrapper"></div>
        </router-link>
      </div>
    </div>
    <div
      class="signTip acea-row row-center-wrapper"
      :class="active === true ? 'on' : ''"
    >
      <div class="signTipLight loadingpic"></div>
      <div class="signTipCon">
        <div class="state">签到成功</div>
        <div class="integral">获得{{ integral }}积分</div>
        <div class="signTipBnt" @click="close">好的</div>
      </div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="active === false"></div>
  </div>
</template>
<style scoped>
.Loads .iconfont {
  font-size: 0.25rem;
  margin: 0.02rem 0 0 0.1rem;
}
</style>
<script>
import {
  postSignUser,
  getSignConfig,
  postSignIntegral,
  getSignList
} from "@api/user";
import { add } from "@utils/bc";

export default {
  name: "Sign",
  components: {},
  props: {},
  data: function() {
    return {
      userInfo: {},
      integral: 0,
      signCount: [],
      sign_index: 0,
      signSystemList: [],
      signList: [],
      page: 1,
      limit: 3,
      active: false,
      day: ""
    };
  },
  mounted: function() {
    this.signUser();
    this.signConfig();
    this.getSignList();
  },
  methods: {
    // js给数字补0；num：需要补0的数字，length：长度（补到多少位）；
    PrefixInteger: function(num, length) {
      return (Array(length).join("0") + num).slice(-length).split("");
    },
    //数字转中文
    Rp: function(n) {
      var cnum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var s = "";
      n = "" + n; // 数字转为字符串
      for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
      }
      return s;
    },
    // 获取用户信息
    signUser: function() {
      let that = this;
      postSignUser({ sign: 1 }).then(res => {
        res.data.integral = parseInt(res.data.integral);
        var sumSginDay = res.data.sum_sgin_day;
        that.userInfo = res.data;
        that.signCount = that.PrefixInteger(sumSginDay, 4);
        that.sign_index = parseInt(res.data.sign_num);
      });
    },
    // 签到配置
    signConfig: function() {
      let that = this;
      getSignConfig().then(res => {
        that.signSystemList = res.data;
        that.day = that.Rp(that.signSystemList.length);
      });
    },
    //  用户签到
    goSign: function() {
      let that = this,
        sumSginDay = that.userInfo.sum_sgin_day;
      if (that.userInfo.is_day_sgin)
        return that.$dialog.toast({ mes: "您今日已签到!" });
      postSignIntegral().then(res => {
        that.active = true;
        that.integral = res.data.integral;
        let sign_index = parseInt(that.sign_index + 1);
        that.sign_index =
          sign_index > that.signSystemList.length ? 1 : sign_index;
        that.signCount = that.PrefixInteger(sumSginDay + 1, 4);
        that.userInfo.is_day_sgin = true;
        that.userInfo.integral = add(that.userInfo.integral, res.data.integral);
        that.getSignList();
      });
    },
    //  获取签到列表;
    getSignList: function() {
      let that = this;
      getSignList(that.page, that.limit).then(res => {
        that.signList = res.data;
      });
    },
    close: function() {
      this.active = false;
    }
  }
};
</script>
