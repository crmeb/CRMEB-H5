<template>
  <div>
    <div class="switchWindow" :class="switchActive === true ? 'on' : ''">
      <!-- @assets/images/public.png -->
      <div class="pictrue">
        <img v-if="login_type === 'h5'" src="@assets/images/h5.png" />
        <img src="@assets/images/h5.png" alt="" v-else />
      </div>
      <!-- 是否选择切换到小程序账户？ -->
      <div class="info">
        是否选择切换到<span class="font-color" v-if="login_type === 'h5'"
          >微信账号</span
        >
        <span class="font-color" v-else>手机用户</span>？
      </div>
      <div class="switchBnt" @click="switchH5">切换</div>
      <div class="switchBnt cancelBnt" @click="switchClose">取消</div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      v-show="switchActive === true"
      @click="switchClose"
    ></div>
  </div>
</template>
<style>
.switchWindow {
  width: 5.6rem;
  border-radius: 0.2rem;
  -webkit-border-radius: 0.2rem;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -2.8rem;
  margin-top: -3rem;
  z-index: 99;
  padding: 0.5rem 0.3rem 0.4rem 0.3rem;
  text-align: center;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  transition: all 0.3s ease-in-out 0s;
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  -o-transition: all 0.3s ease-in-out 0s;
  opacity: 0;
  transform: scale(0);
}
.switchWindow.on {
  opacity: 1;
  transform: scale(1);
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -moz-transform: scale(1);
  -o-transform: scale(1);
}
.switchWindow .pictrue {
  width: 2.36rem;
  height: 2.36rem;
  margin: 0 auto;
}
.switchWindow .pictrue img {
  width: 100%;
  height: 100%;
  display: block;
}
.switchWindow .info {
  font-size: 0.32rem;
  color: #282828;
  margin-top: 0.44rem;
  font-weight: bold;
}
.switchWindow .switchBnt {
  font-size: 0.32rem;
  color: #fff;
  width: 3.6rem;
  height: 0.82rem;
  border-radius: 0.41rem;
  -webkit-border-radius: 0.41rem;
  margin: 0.57rem auto 0 auto;
  line-height: 0.82rem;
  background-image: linear-gradient(to right, #f67a38 0%, #f11b09 100%);
  background-image: -webkit-linear-gradient(to right, #f67a38 0%, #f11b09 100%);
  background-image: -moz-linear-gradient(to right, #f67a38 0%, #f11b09 100%);
}
.switchWindow .switchBnt.cancelBnt {
  background-color: #fff;
  color: #999;
  background-image: none;
  margin-top: 0.1rem;
}
</style>
<script>
import { clearAuthStatus } from "@libs/wechat";
import { switchH5Login } from "@api/user";
import cookie from "@utils/store/cookie";
import store from "@/store";
import dayjs from "dayjs";

export default {
  name: "SwitchWindow",
  props: {
    switchActive: {
      type: Boolean,
      default: false
    },
    login_type: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    switchClose: function() {
      this.$emit("changeswitch", false); //$emit():注册事件；
    },
    switchH5() {
      let that = this;
      this.$dialog.loading.open("正在切换中");
      if (that.login_type === "h5") {
        cookie.set("loginType", "wechat", 60);
        this.$dialog.loading.close();
        this.$store.commit("LOGOUT");
        clearAuthStatus();
        this.$emit("changeswitch", false);
        location.reload();
      } else {
        switchH5Login()
          .then(({ data }) => {
            this.$dialog.loading.close();
            const expires_time = dayjs(data.expires_time);
            store.commit("LOGIN", data.token, expires_time);
            this.$emit("changeswitch", false);
            location.reload();
          })
          .catch(err => {
            this.$dialog.loading.close();
            return that.$dialog.toast({ mes: err });
          });
      }
    }
  }
};
</script>
