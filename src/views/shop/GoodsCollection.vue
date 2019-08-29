<template>
  <div ref="container">
    <div class="collectionGoods" v-if="collectProductList.length > 0">
      <router-link
        :to="{ path: '/detail/' + item.pid }"
        class="item acea-row row-between-wrapper"
        v-for="(item, index) in collectProductList"
        :key="index"
      >
        <div class="pictrue"><img :src="item.image" /></div>
        <div class="text acea-row row-column-between">
          <div class="infor line1">{{ item.store_name }}</div>
          <div class="acea-row row-between-wrapper">
            <div class="money font-color-red">￥{{ item.price }}</div>
            <div class="delete" @click.prevent="delCollection(index)">删除</div>
          </div>
        </div>
      </router-link>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <div
      class="noCommodity"
      style="background-color:#fff;"
      v-if="collectProductList.length < 1 && page > 1"
    >
      <div class="noPictrue">
        <img src="@assets/images/noCollection.png" class="image" />
      </div>
      <Recommend></Recommend>
    </div>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import { getCollectUser, getCollectDel } from "@api/user";
import Loading from "@components/Loading";
export default {
  name: "GoodsCollection",
  components: {
    Recommend,
    Loading
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 20,
      collectProductList: [],
      loadTitle: "",
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.get_user_collect_product();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.get_user_collect_product();
    });
  },
  methods: {
    get_user_collect_product: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      getCollectUser(that.page, that.limit).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.collectProductList.push.apply(that.collectProductList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    },
    //删除收藏；
    delCollection: function(index) {
      let that = this,
        id = that.collectProductList[index].pid,
        category = that.collectProductList[index].category;
      getCollectDel(id, category).then(function() {
        that.$dialog.toast({
          mes: "删除收藏成功!",
          callback: () => {
            that.collectProductList.splice(index, 1);
            that.$set(that, "collectProductList", that.collectProductList);
          }
        });
      });
    }
  }
};
</script>
