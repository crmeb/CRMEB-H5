<template>
  <div class="lottie-bg">
    <div id="lottie">
      <img
        src="@assets/images/live-logo.gif"
        rel="preload"
        style="width: 100%;"
      />
    </div>
  </div>
</template>

<script>
import { auth } from "@libs/wechat";

export default {
  name: "Loading",
  mounted() {
    const { code, state } = this.$route.query;
    auth(code, state)
      .then(() => {
        // location.replace(
        //   decodeURIComponent(decodeURIComponent(this.$route.params.url))
        // );
        location.href = decodeURIComponent(
          decodeURIComponent(this.$route.params.url)
        );
      })
      .catch(() => {
        location.replace("/");
      });
  }
};
</script>

<style scoped>
.lottie-bg {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

#lottie {
  width: 35%;
  display: block;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  margin: auto;
}
</style>
