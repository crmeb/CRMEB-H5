<template>
  <div style="touch-action: none;">
    <div
      class="home"
      style="position:fixed;"
      :style="{ top: top + 'px', bottom: bottom }"
      id="right-nav"
      @touchmove="touchmove($event)"
    >
      <div
        class="homeCon bg-color-red"
        :class="homeActive === true ? 'on' : ''"
        v-if="homeActive"
      >
        <router-link
          :to="'/'"
          class="iconfont icon-shouye-xianxing"
        ></router-link>
        <router-link
          :to="'/cart'"
          class="iconfont icon-caigou-xianxing"
        ></router-link>
        <router-link :to="'/user'" class="iconfont icon-yonghu1"></router-link>
      </div>
      <div @click="open" class="pictrueBox">
        <div class="pictrue">
          <img
            :src="
              homeActive === true
                ? require('../assets/images/close.gif')
                : require('../assets/images/open.gif')
            "
            class="image"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  props: {},
  data: function() {
    return {
      top: "",
      bottom: ""
    };
  },
  computed: mapGetters(["homeActive"]),
  methods: {
    touchmove(event) {
      this.bottom = "auto";
      event.preventDefault();
      let top =
        event.touches[0].pageY -
        (document.documentElement.scrollTop || document.body.scrollTop) -
        this.$el.clientHeight;
      if (top > document.body.clientHeight - 150) {
        top = document.body.clientHeight - 150;
      } else if (top < 55) top = 55;
      this.top = top;
    },
    open: function() {
      this.homeActive
        ? this.$store.commit("CLOSE_HOME")
        : this.$store.commit("OPEN_HOME");
    }
  },
  created() {
    this.bottom = "50px";
  }
};
</script>

<style scoped>
.pictrueBox {
  width: 1.3rem;
  height: 1.2rem;
}
</style>
