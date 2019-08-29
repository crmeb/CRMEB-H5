<template>
  <div v-if="posterImageStatus" class="poster-first">
    <div class="poster-pop" v-show="!canvasStatus">
      <img
        src="@assets/images/poster-close.png"
        class="close"
        @click="posterImageClose"
      />
      <div class="canvas" ref="poster">
        <img class="image" :src="posterData.image" alt="商品图片" />
        <div class="text black"><span v-text="posterData.title"></span></div>
        <div class="text rad">
          <span v-text="'￥' + posterData.price"></span>
        </div>
        <div class="code">
          <div class="code-img">
            <img :src="posterData.code" alt="二维码" />
          </div>
          <div class="code-text"><span>长按识别二维码 立即购买</span></div>
        </div>
      </div>
      <!--<div class="save-poster" @click="savePosterPath">生成图片</div>-->
    </div>
    <div class="poster-pop" v-show="canvasStatus">
      <img
        src="@assets/images/poster-close.png"
        class="close"
        @click="posterImageClose"
      />
      <img :src="posterImage" alt="tp" class="poster-image" />
      <div class="keep">长按图片可以保存到手机</div>
    </div>
    <div class="mask"></div>
  </div>
</template>
<style scoped>
.poster-first {
  overscroll-behavior: contain;
}
.poster-pop {
  width: 4.5rem;
  height: 8rem;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  top: 50%;
  margin-top: -4.6rem;
}
.poster-pop .canvas {
  background-color: #ffffff;
  height: 8rem;
}
.poster-pop .poster-image {
  width: 100%;
}
.poster-pop .canvas .image {
  width: 4.5rem;
  height: 4.5rem;
  display: block;
}
.poster-pop .canvas .text {
  text-align: center;
  color: #000000;
  margin-top: 0.32rem;
}
.poster-pop .canvas .text.black {
  height: 0.68rem;
}
.poster-pop .canvas .text.rad {
  color: #ff0000;
}
.poster-pop .canvas .code {
  height: 1.4rem;
  display: inline-flex;
}
.poster-pop .canvas .code .code-img {
  width: 40%;
  padding: 0.06rem;
}
.poster-pop .canvas .code .code-img img {
  width: 100%;
}
.poster-pop .canvas .code .code-text {
  width: 70%;
  font-size: 0.12rem;
  line-height: 1.8rem;
}
.poster-pop .close {
  width: 0.46rem;
  height: 0.75rem;
  position: fixed;
  right: 0;
  top: -0.73rem;
  display: block;
}
.poster-pop .save-poster {
  background-color: #df2d0a;
  font-size: 0.22rem;
  color: #fff;
  text-align: center;
  height: 0.76rem;
  line-height: 0.76rem;
  width: 100%;
  margin-top: -0.04rem;
}
.poster-pop .keep {
  color: #fff;
  text-align: center;
  font-size: 0.25rem;
  margin-top: 0.1rem;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
}
</style>
<script>
import html2canvas from "html2canvas";
export default {
  name: "StorePoster",
  props: {
    posterImageStatus: Boolean,
    posterData: Object
  },
  data: function() {
    return {
      canvasStatus: false
    };
  },
  watch: {
    posterImageStatus: function() {
      var that = this;
      if (that.posterImageStatus === true) {
        that.$nextTick(function() {
          that.savePosterPath();
        });
      }
    }
  },
  mounted: function() {},
  methods: {
    posterImageClose: function() {
      this.posterImageStatus = false;
      this.canvasStatus = false;
      this.$emit("setPosterImageStatus");
    },
    savePosterPath: function() {
      this.$dialog.loading.open();
      this.setHtml2Canvas();
    },
    setHtml2Canvas: function() {
      var that = this;
      const canvas = document.createElement("canvas");
      let canvasBox = that.$refs.poster;
      const width = parseInt(window.getComputedStyle(canvasBox).width);
      const height = parseInt(window.getComputedStyle(canvasBox).height);
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      const options = {
        backgroundColor: null,
        canvas,
        useCORS: true
      };
      html2canvas(canvasBox, options).then(function(canvas) {
        that.posterImage = canvas.toDataURL();
        that.canvasStatus = true;
        that.$dialog.loading.close();
      });
    }
  }
};
</script>
