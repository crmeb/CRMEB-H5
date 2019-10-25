<template>
  <div class="personal-data">
    <div class="wrapper">
      <div class="title">管理我的账号</div>
      <div class="wrapList">
        <div
          class="item acea-row row-between-wrapper"
          :class="item.uid === userInfo.uid ? 'on' : ''"
          v-for="(item, index) in switchUserInfo"
          :key="index"
        >
          <div class="picTxt acea-row row-between-wrapper">
            <div class="pictrue">
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
                v-if="item.uid === userInfo.uid"
              >
                <div class="pictrue">
                  <img :src="item.avatar" />
                </div>
              </VueCoreImageUpload>
              <div class="pictrue" v-else>
                <img :src="item.avatar" />
              </div>
              <img
                src="@assets/images/alter.png"
                class="alter"
                v-if="item.uid === userInfo.uid"
              />
            </div>
            <div class="text">
              <div class="name line1">{{ item.nickname }}</div>
              <div class="phone">绑定手机号：{{ item.phone }}</div>
            </div>
          </div>
          <div
            class="currentBnt acea-row row-center-wrapper font-color-red"
            v-if="item.uid === userInfo.uid"
          >
            当前账号
          </div>
          <div
            class="bnt font-color-red acea-row row-center-wrapper"
            v-else
            @click="switchAccounts(index)"
          >
            使用账号
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="item acea-row row-between-wrapper">
        <div>昵称</div>
        <div class="input">
          <input type="text" v-model="userInfo.nickname" />
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>ID号</div>
        <div class="input acea-row row-between-wrapper">
          <input type="text" :value="userInfo.uid" disabled class="id" /><span
            class="iconfont icon-suozi"
          ></span>
        </div>
      </div>
      <div v-if="!userInfo.phone">
        <router-link
          :to="'/user/binding'"
          class="item acea-row row-between-wrapper"
        >
          <div>绑定手机号</div>
          <div class="input">
            点击绑定手机号<span class="iconfont icon-xiangyou"></span>
          </div>
        </router-link>
      </div>
      <div class="item acea-row row-between-wrapper" v-else-if="userInfo.phone">
        <div>手机号码</div>
        <div class="input acea-row row-between-wrapper">
          <div class="input acea-row row-between-wrapper">
            <input
              type="text"
              :value="userInfo.phone"
              disabled
              class="id"
            /><span class="iconfont icon-suozi"></span>
          </div>
        </div>
      </div>
      <div v-if="userInfo.phone && userInfo.user_type === 'h5'">
        <router-link
          :to="'/change_password'"
          class="item acea-row row-between-wrapper"
        >
          <div>密码</div>
          <div class="input">
            点击修改密码<span class="iconfont icon-xiangyou"></span>
          </div>
        </router-link>
      </div>
    </div>
    <div class="modifyBnt bg-color-red" @click="submit">保存修改</div>
    <div
      class="logOut cart-color acea-row row-center-wrapper"
      @click="logout"
      v-if="!isWeixin"
    >
      退出登录
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { trim, VUE_APP_API_URL, isWeixin } from "@utils";
import VueCoreImageUpload from "vue-core-image-upload";
import { postUserEdit, getLogout, switchH5Login, getUser } from "@api/user";
import { clearAuthStatus } from "@libs/wechat";
import cookie from "@utils/store/cookie";
import store from "@/store";
import dayjs from "dayjs";

export default {
  name: "PersonalData",
  components: {
    VueCoreImageUpload
  },
  data: function() {
    return {
      url: `${VUE_APP_API_URL}/upload/image`,
      headers: {
        "Authori-zation": "Bearer " + this.$store.state.app.token
      },
      avatar: "",
      isWeixin: false,
      currentAccounts: 0,
      switchUserInfo: [],
      userIndex: 0
    };
  },
  watch: {
    $route(n) {
      if (n.name === "PersonalData") this.$store.dispatch("USERINFO", true);
    }
  },
  computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.avatar = this.userInfo.avatar;
    this.isWeixin = isWeixin();
    this.getUserInfo();
  },
  methods: {
    switchAccounts: function(index) {
      let that = this;
      this.userIndex = index;
      let userInfo = this.switchUserInfo[this.userIndex];
      if (this.switchUserInfo.length <= 1) return true;
      if (userInfo === undefined)
        return this.$dialog.toast({ mes: "切换的账号不存在" });
      if (userInfo.user_type === "h5") {
        switchH5Login()
          .then(({ data }) => {
            that.$dialog.loading.close();
            const expires_time = dayjs(data.expires_time);
            store.commit("LOGIN", data.token, expires_time);
            that.$emit("changeswitch", false);
            location.reload();
          })
          .catch(err => {
            that.$dialog.loading.close();
            return that.$dialog.toast({ mes: err });
          });
      } else {
        cookie.set("loginType", "wechat", 60);
        this.$dialog.loading.close();
        this.$store.commit("LOGOUT");
        clearAuthStatus();
        this.$emit("changeswitch", false);
        location.reload();
      }
    },
    getUserInfo: function() {
      let that = this;
      getUser().then(res => {
        let switchUserInfo = res.data.switchUserInfo;
        for (let i = 0; i < switchUserInfo.length; i++) {
          if (switchUserInfo[i].uid == that.userInfo.uid) that.userIndex = i;
          if (
            !that.isWeixin &&
            switchUserInfo[i].user_type != "h5" &&
            switchUserInfo[i].phone === ""
          )
            switchUserInfo.splice(i, 1);
        }
        that.$set(this, "switchUserInfo", switchUserInfo);
      });
    },
    imageuploaded(res) {
      if (res.status !== 200)
        return this.$dialog.error(res.msg || "上传图片失败");
      if (this.switchUserInfo[this.userIndex] === undefined) return;
      this.$set(this.switchUserInfo[this.userIndex], "avatar", res.data.url);
    },

    submit: function() {
      let userInfo = this.switchUserInfo[this.userIndex];
      postUserEdit({
        nickname: trim(this.userInfo.nickname),
        avatar: userInfo.avatar
      }).then(
        res => {
          this.$store.dispatch("USERINFO", true);
          this.$dialog.success(res.msg);
          this.$router.go(-1);
        },
        error => {
          this.$dialog.error(error.msg);
        }
      );
    },
    logout: function() {
      this.$dialog.confirm({
        mes: "确认退出登录?",
        opts: () => {
          getLogout()
            .then(res => {
              this.$store.commit("LOGOUT");
              clearAuthStatus();
              location.href = location.origin;
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>
