<template>
  <div class="commission-rank" ref="container">
    <div class="header">
      <div class="rank" v-if="position">
        您目前的排名为：第<span class="num">{{ position }}</span
        >名
      </div>
      <div class="rank" v-else>
        您暂未上榜
      </div>
    </div>
    <div class="wrapper">
      <div class="nav acea-row row-around">
        <div
          class="item"
          :class="active === index ? 'font-color-red' : ''"
          v-for="(item, index) in navList"
          :key="index"
          @click="switchTap(index)"
        >
          {{ item }}
        </div>
      </div>
      <div class="list">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, index) in rankList"
          :key="index"
        >
          <div class="num" v-if="index <= 2">
            <img src="@assets/images/medal01.png" v-if="index == 0" />
            <img src="@assets/images/medal02.png" v-else-if="index == 1" />
            <img src="@assets/images/medal03.png" v-else-if="index == 2" />
          </div>
          <div class="num" v-else>{{ index + 1 }}</div>
          <div class="picTxt acea-row row-between-wrapper">
            <div class="pictrue"><img :src="item.avatar" /></div>
            <div class="text line1">{{ item.nickname }}</div>
          </div>
          <div class="people font-color-red">￥{{ item.brokerage_price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.commission-rank .header {
  background: url("../../../assets/images/commission.jpg") no-repeat;
  width: 100%;
  height: 3.44rem;
  background-size: 100% 100%;
  position: relative;
  z-index: -1;
}
.commission-rank .header .rank {
  font-size: 0.33rem;
  color: #fff;
  position: absolute;
  top: 1.6rem;
  left: 0.48rem;
}
.commission-rank .header .rank .num {
  font-size: 0.51rem;
  font-weight: bold;
  margin: 0 0.1rem;
}
.commission-rank .wrapper {
  width: 7.1rem;
  background-color: #fff;
  border-radius: 0.2rem;
  margin: -0.76rem auto 0 auto;
}
.commission-rank .wrapper .nav {
  height: 0.99rem;
  border-bottom: 0.025rem solid #f3f3f3;
  font-size: 0.3rem;
  font-weight: bold;
  color: #999;
  line-height: 0.99rem;
}
.commission-rank .wrapper .nav .item.font-color-red {
  border-bottom: 0.04rem solid #e93323;
}
.commission-rank .wrapper .list {
  padding: 0 0.3rem;
}
.commission-rank .wrapper .list .item {
  border-bottom: 1px solid #f3f3f3;
  height: 1.01rem;
  font-size: 0.28rem;
}
.commission-rank .wrapper .list .item .num {
  color: #666;
  width: 0.7rem;
}
.commission-rank .wrapper .list .item .num img {
  width: 0.34rem;
  height: 0.4rem;
  display: block;
}
.commission-rank .wrapper .list .item .picTxt {
  width: 3.5rem;
}
.commission-rank .wrapper .list .item .picTxt .pictrue {
  width: 0.68rem;
  height: 0.68rem;
}
.commission-rank .wrapper .list .item .picTxt .pictrue img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
}
.commission-rank .wrapper .list .item .picTxt .text {
  width: 2.62rem;
  color: #333;
}
.commission-rank .wrapper .list .item .people {
  width: 1.75rem;
  text-align: right;
}
</style>
<script>
import { getBrokerageRank } from "@api/user";
import { mapGetters } from "vuex";

const NAME = "CommissionRank";
export default {
  name: NAME,
  props: {},
  data: function() {
    return {
      navList: ["周排行", "月排行"],
      active: 0,
      rankList: [],
      page: 1,
      limit: 10,
      type: "week",
      position: 0,
      loading: false,
      loadend: false
    };
  },
  computed: mapGetters(["userInfo"]),
  watch: {
    $route(n) {
      if (n.name === NAME) {
        this.loaded = false;
        this.page = 1;
        this.$set(this, "rankList", []);
        this.getBrokerageRankList();
      }
    },
    active() {
      this.loaded = false;
      this.page = 1;
      this.$set(this, "rankList", []);
      this.getBrokerageRankList();
    }
  },
  mounted: function() {
    this.getBrokerageRankList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getBrokerageRankList();
    });
  },
  methods: {
    switchTap: function(index) {
      this.active = index;
    },
    getBrokerageRankList: function() {
      if (this.loading) return;
      if (this.loaded) return;
      this.loading = true;
      getBrokerageRank({
        page: this.page,
        limit: this.limit,
        type: this.active === 0 ? "week" : "month"
      })
        .then(res => {
          let list = res.data.rank;
          let loadend = list.length < this.limit;
          this.rankList.push.apply(this.rankList, list);
          this.loading = false;
          this.loaded = loadend;
          this.page++;
          this.position = res.data.position;
          this.$set(this, "rankList", this.rankList);
          this.getUserRank();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getUserRank() {
      this.rankList.forEach((item, index) => {
        if (this.userInfo.uid == item.uid) this.position = index + 1;
      });
    }
  }
};
</script>
