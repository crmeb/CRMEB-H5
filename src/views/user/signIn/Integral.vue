<template>
  <div class="integral-details" ref="container">
    <div class="header">
      <div class="currentScore">当前积分</div>
      <div>{{ info.integral }}</div>
      <div class="line"></div>
      <div class="nav acea-row">
        <div class="item">
          <div class="num">{{ info.sum_integral }}</div>
          <div>累计积分</div>
        </div>
        <div class="item">
          <div class="num">{{ info.deduction_integral }}</div>
          <div>累计消费</div>
        </div>
        <div class="item">
          <div class="num">{{ info.today_integral }}</div>
          <div>今日获得</div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="nav acea-row">
        <div
          class="item acea-row row-center-wrapper"
          :class="current === index ? 'on' : ''"
          v-for="(item, index) in navList"
          :key="index"
          @click="nav(index)"
        >
          <span class="iconfont" :class="item.icon"></span>{{ item.name }}
        </div>
      </div>
      <div class="list" :hidden="current !== 0">
        <div class="tip acea-row row-middle">
          <span class="iconfont icon-shuoming"></span
          >提示：积分数值的高低会直接影响您的会员等级
        </div>
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, index) in list"
          :key="index"
        >
          <div>
            <div class="state">{{ item.mark }}</div>
            <div>{{ item.add_time }}</div>
          </div>
          <div class="num" v-if="item.pm == 1">+{{ item.number }}</div>
          <div class="num font-color-red" v-if="item.pm == 0">
            -{{ item.number }}
          </div>
        </div>
      </div>
      <div class="list2" :hidden="current !== 1">
        <router-link class="item acea-row row-between-wrapper" :to="'/'">
          <div class="pictrue"><img src="@assets/images/score.png" /></div>
          <div class="name">购买商品可获得积分奖励</div>
          <div class="earn">赚积分</div>
        </router-link>
        <router-link
          class="item acea-row row-between-wrapper"
          :to="'/user/sign'"
        >
          <div class="pictrue"><img src="@assets/images/score.png" /></div>
          <div class="name">每日签到可获得积分奖励</div>
          <div class="earn">赚积分</div>
        </router-link>
      </div>
    </div>
    <Loading :loaded="loaded" :loading="loading"></Loading>
  </div>
</template>
<script>
import { getIntegralList, postSignUser } from "../../../api/user";
import Loading from "@components/Loading";
export default {
  name: "Integral",
  components: {
    Loading
  },
  props: {},
  data: function() {
    return {
      navList: [
        { name: "分值明细", icon: "icon-mingxi" },
        { name: "分值提升", icon: "icon-tishengfenzhi" }
      ],
      current: 0,
      where: {
        page: 1,
        limit: 15
      },
      data: {
        sign: 1,
        integral: 1,
        all: 1
      },
      list: [],
      info: [],
      loaded: false,
      loading: false
    };
  },
  mounted: function() {
    this.getIntegral();
    this.getInfo();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getInfo();
    });
  },
  methods: {
    nav: function(index) {
      this.current = index;
    },
    getInfo: function() {
      let that = this;
      if (that.loaded == true || that.loading == true) return;
      that.loading = true;
      getIntegralList(that.where).then(
        res => {
          that.loading = false;
          that.loaded = res.data.length < that.where.limit;
          that.loadTitle = that.loaded ? "人家是有底线的" : "上拉加载更多";
          that.where.page = that.where.page + 1;
          that.list.push.apply(that.list, res.data);
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    },
    getIntegral: function() {
      let that = this;
      postSignUser(that.data).then(
        res => {
          that.info = res.data;
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    }
  }
};
</script>
