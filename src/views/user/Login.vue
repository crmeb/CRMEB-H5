<template>
  <div class="register absolute">
    <div class="shading">
      <div class="pictrue acea-row row-center-wrapper">
        <img :src="logoUrl" v-if="logoUrl" />
        <img src="@assets/images/logo2.png" v-else />
      </div>
    </div>
    <div class="whiteBg" v-if="formItem === 1">
      <div class="title acea-row row-center-wrapper">
        <div
          class="item"
          :class="current === index ? 'on' : ''"
          v-for="(item, index) in navList"
          @click="navTap(index)"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="list" :hidden="current !== 0">
        <form @submit.prevent="submit">
          <div class="item">
            <div class="acea-row row-between-wrapper">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-phone_"></use>
              </svg>
              <input
                type="text"
                placeholder="输入手机号码"
                v-model="account"
                required
              />
            </div>
          </div>
          <div class="item">
            <div class="acea-row row-between-wrapper">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-code_"></use>
              </svg>
              <input
                type="password"
                placeholder="填写登录密码"
                v-model="password"
                required
              />
            </div>
          </div>
        </form>
        <div
          class="forgetPwd"
          @click="$router.push({ name: 'RetrievePassword' })"
        >
          <span class="iconfont icon-wenti"></span>忘记密码
        </div>
      </div>
      <div class="list" :hidden="current !== 1">
        <div class="item">
          <div class="acea-row row-between-wrapper">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-phone_"></use>
            </svg>
            <input type="text" placeholder="输入手机号码" v-model="account" />
          </div>
        </div>
        <div class="item">
          <div class="align-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-code_1"></use>
            </svg>
            <input
              type="text"
              placeholder="填写验证码"
              class="codeIput"
              v-model="captcha"
            />
            <button
              class="code"
              :disabled="disabled"
              :class="disabled === true ? 'on' : ''"
              @click="code"
            >
              {{ text }}
            </button>
          </div>
        </div>
      </div>
      <div class="logon" @click="loginMobile" :hidden="current !== 1">登录</div>
      <div class="logon" @click="submit" :hidden="current === 1">登录</div>
      <div class="tip">
        没有账号?
        <span @click="formItem = 2" class="font-color-red">立即注册</span>
      </div>
    </div>
    <div class="whiteBg" v-else>
      <div class="title">注册账号</div>
      <div class="list">
        <div class="item">
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-phone_"></use>
            </svg>
            <input type="text" placeholder="输入手机号码" v-model="account" />
          </div>
        </div>
        <div class="item">
          <div class="align-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-code_1"></use>
            </svg>
            <input
              type="text"
              placeholder="填写验证码"
              class="codeIput"
              v-model="captcha"
            />
            <button
              class="code"
              :disabled="disabled"
              :class="disabled === true ? 'on' : ''"
              @click="code"
            >
              {{ text }}
            </button>
          </div>
        </div>
        <div class="item">
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-code_"></use>
            </svg>
            <input
              type="password"
              placeholder="填写您的登录密码"
              v-model="password"
            />
          </div>
        </div>
      </div>
      <div class="logon" @click="register">注册</div>
      <div class="tip">
        已有账号?
        <span @click="formItem = 1" class="font-color-red">立即登录</span>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
import sendVerifyCode from "@mixins/SendVerifyCode";
import { login, loginMobile, registerVerify, register } from "@api/user";
import attrs, { required, alpha_num, chs_phone } from "@utils/validate";
import { validatorDefaultCatch } from "@utils/dialog";
import { getLogo } from "@api/public";
import dayjs from "dayjs";
import cookie from "@utils/store/cookie";

const BACK_URL = "login_back_url";

export default {
  name: "Login",
  mixins: [sendVerifyCode],
  data: function() {
    return {
      navList: ["账号登录", "快速登录"],
      current: 1,
      account: "",
      password: "",
      captcha: "",
      formItem: 1,
      type: "login",
      logoUrl: ""
    };
  },
  mounted: function() {
    this.getLogoImage();
  },
  methods: {
    async getLogoImage() {
      let that = this;
      getLogo(2).then(res => {
        that.logoUrl = res.data.logo_url;
      });
    },
    async loginMobile() {
      var that = this;
      const { account, captcha } = that;
      try {
        await that
          .$validator({
            account: [
              required(required.message("手机号码")),
              chs_phone(chs_phone.message())
            ],
            captcha: [
              required(required.message("验证码")),
              alpha_num(alpha_num.message("验证码"))
            ]
          })
          .validate({ account, captcha });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      loginMobile({
        phone: that.account,
        captcha: that.captcha,
        spread: cookie.get("spread")
      })
        .then(res => {
          let data = res.data;
          let newTime = Math.round(new Date() / 1000);
          that.$store.commit(
            "LOGIN",
            data.token,
            dayjs(data.expires_time) - newTime
          );
          const backUrl = cookie.get(BACK_URL) || "/";
          cookie.remove(BACK_URL);
          that.$router.replace({ path: backUrl });
        })
        .catch(res => {
          that.$dialog.error(res.msg);
        });
    },
    async register() {
      var that = this;
      const { account, captcha, password } = that;
      try {
        await that
          .$validator({
            account: [
              required(required.message("手机号码")),
              chs_phone(chs_phone.message())
            ],
            captcha: [
              required(required.message("验证码")),
              alpha_num(alpha_num.message("验证码"))
            ],
            password: [
              required(required.message("密码")),
              attrs.range([6, 16], attrs.range.message("密码")),
              alpha_num(alpha_num.message("密码"))
            ]
          })
          .validate({ account, captcha, password });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      register({
        account: that.account,
        captcha: that.captcha,
        password: that.password,
        spread: cookie.get("spread")
      })
        .then(res => {
          that.$dialog.success(res.msg);
          that.formItem = 1;
        })
        .catch(res => {
          that.$dialog.error(res.msg);
        });
    },
    async code() {
      var that = this;
      const { account } = that;
      try {
        await that
          .$validator({
            account: [
              required(required.message("手机号码")),
              chs_phone(chs_phone.message())
            ]
          })
          .validate({ account });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      if (that.formItem == 2) that.type = "register";
      await registerVerify({ phone: that.account, type: that.type })
        .then(res => {
          that.$dialog.success(res.msg);
          that.sendCode();
        })
        .catch(res => {
          that.$dialog.error(res.msg);
        });
    },
    navTap: function(index) {
      this.current = index;
    },
    async submit() {
      const { account, password } = this;
      try {
        await this.$validator({
          account: [
            required(required.message("账号")),
            attrs.range([5, 16], attrs.range.message("账号")),
            alpha_num(alpha_num.message("账号"))
          ],
          password: [
            required(required.message("密码")),
            attrs.range([6, 16], attrs.range.message("密码")),
            alpha_num(alpha_num.message("密码"))
          ]
        }).validate({ account, password });
      } catch (e) {
        return validatorDefaultCatch(e);
      }

      login({ account, password })
        .then(({ data }) => {
          this.$store.commit("LOGIN", data.token, dayjs(data.expires_time));
          const backUrl = cookie.get(BACK_URL) || "/";
          cookie.remove(BACK_URL);
          this.$router.replace({ path: backUrl });
        })
        .catch(e => {
          this.$dialog.error(e.msg);
        });
    }
  }
};
</script>
