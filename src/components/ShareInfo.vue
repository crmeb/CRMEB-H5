<template>
  <div v-if="shareInfoStatus" class="poster-first">
    <div class="mask-share">
      <img src="@assets/images/share-info.png" @click="shareInfoClose" />
    </div>
  </div>
</template>
<style scoped>
.poster-first {
  overscroll-behavior: contain;
}
.mask-share {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.mask-share img {
  width: 100%;
}
</style>
<script>
export default {
  name: "ShareInfo",
  props: {
    shareInfoStatus: Boolean
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    shareInfoClose: function() {
      this.$emit("setShareInfoStatus");
    }
  }
};
</script>
