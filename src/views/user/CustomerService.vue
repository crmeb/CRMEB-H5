<template>
  <div class="broadcast-details">
    <div class="chat" ref="chat">
      <template v-for="item in history">
        <div
          class="item acea-row row-top"
          v-if="item.uid === toUid"
          :key="item.id"
        >
          <div class="pictrue"><img :src="item.avatar" /></div>
          <div class="text">
            <div class="name">{{ item.nickname }}</div>
            <div class="acea-row">
              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 4"
              >
                <img
                  src="@assets/images/signal2.gif"
                  class="signal"
                  style="margin-right: 0.27rem;"
                />12’’
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 3"
              >
                <img :src="item.msn" />
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 2"
              >
                <i class="em" :class="item.msn"></i>
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 1"
              >
                {{ item.msn }}
              </div>
            </div>
          </div>
        </div>

        <div class="item acea-row row-top row-right" v-else :key="item.id">
          <div class="text textR">
            <div class="name">{{ item.nickname }}</div>
            <div class="acea-row ">
              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 4"
              >
                <img
                  src="@assets/images/signal2.gif"
                  class="signal"
                  style="margin-right: 0.27rem;"
                />12’’
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 3"
              >
                <img :src="item.msn" />
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 2"
              >
                <i class="em" :class="item.msn"></i>
              </div>

              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 1"
              >
                {{ item.msn }}
              </div>
            </div>
          </div>
          <div class="pictrue"><img :src="item.avatar" /></div>
        </div>
      </template>
    </div>
    <div
      :style="
        active === true
          ? 'height:' + footerConH + 'rem;'
          : 'height:' + footerH + 'rem;'
      "
    ></div>
    <div
      class="footerCon"
      :class="active === true ? 'on' : ''"
      :style="'transform: translate3d(0,' + percent + '%,0);'"
      ref="footerCon"
    >
      <form>
        <div class="footer acea-row row-between row-bottom" ref="footer">
          <!--<img-->
          <!--:src="-->
          <!--voice === true-->
          <!--? require('@assets/images/keyboard.png')-->
          <!--: require('@assets/images/voice.png')-->
          <!--"-->
          <!--@click="voiceBnt"-->
          <!--/>-->
          <VueCoreImageUpload
            class="btn btn-primary"
            :crop="false"
            compress="80"
            @imageuploaded="imageuploaded"
            :headers="headers"
            :max-file-size="5242880"
            :credentials="false"
            inputAccept="image/*"
            inputOfFile="file"
            :url="url"
            ref="upImg"
          >
            <img src="@assets/images/plus.png" />
          </VueCoreImageUpload>
          <img
            :src="
              active === true
                ? require('@assets/images/keyboard.png')
                : require('@assets/images/face.png')
            "
            @click="emoticon"
          />
          <div
            class="voice acea-row row-center-wrapper"
            v-if="voice"
            @touchstart.prevent="start"
            @touchmove.prevent="move"
            @touchend.prevent="end"
          >
            {{ speak }}
          </div>
          <p
            contenteditable="true"
            class="input"
            ref="input"
            v-show="!voice"
            @keydown="keydown($event)"
            @keyup="keyup"
            @focus="focus"
          ></p>
          <div
            class="send"
            :class="sendColor === true ? 'font-color-red' : ''"
            @click="sendTest"
          >
            发送
          </div>
        </div>
      </form>
      <div class="banner slider-banner">
        <swiper
          class="swiper-wrapper"
          :options="swiperOption"
          v-if="emojiGroup.length > 0"
        >
          <swiper-slide
            class="swiper-slide acea-row"
            v-for="(emojiList, index) in emojiGroup"
            :key="index"
          >
            <i
              class="em"
              :class="emoji"
              v-for="emoji in emojiList"
              :key="emoji"
              @click="addEmoji(emoji)"
            ></i>
            <img src="@assets/images/del.png" class="emoji-outer" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <div class="recording" v-if="recording">
      <img src="@assets/images/recording.png" />
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "emoji-awesome/dist/css/google.min.css";
import emojiList from "@utils/emoji";
import Socket from "@libs/chat";
import { getChatRecord } from "@api/user";
import VueCoreImageUpload from "vue-core-image-upload";
import { VUE_APP_API_URL } from "@utils";

const chunk = function(arr, num) {
  num = num * 1 || 1;
  var ret = [];
  arr.forEach(function(item, i) {
    if (i % num === 0) {
      ret.push([]);
    }
    ret[ret.length - 1].push(item);
  });
  console.log(ret);
  return ret;
};

const NAME = "CustomerService";

export default {
  name: NAME,
  components: {
    swiper,
    swiperSlide,
    VueCoreImageUpload
  },
  props: {
    couponList: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      url: `${VUE_APP_API_URL}/upload/image`,
      headers: {
        "Authori-zation": "Bearer " + this.$store.state.app.token
      },
      emojiGroup: chunk(emojiList, 20),
      active: false,
      voice: false,
      speak: "按住 说话",
      recording: false,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        speed: 1000,
        observer: true,
        observeParents: true
      },
      percent: 0,
      footerConH: 0,
      footerH: 1.08,
      socket: null,
      toUid: parseInt(this.$route.params.id) || 0,
      page: 1,
      limit: 30,
      loading: false,
      loaded: false,
      history: [],
      sendColor: false,
      sendtxt: ""
    };
  },
  beforeDestroy() {
    this.socket && this.socket.close();
  },
  mounted: function() {
    this.height();
    this.getHistory();
    this.socket = new Socket();
    this.socket.vm(this);
    this.$on(["reply", "chat"], data => {
      this.history.push(data);
      this.$nextTick(function() {
        window.scrollTo(0, document.documentElement.scrollHeight + 999);
      });
    });
    this.$on("socket_error", () => {
      this.$dialog.error("连接失败");
    });
    this.$on("err_tip", data => {
      this.$dialog.error(data.msg);
    });
    this.$on("socket_open", () => {
      this.socket.send({
        data: { id: this.toUid },
        type: "to_chat"
      });
    });
    document.addEventListener("scroll", this.scroll, false);
  },
  destroyed() {
    document.removeEventListener("scroll", this.scroll);
  },
  methods: {
    scroll() {
      if (window.scrollY < 300 && !this.loaded && !this.loading)
        this.getHistory();
    },
    imageuploaded(res) {
      if (res.status !== 200)
        return this.$dialog.error(res.msg || "上传图片失败");
      this.sendMsg(res.data.url, 3);
    },
    getHistory() {
      if (this.loading || this.loaded) return;
      this.loading = true;
      getChatRecord(this.toUid, { page: this.page, limit: this.limit })
        .then(({ data }) => {
          this.history = data.concat(this.history);
          if (this.page === 1) {
            this.$nextTick(function() {
              window.scrollTo(0, document.documentElement.scrollHeight + 999);
              this.height();
            });
          }
          this.page++;
          this.loading = false;
          this.loaded = data.length < this.limit;
        })
        .catch(err => {
          console.log(err);
          this.$dialog.error(err.msg || "加载失败");
        });
    },
    focus: function() {
      this.active = false;
    },
    keyup: function() {
      console.log(this.$refs.input.innerHTML.length);
      if (this.$refs.input.innerHTML.length > 0) {
        this.sendColor = true;
      } else {
        this.sendColor = false;
      }
    },
    addEmoji(name) {
      this.sendMsg(name, 2);
    },
    height: function() {
      let footerConH = this.$refs.footerCon.offsetHeight;
      let footerH = this.$refs.footer.offsetHeight;
      let scale = 750 / window.screen.availWidth;
      this.footerConH = (footerConH * scale) / 100;
      this.footerH = (footerH * scale) / 100;
      this.percent = ((this.footerConH - this.footerH) / this.footerConH) * 100;
    },
    sendMsg(msn, type) {
      console.log(
        this.socket.send({
          data: { msn, type, to_uid: this.toUid },
          type: "chat"
        })
      );
    },
    sendTest() {
      if (this.$refs.input.innerHTML) {
        this.sendMsg(this.$refs.input.innerHTML, 1);
        this.$refs.input.innerHTML = "";
      }
    },
    keydown: function($event) {
      if ($event.keyCode === 13) {
        $event.preventDefault();
        if (this.$refs.input.innerHTML) {
          this.sendMsg(this.$refs.input.innerHTML, 1);
          this.$refs.input.innerHTML = "";
        }
      }
      this.height();
    },
    start() {
      var that = this;
      this.longClick = 0;
      this.timeOutEvent = setTimeout(function() {
        that.longClick = 1;
      }, 500);
      that.speak = "松开 结束";
      that.recording = true;
    },
    move() {
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0;
    },
    end() {
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent !== 0 && this.longClick === 0) {
        //点击
        //此处为点击事件----在此处添加跳转详情页
        console.log("这是点击");
      }
      this.speak = "按住 说话";
      this.recording = false;
      return false;
    },
    voiceBnt: function() {
      this.active = false;
      if (this.voice === true) {
        this.voice = false;
        this.$nextTick(function() {
          this.$refs.input.focus();
        });
      } else {
        this.voice = true;
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      this.percent = 0;
      this.footerConH = 0;
      this.footerH = 0;
      this.$nextTick(function() {
        this.height();
      });
    },
    emoticon: function() {
      this.voice = false;
      if (this.active === true) {
        this.active = false;
        this.$nextTick(function() {
          this.$refs.input.focus();
        });
      } else {
        this.active = true;
        this.$nextTick(function() {
          this.$refs.input.blur();
        });
      }
      this.$nextTick(function() {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      this.height();
    }
  }
};
</script>

<style scoped>
.broadcast-details .chat {
  padding: 0.01rem 0.23rem 0 0.3rem;
  margin-bottom: 0.3rem;
}

.broadcast-details .chat .item {
  margin-top: 0.37rem;
}

.broadcast-details .chat .item .pictrue {
  width: 0.8rem;
  height: 0.8rem;
  margin-top: 0.1rem;
}

.broadcast-details .chat .item .pictrue img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.broadcast-details .chat .item .text {
  margin-left: 0.2rem;
}

.broadcast-details .chat .item .text.textR {
  text-align: right;
  margin: 0 0.2rem 0 0;
}

.broadcast-details .chat .item .text .name {
  font-size: 0.24rem;
  color: #999;
}

.broadcast-details .chat .item .text .name .return {
  color: #509efb;
  margin-left: 0.17rem;
}

.broadcast-details .chat .item .text.textR .name .return {
  margin: 0 0.17rem 0 0;
}

.broadcast-details .chat .item .text .conter {
  background-color: #fff;
  border-radius: 0.08rem;
  padding: 0.16rem 0.2rem;
  font-size: 0.3rem;
  color: #333;
  position: relative;
  max-width: 4.96rem;
  margin-top: 0.02rem;
}

.broadcast-details .chat .item .text .spot {
  width: 0.15rem;
  height: 0.15rem;
  background-color: #c00000;
  border-radius: 50%;
  margin-left: 0.2rem;
}

.broadcast-details .chat .item .text .conter:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-bottom: 0.09rem solid transparent;
  border-right: 0.14rem solid #fff;
  border-top: 0.09rem solid transparent;
  left: -0.14rem;
  top: 0.25rem;
}

.broadcast-details .chat .item .text.textR .conter:before {
  left: unset;
  right: -0.14rem;
  transform: rotateY(180deg);
}

.broadcast-details .chat .item .text .conter img {
  width: 100%;
  display: block;
}

.broadcast-details .chat .item .text .conter .signal {
  width: 0.48rem;
  height: 0.48rem;
}

.broadcast-details .chat .item .text .conter .signal.signalR {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

.broadcast-details .footerCon {
  position: fixed;
  bottom: 0;
  left: 0;
  min-height: 1rem;
  z-index: 55;
  width: 100%;
  transition: all 0.005s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  background-color: #fff;
}

.broadcast-details .footerCon.on {
  transform: translate3d(0, 0, 0) !important;
}

.broadcast-details .footerCon .banner .swiper-slide {
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  background-color: #fff;
  padding-bottom: 0.5rem;
  border-top: 1px solid #f5f5f5;
}

.broadcast-details .footerCon .banner .swiper-slide .emoji-outer,
.swiper-slide .em {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  margin: 0.4rem 0 0 0.5rem;
}

.broadcast-details
  .footerCon
  .banner
  .swiper-container-horizontal
  > .swiper-pagination-bullets {
  bottom: 0.1rem;
}

.broadcast-details .footerCon .slider-banner .swiper-pagination-bullet-active {
  background-color: #999;
}

.broadcast-details .recording {
  width: 3rem;
  height: 3rem;
  position: fixed;
  top: 40%;
  left: 50%;
  margin-left: -1.5rem;
}

.broadcast-details .recording img {
  width: 100%;
  height: 100%;
}

.broadcast-details .footer {
  width: 100%;
  background-color: #fff;
  padding: 0.17rem 0.26rem;
}

.broadcast-details .footer img {
  width: 0.61rem;
  height: 0.6rem;
  display: block;
}

.broadcast-details .footer .input,
.broadcast-details .footer .voice {
  width: 4.4rem;
  border-radius: 0.1rem;
  background-color: #e5e5e5;
  padding: 0.17rem 0.3rem;
}

.broadcast-details .footer .input {
  max-height: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.broadcast-details .footer .send {
  width: 0.7rem;
  text-align: center;
  height: 0.65rem;
  line-height: 0.65rem;
  font-weight: bold;
}
</style>
