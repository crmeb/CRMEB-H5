<template>
  <div class="broadcast-details">
    <div class="broadcast-details_order">
      <div class="broadcast-details_box" v-if="productId && productInfo.id">
        <div class="broadcast_details_img">
          <img :src="productInfo.image" />
        </div>
        <div class="broadcast_details_picBox">
          <div
            class="broadcast_details_tit"
            v-text="productInfo.store_name"
          ></div>
          <div class="acea-row row-between">
            <div class="broadcast_details_pic">
              ￥{{ productInfo.price
              }}<span class="broadcast_details_pic_num"
                >￥{{ productInfo.ot_price }}</span
              >
            </div>
            <div class="broadcast_details_btn" @click="sendProduct">
              发送客服
            </div>
          </div>
        </div>
      </div>
      <div class="broadcast_box" v-if="orderId && orderInfo.id">
        <div class="broadcast-details_num broadcast_num">
          <span>订单号：{{ orderInfo.order_id }}</span>
          <span>{{ orderInfo.add_time_y }} {{ orderInfo.add_time_h }}</span>
        </div>
        <div class="broadcast-details_box">
          <div class="broadcast_details_img">
            <img :src="cartInfo.productInfo.image" />
            <div class="broadcast_details_model">
              {{ orderInfo.cartInfo ? orderInfo.cartInfo.length : 0 }}件商品
            </div>
          </div>
          <div class="broadcast_details_picBox">
            <div class="broadcast_details_tit">
              {{ cartInfo.productInfo.store_name }}
            </div>
            <div class="acea-row row-between">
              <div class="broadcast_details_pic">
                ￥{{ cartInfo.productInfo.price
                }}<span class="broadcast_details_pic_num"
                  >￥{{ cartInfo.productInfo.ot_price }}</span
                >
              </div>
              <div class="broadcast_details_btn" @click="sendOrder">
                发送客服
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
              <!--商品链接-->
              <div v-if="item.msn_type === 6 && item.orderInfo.id">
                <router-link
                  class="broadcast-details_num"
                  :to="{
                    path: '/customer/orderdetail/' + item.orderInfo.order_id
                  }"
                >
                  <span>订单号：{{ item.orderInfo.order_id }}</span>
                </router-link>
                <div class="conter acea-row row-middle">
                  <div
                    class="broadcast-details_order noPad"
                    v-for="(val, inx) in item.orderInfo.cartInfo"
                    :key="val.id"
                  >
                    <router-link
                      class="broadcast-details_box noPad"
                      :to="{ path: '/detail/' + val.product_id }"
                      v-if="inx == 0"
                    >
                      <div class="broadcast_details_img">
                        <img :src="val.productInfo.image" />
                        <div class="broadcast_details_model">
                          {{
                            item.orderInfo.cartInfo
                              ? item.orderInfo.cartInfo.length
                              : 0
                          }}件商品
                        </div>
                      </div>
                      <div class="broadcast_details_picBox noPad">
                        <div
                          class="broadcast_details_tit"
                          v-text="val.productInfo.store_name"
                        ></div>
                        <div class="broadcast_details_pic">
                          ￥{{ val.productInfo.price }}
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>

              <!--商品链接-->
              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 5"
              >
                <div class=" noPad">
                  <router-link
                    class="acea-row row-column-around noPad"
                    v-if="item.productInfo.id"
                    :to="{ path: '/detail/' + item.productInfo.id }"
                  >
                    <div class="broadcast_details_img_no">
                      <img :src="item.productInfo.image" />
                    </div>
                    <div class="broadcast_details_picBox_no noPad">
                      <div class="broadcast_details_pic">
                        ￥{{ item.productInfo.price }}
                      </div>
                      <div
                        class="broadcast_details_tit_no"
                        v-text="item.productInfo.store_name"
                      ></div>
                    </div>
                  </router-link>
                </div>
              </div>

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
              <!--商品链接-->
              <router-link
                v-if="item.msn_type === 6 && item.orderInfo.id"
                :to="{
                  path: '/customer/orderdetail/' + item.orderInfo.order_id
                }"
              >
                <div class="broadcast-details_num">
                  <span>订单号：{{ item.orderInfo.order_id }}</span>
                </div>
                <div class="conter acea-row row-middle">
                  <div
                    class="broadcast-details_order noPad"
                    v-for="(val, inx) in item.orderInfo.cartInfo"
                    :key="val.id"
                  >
                    <div class="broadcast-details_box noPad" v-if="inx == 0">
                      <div class="broadcast_details_img">
                        <img :src="val.productInfo.image" />
                        <div class="broadcast_details_model">
                          {{
                            item.orderInfo.cartInfo
                              ? item.orderInfo.cartInfo.length
                              : 0
                          }}件商品
                        </div>
                      </div>
                      <div class="broadcast_details_picBox noPad">
                        <div
                          class="broadcast_details_tit"
                          v-text="val.productInfo.store_name"
                        ></div>
                        <div class="broadcast_details_pic">
                          ￥{{ val.productInfo.price }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>

              <!--商品链接-->
              <div
                class="conter acea-row row-middle"
                v-if="item.msn_type === 5"
              >
                <div class=" noPad">
                  <router-link
                    class="acea-row row-column-around noPad"
                    v-if="item.productInfo.id"
                    :to="{ path: '/detail/' + item.productInfo.id }"
                  >
                    <div class="broadcast_details_img_no">
                      <img :src="item.productInfo.image" />
                    </div>
                    <div class="broadcast_details_picBox_no noPad">
                      <div class="broadcast_details_pic">
                        ￥{{ item.productInfo.price }}
                      </div>
                      <div
                        class="broadcast_details_tit_no"
                        v-text="item.productInfo.store_name"
                      ></div>
                    </div>
                  </router-link>
                </div>
              </div>

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
import { getProductDetail } from "@api/store";
import { orderDetail } from "@api/order";
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
      sendtxt: "",
      productId: parseInt(this.$route.params.productId) || 0,
      productInfo: {},
      orderId: this.$route.query.orderId || "",
      orderInfo: {},
      cartInfo: {}
    };
  },
  watch: {
    $route(n) {
      if (n.name === NAME) {
        if (n.params.productId) this.productId = n.params.productId;
        else this.productId = 0;

        if (n.query.orderId) this.orderId = n.query.orderId;
        else this.orderId = "";
      }
    }
  },
  beforeDestroy() {
    this.socket && this.socket.close();
  },
  mounted: function() {
    this.height();
    this.getHistory();
    this.getproductInfo();
    this.getOrderInfo();
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
    getOrderInfo() {
      if (!this.orderId) return;
      orderDetail(this.orderId).then(res => {
        this.orderInfo = res.data;
        if (this.orderInfo.add_time_h) {
          this.orderInfo.add_time_h = this.orderInfo.add_time_h.substring(
            0,
            this.orderInfo.add_time_h.lastIndexOf(":")
          );
        }
        if (this.orderInfo.cartInfo.length) {
          this.cartInfo = this.orderInfo.cartInfo[0];
        }
      });
    },
    getproductInfo() {
      let that = this;
      if (!this.productId) return;
      getProductDetail(this.productId).then(res => {
        that.productInfo = res.data.storeInfo;
      });
    },
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
    sendProduct() {
      this.sendMsg(this.productId, 5);
      this.productId = 0;
      this.productInfo = {};
    },
    sendOrder() {
      this.sendMsg(this.orderId, 6);
      this.orderId = 0;
      this.orderInfo = {};
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
.broadcast_num {
  padding: 0 0.1rem !important;
}
.noPad {
  padding: 0 !important;
  margin-bottom: 0 !important;
  height: auto !important;
}
.broadcast-details_num {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #000000;
  font-size: 0.26rem;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
  padding: 0 0.24rem;
}
.broadcast-details_order {
  padding: 0.15rem;
}
.broadcast-details_box {
  padding: 0.24rem;
  display: flex;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 0.24rem;
}
.broadcast_details_model {
  width: 100%;
  height: 0.43rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 0px 8px 8px;
  position: absolute;
  z-index: 2;
  bottom: 0;
  font-size: 0.22rem;
  color: #fff;
  text-align: center;
  line-height: 0.43rem;
}
.broadcast_details_img {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.broadcast_details_img img {
  width: 100%;
  height: 100%;
}

.broadcast_details_img_no {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0px 0px;
  overflow: hidden;
  margin-bottom: 0.1rem;
}
.broadcast_details_picBox_no {
  width: 100%;
}
.broadcast_details_img_no img {
  width: 100%;
  height: 100%;
}
.broadcast_details_tit {
  font-size: 0.28rem;
  color: #333333;
  height: 0.85rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left !important;
}
.broadcast_details_tit_no {
  font-size: 0.28rem;
  color: #333333;
  font-weight: 800;
  text-align: left;
  margin-top: 0.05rem;
}
.broadcast_details_picBox {
  width: 75%;
  margin-left: 0.24rem;
}
.broadcast_details_pic {
  font-size: 0.36rem;
  color: #e93323;
  text-align: left;
}
.broadcast_details_pic_num {
  text-decoration: line-through;
  font-size: 0.28rem;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 0.1rem;
}
.broadcast_details_btn {
  width: 1.6rem;
  height: 0.5rem;
  background: #e83323;
  opacity: 1;
  border-radius: 12.5rem;
  color: #fff;
  font-size: 0.24rem;
  text-align: center;
  line-height: 0.5rem;
}
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
