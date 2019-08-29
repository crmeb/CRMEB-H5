<template>
  <div class="flash-sale" ref="container">
    <div class="header" v-if="headerImg"><img :src="headerImg" /></div>
    <Tabs
      class="time-tabs"
      line-height="0"
      v-model="active"
      animated
      title-inactive-color="2"
      :sticky="sticky"
      ref="timeList"
    >
      <Tab v-for="(item, index) in timeList" :key="index">
        <div slot="title" class="timeItem" @click="setTime(index)">
          <div class="time">{{ item.time }}</div>
          <div class="state">{{ item.state }}</div>
        </div>
        <div class="countDown font-color-red acea-row row-center-wrapper">
          <div v-if="item.status === 0" class="activity">活动已结束</div>
          <CountDown
            :is-day="false"
            :tip-text="'距结束仅剩 '"
            :day-text="''"
            :hour-text="' : '"
            :minute-text="' : '"
            :second-text="''"
            :datatime="datatime"
            v-if="item.status === 1"
          ></CountDown>
          <div v-if="item.status === 2" class="activity">活动即将开始</div>
        </div>
        <div class="list">
          <div
            class="item acea-row row-between-wrapper"
            v-for="(itemSeckill, indexSeckill) in seckillList"
            :key="indexSeckill"
          >
            <div class="pictrue">
              <img :src="itemSeckill.image" />
            </div>
            <div class="text acea-row row-column-around">
              <div class="line1" v-text="itemSeckill.title"></div>
              <div class="money">
                限时价<span
                  class="num font-color-red"
                  v-text="'￥' + itemSeckill.price"
                ></span>
              </div>
              <div class="progress cart-color">
                <div
                  class="bg-red"
                  :style="{ width: loading ? itemSeckill.percent + '%' : '' }"
                ></div>
                <div
                  class="piece font-color-red"
                  v-text="'仅剩' + itemSeckill.stock + '件'"
                ></div>
              </div>
            </div>
            <div
              class="grab bg-color-red"
              v-if="item.status === 1 && itemSeckill.stock > 0"
              @click="goDetail(itemSeckill.id)"
            >
              马上抢
            </div>
            <div
              class="grab"
              v-if="item.status === 1 && itemSeckill.stock <= 0"
            >
              已售磬
            </div>
            <div class="grab bg-color-red" v-if="item.status === 2">
              即将开始
            </div>
            <div class="grab bg-color-red" v-if="item.status === 0">已结束</div>
          </div>
        </div>
        <div
          class="noCommodity"
          v-cloak
          style="background-color: #fff;"
          v-if="seckillList.length === 0 && page > 1"
        >
          <div class="noPictrue">
            <img src="@assets/images/noGood.png" class="image" />
          </div>
        </div>
        <Loading
          :loaded="status"
          :loading="loadingList"
          v-if="seckillList.length > 0"
        ></Loading>
      </Tab>
    </Tabs>
  </div>
</template>
<script>
import { getSeckillConfig, getSeckillList } from "@api/activity";
import CountDown from "@components/CountDown";
import { Tab, Tabs } from "vant";
import Loading from "@components/Loading";

export default {
  name: "GoodsSeckill",
  components: {
    CountDown,
    Tab,
    Tabs,
    Loading
  },
  props: {},
  data: function() {
    return {
      headerImg: "",
      timeList: [],
      sticky: false,
      loading: false,
      datatime: 0,
      active: 0,
      seckillList: [],
      status: false, //砍价列表是否获取完成 false 未完成 true 完成
      loadingList: false, //当前接口是否请求完成 false 完成 true 未完成
      page: 1, //页码
      limit: 5 //数量
    };
  },
  mounted: function() {
    this.mountedStart();
  },
  methods: {
    mountedStart: function() {
      var that = this;
      getSeckillConfig().then(res => {
        that.$set(that, "headerImg", res.data.lovely);
        that.$set(that, "timeList", res.data.seckillTime);
        that.$set(that, "active", res.data.seckillTimeIndex);
        that.datatime = that.timeList[that.active].stop;
        that.getSeckillList();
        that.$nextTick(function() {
          that.sticky = true;
          that.$refs.timeList.scrollIntoView();
        });
      });
      this.$scroll(this.$refs.container, () => {
        !this.loadingList && this.getSeckillList();
      });
      setTimeout(function() {
        that.loading = true;
      }, 500);
    },
    setTime: function(index) {
      var that = this;
      that.active = index;
      that.datatime = that.timeList[that.active].stop;
      that.getSeckillList();
    },
    getSeckillList: function() {
      var that = this;
      if (that.loadingList) return;
      if (that.status) return;
      var time = that.timeList[that.active].id;
      getSeckillList(time, { page: that.page, limit: that.limit }).then(res => {
        that.status = res.data.length < that.limit;
        that.seckillList.push.apply(that.seckillList, res.data);
        that.page++;
        that.loadingList = false;
      });
    },
    goDetail: function(id) {
      var that = this;
      var time = that.timeList[that.active].stop;
      this.$router.push({
        path: "/activity/seckill_detail/" + id + "/" + time
      });
    }
  }
};
</script>
<style scoped>
.timeItem {
  font-size: 0.22rem;
  color: #282828;
  width: 100%;
  text-align: center;
  padding: 0.11rem 0;
  height: 0.96rem;
  background-color: #efc58f;
}
.timeItem .time {
  font-size: 0.32rem;
  font-weight: bold;
  height: 0.37rem;
  line-height: 0.37rem;
}
.timeItem .state {
  height: 0.37rem;
  line-height: 0.37rem;
}
.activity {
  color: #333;
}
.flash-sale .list .item .grab {
  background-color: #999;
}
</style>
