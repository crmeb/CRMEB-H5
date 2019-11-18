<template>
  <div class="PromoterRank">
    <div class="redBg bg-color-red">
      <div class="header">
        <div class="nav acea-row row-center-wrapper">
          <div
            class="item"
            :class="active === index ? 'font-color-red' : ''"
            v-for="(item, index) in navList"
            :key="index"
            @click="active = index"
          >
            {{ item }}
          </div>
        </div>
        <div class="rank acea-row row-bottom row-around">
          <div class="item" v-show="Two.uid">
            <div class="pictrue"><img :src="Two.avatar" /></div>
            <div class="name line1">{{ Two.nickname }}</div>
            <div class="num">{{ Two.count }}人</div>
          </div>
          <div class="item" v-if="One.uid">
            <div class="pictrue"><img :src="One.avatar" /></div>
            <div class="name line1">{{ One.nickname }}</div>
            <div class="num">{{ One.count }}人</div>
          </div>
          <div class="item" v-if="Three.uid">
            <div class="pictrue"><img :src="Three.avatar" /></div>
            <div class="name line1">{{ Three.nickname }}</div>
            <div class="num">{{ Three.count }}人</div>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="rankList.length">
      <div
        class="item acea-row row-between-wrapper"
        v-for="(item, index) in rankList"
        :key="item.nickname"
      >
        <div class="num">{{ index + 4 }}</div>
        <div class="picTxt acea-row row-between-wrapper">
          <div class="pictrue"><img :src="item.avatar" /></div>
          <div class="text line1">{{ item.nickname }}</div>
        </div>
        <div class="people font-color-red">{{ item.count }}人</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.PromoterRank .redBg {
  padding: 0.45rem 0 0.3rem 0;
}
.PromoterRank .header {
  background: url("../../../assets/images/integralbg.jpg") no-repeat;
  width: 100%;
  height: 4.6rem;
  background-size: 100% 100%;
}
.PromoterRank .header .nav {
  width: 4.5rem;
  height: 0.66rem;
  border: 1px solid #fff;
  border-radius: 0.33rem;
  font-size: 0.3rem;
  color: #fff;
  margin: 0 auto;
}
.PromoterRank .header .nav .item {
  width: 2.23rem;
  height: 100%;
  text-align: center;
  line-height: 0.64rem;
}
.PromoterRank .header .nav .item.font-color-red:nth-of-type(1) {
  background-color: #fff;
  border-radius: 0.33rem 0 0 0.33rem;
}
.PromoterRank .header .nav .item.font-color-red:nth-of-type(2) {
  background-color: #fff;
  border-radius: 0 0.33rem 0.33rem 0;
}
.PromoterRank .header .rank {
  padding: 0 0.2rem;
  margin-top: 0.3rem;
}
.PromoterRank .header .rank .item .pictrue {
  background: url("../../../assets/images/twoT.png") no-repeat;
  background-size: 100% 100%;
  width: 1.36rem;
  height: 1.77rem;
  position: relative;
  margin: 0 auto;
}
.PromoterRank .header .rank .item .pictrue img {
  position: absolute;
  width: 1.3rem;
  height: 1.3rem;
  display: block;
  bottom: 0.02rem;
  border-radius: 50%;
  left: 50%;
  margin-left: -0.65rem;
}
.PromoterRank .header .rank .item:nth-of-type(2) .pictrue {
  background-image: url("../../../assets/images/oneT.png");
  width: 1.56rem;
  height: 2.05rem;
}
.PromoterRank .header .rank .item:nth-of-type(2) .pictrue img {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -0.75rem;
}
.PromoterRank .header .rank .item:nth-of-type(3) .pictrue {
  background-image: url("../../../assets/images/threeT.png");
}
.PromoterRank .header .rank .item:nth-of-type(3) .pictrue img {
  margin-left: -0.64rem;
}
.PromoterRank .header .rank .item .name {
  font-size: 0.3rem;
  color: #fff;
  margin-top: 0.22rem;
  text-align: center;
  width: 1.7rem;
}
.PromoterRank .header .rank .item .num {
  font-size: 0.3rem;
  color: #fff;
  text-align: center;
}
.PromoterRank .list {
  width: 7.1rem;
  background-color: #fff;
  border-radius: 0.2rem;
  margin: -0.6rem auto 0 auto;
  padding: 0 0.3rem;
}
.PromoterRank .list .item {
  border-bottom: 1px solid #f3f3f3;
  height: 1.01rem;
  font-size: 0.28rem;
}
.PromoterRank .list .item .num {
  color: #666;
  width: 0.7rem;
}
.PromoterRank .list .item .picTxt {
  width: 3.5rem;
}
.PromoterRank .list .item .picTxt .pictrue {
  width: 0.68rem;
  height: 0.68rem;
}
.PromoterRank .list .item .picTxt .pictrue img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
}
.PromoterRank .list .item .picTxt .text {
  width: 2.62rem;
  color: #333;
}
.PromoterRank .list .item .people {
  width: 1.75rem;
  text-align: right;
}
</style>
<script>
import { getRankList } from "@api/user";
const NAME = "PromoterRank";
export default {
  name: NAME,
  props: {},
  data: function() {
    return {
      navList: ["周榜", "月榜"],
      active: 0,
      page: 1,
      limit: 10,
      loading: false,
      loadend: false,
      rankList: [],
      One: {},
      Two: {},
      Three: {},
      type: "week"
    };
  },
  watch: {
    $route(n) {
      if (n.name === NAME) {
        this.loaded = false;
        this.page = 1;
        this.$set(this, "rankList", []);
        this.getRankList();
      }
    },
    active: function(n) {
      this.type = n ? "month" : "week";
      this.page = 1;
      this.loaded = false;
      this.$set(this, "rankList", []);
      this.getRankList();
    }
  },
  mounted: function() {
    this.getRankList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getRankList();
    });
  },
  methods: {
    getRankList: function() {
      getRankList({
        page: this.page,
        limit: this.limit,
        type: this.type
      })
        .then(res => {
          let list = res.data;
          this.rankList.push.apply(this.rankList, list);
          if (this.page == 1) {
            this.One = this.rankList.shift() || {};
            this.Two = this.rankList.shift() || {};
            this.Three = this.rankList.shift() || {};
          }
          this.page++;
          this.loading = false;
          this.loaded = list.length < this.limit;
          this.$set(this, "rankList", this.rankList);
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
