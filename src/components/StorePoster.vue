<template>
  <div v-if="posterImageStatus" class="poster-first">
    <div class="poster-pop" v-show="!canvasStatus && posterImage">
      <img
        src="@assets/images/poster-close.png"
        class="close"
        @click="posterImageClose"
      />
      <img
        :src="posterImage"
        ref="conf0"
        alt="tp"
        class="poster-image"
        id="scream"
      />
      <div class="keep">长按图片可以保存到手机</div>
    </div>
    <div class="mask" @touchmove.prevent @click="posterImageClose">
      <div class="canvasBox">
        <canvas ref="myCanvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "StorePoster",
  props: {
    posterImageStatus: Boolean,
    posterData: Object
  },
  data: function() {
    return {
      canvasStatus: false,
      posterImage: ""
    };
  },
  watch: {
    posterImageStatus: function() {
      let that = this;
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
      var c = this.$refs.myCanvas;
      var ctx = c.getContext("2d");

      // let H = document.body.clientHeight;
      // let W = window.innerWidth;
      let H = window.screen.availHeight;
      let W = window.screen.availWidth;
      const pixelRatio = window.devicePixelRatio || 1;
      const backingStoreRatio =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      const ratio = pixelRatio / backingStoreRatio;
      c.width = W * ratio;
      c.height = H * ratio;
      c.style.width = W + "px";
      c.style.height = H + "px";
      ctx.scale(ratio, ratio);

      var imageData = ctx.getImageData(0, 0, c.width, c.height);
      for (var i = 0; i < imageData.data.length; i += 4) {
        // 当该像素是透明的,则设置成白色
        if (imageData.data[i + 3] == 0) {
          imageData.data[i] = 255;
          imageData.data[i + 1] = 255;
          imageData.data[i + 2] = 255;
          imageData.data[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      var img = new Image();
      let imgY = W - 50;
      img.onload = function() {
        ctx.drawImage(img, 0, 0, W, imgY);
      };
      img.src = this.posterData.image;
      ctx.font = "22px PingFang-SC-Medium";
      ctx.fillStyle = "#282828";
      var str = this.posterData.title;
      var initHeight = imgY + 30;
      let fontWidth = ctx.measureText(str).width;
      this.canvasTextAutoLine(str, c, 20, initHeight, 35, W - 20, 2);
      ctx.font = "32px PingFang-SC-Heavy";
      ctx.fillStyle = "#DF2D0A";
      let textY = 0;
      if (fontWidth < W - 20) {
        textY = initHeight + 55;
      } else {
        textY = initHeight + 85;
      }
      ctx.textAlign = "center";
      ctx.fillText("￥" + this.posterData.price, W / 2, textY);

      var screamsCode = new Image();
      let codeY = textY + 20;
      screamsCode.onload = function() {
        ctx.drawImage(screamsCode, 10, codeY, 115, 115);
      };
      screamsCode.src = this.posterData.code;
      ctx.font = "18px Arial";
      ctx.fillStyle = "#282828";
      ctx.textAlign = "left";
      let fontY = codeY + 115 / 2;
      ctx.fillText("长按识别二维码 立即购买", 135, fontY + 10);
      setTimeout(() => {
        this.posterImage = c.toDataURL();
        this.$dialog.loading.close();
      }, 500);
    },
    /**
     * str:要绘制的字符串
     * canvas:canvas对象
     * initX:绘制字符串起始x坐标
     * initY:绘制字符串起始y坐标
     * lineHeight:字行高，自己定义个值即可
     * canvasWidth:文本宽度
     * lines: 行数
     */
    canvasTextAutoLine(
      str,
      canvas,
      initX,
      initY,
      lineHeight,
      canvasWidth,
      lines
    ) {
      var ctx = canvas.getContext("2d");
      var lineWidth = 0;
      var lastSubStrIndex = 0;
      var beginLineHeight = lineHeight;
      var beginY = initY;
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth - initX) {
          //减去initX,防止边界出现的问题
          if (initY >= beginY + beginLineHeight * (lines - 1)) {
            ctx.fillText(
              str.substring(lastSubStrIndex, i - 1) + "...",
              initX,
              initY
            );
            return;
          } else {
            ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
            initY += lineHeight;
            lineWidth = 0;
            lastSubStrIndex = i;
          }
        }
        if (i == str.length - 1) {
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
        }
      }
    }
  }
};
</script>
<style scoped>
.poster-first .mask {
  z-index: 1001 !important;
}
.canvasBox {
  width: 100%;
  height: 100%;
  margin: auto;
  /*display: flex;*/
  flex-direction: column;
  justify-content: center;
  align-items: center;

  display: none;
}
.poster-first {
  overscroll-behavior: contain;
}
.poster-pop {
  width: 4.8rem;
  position: fixed;
  left: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  z-index: 9999;
  top: 50%;
  margin-left: -2.4rem;
}
.poster-pop .canvas {
  background-color: #ffffff;
  width: 100%;
}
.poster-pop .poster-image {
  width: 100%;
  display: block;
}
.poster-pop .canvas .image {
  width: 100%;
  height: 4.5rem;
  display: block;
}
.poster-pop .canvas .text {
  text-align: center;
  margin-top: 0.32rem;
}
.poster-pop .canvas .text.black {
  padding: 0 0.1rem;
  color: #000;
}
.poster-pop .canvas .text.rad {
  color: #ff0000;
}
.poster-pop .canvas .code {
  padding: 0 0.1rem 0.2rem 0.1rem;
}
.poster-pop .canvas .code .code-img {
  width: 1.7rem;
  height: 1.7rem;
}
.poster-pop .canvas .code .code-img img {
  width: 100%;
  height: 100%;
}
.poster-pop .canvas .code .code-text {
  width: 2.8rem;
  font-size: 0.24rem;
}
.poster-pop .close {
  width: 0.46rem;
  height: 0.75rem;
  position: fixed;
  right: 0;
  top: -0.75rem;
  display: block;
}
.keep {
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
img {
  border: none;
}
</style>
