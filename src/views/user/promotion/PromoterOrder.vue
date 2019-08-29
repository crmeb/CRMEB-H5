<template>
  <div class="promoter-order" ref="container">
    <div class="promoterHeader bg-color-red">
      <div class="headerCon acea-row row-between-wrapper">
        <div>
          <div class="name">累计推广订单</div>
          <div>
            <span class="num">{{ count }}</span
            >单
          </div>
        </div>
        <div class="iconfont icon-2"></div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="title acea-row row-column row-center">
          <div class="data">{{ item.time }}</div>
          <div>本月累计推广订单：{{ item.count ? item.count : 0 }}单</div>
        </div>
        <div class="listn">
          <div class="itenm" v-for="(val, indexn) in item.child" :key="indexn">
            <div class="top acea-row row-between-wrapper">
              <div class="pictxt acea-row row-between-wrapper">
                <div class="pictrue">
                  <img :src="val.avatar" />
                </div>
                <div class="text line1">{{ val.nickname }}</div>
              </div>
              <div class="money">
                返佣：<span class="font-color-red"
                  >￥{{ val.number ? val.number : 0 }}</span
                >
              </div>
            </div>
            <div class="bottom">
              <div><span class="name">订单号：</span>{{ val.order_id }}</div>
              <div><span class="name">下单时间：</span>{{ val.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loaded" :loading="loading"></Loading>
  </div>
</template>
<script>
import { getSpreadOrder } from "../../../api/user";
import Loading from "@components/Loading";
export default {
  name: "PromoterOrder",
  components: {
    Loading
  },
  props: {},
  data: function() {
    return {
      list: [],
      where: {
        page: 1,
        limit: 15
      },
      loaded: false,
      loading: false,
      loadTitle: "",
      count: ""
    };
  },
  mounted: function() {
    this.getIndex();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getIndex();
    });
  },
  methods: {
    getIndex: function() {
      let there = this;
      if (there.loaded == true || there.loading == true) return;
      there.loading = true;
      getSpreadOrder(there.where).then(
        res => {
          there.loading = false;
          there.loaded = res.data.list.length < there.where.limit;
          there.loadTitle = there.loaded ? "人家是有底线的" : "上拉加载更多";
          there.where.page = there.where.page + 1;
          there.list.push.apply(there.list, res.data.list);
          there.count = res.data.count;
        },
        error => {
          there.$dialog.message(error.msg);
        },
        300
      );
    }
  }
};
</script>
