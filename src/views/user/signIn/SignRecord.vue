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
      limit: 5,
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
      if (that.loading || that.loaded) return;
      that.loading = true;
      getSignMonth(that.page, that.limit).then(
        res => {
          that.loading = false;
          that.loaded = res.data.length < that.limit;
          that.page = that.page + 1;
          that.signList.push.apply(that.signList, res.data);
        },
        error => {
          that.$dialog.message(error.msg);
        }
      );
    }
  }
};
</script>
