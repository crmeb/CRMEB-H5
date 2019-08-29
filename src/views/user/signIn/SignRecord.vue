<template>
  <div class="sign-record" ref="container">
    <div class="list">
      <div class="item" v-for="(item, index) in signList" :key="index">
        <div class="data">{{ item.month }}</div>
        <div class="listn">
          <div
            class="itemn acea-row row-between-wrapper"
            v-for="(itemn, indexn) in item.list"
            :key="indexn"
          >
            <div>
              <div class="name line1">{{ itemn.title }}</div>
              <div>{{ itemn.add_time }}</div>
            </div>
            <div class="num font-color-red">+{{ itemn.number }}</div>
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
  </div>
</template>
<script>
import { getSignMonth } from "@api/user";
import Loading from "@components/Loading";
export default {
  name: "SignRecord",
  components: {
    Loading
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 3,
      signList: [],
      loading: false,
      loadend: false,
      active: false
    };
  },
  mounted: function() {
    this.signListTap();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.signListTap();
    });
  },
  methods: {
    signListTap: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      getSignMonth(that.page, that.limit).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.signList.push.apply(that.signList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
