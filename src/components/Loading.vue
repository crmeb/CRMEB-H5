<template>
  <div>
    <div
      class="Loads acea-row row-center-wrapper"
      v-if="loading && !loaded"
      style="margin-top: .2rem;"
    >
      <div v-if="loading">
        <div
          class="iconfont icon-jiazai loading acea-row row-center-wrapper"
        ></div>
        正在加载中
      </div>
      <div v-else>
        上拉加载更多
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    loaded: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>
