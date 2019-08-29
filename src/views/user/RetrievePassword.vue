<template>
  <div class="register absolute">
    <div class="shading">
      <div class="pictrue acea-row row-center-wrapper">
        <img src="@assets/images/logo2.png" />
      </div>
    </div>
    <div class="whiteBg">
      <div class="title">找回密码</div>
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
      <div class="logon" @click="registerReset">确认</div>
      <div class="tip">
        <span @click="$router.push({ name: 'Login' })" class="font-color-red"
          >立即登录</span
        >
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
import sendVerifyCode from "@mixins/SendVerifyCode";
import { registerVerify, registerReset } from "@api/user";
import { validatorDefaultCatch } from "@utils/dialog";
import attrs, { required, alpha_num, chs_phone } from "@utils/validate";

export default {
  name: "RetrievePassword",
  data: function() {
    return {
      account: "",
      password: "",
      captcha: ""
    };
  },
  mixins: [sendVerifyCode],
  methods: {
    async registerReset() {
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
      registerReset({
        account: that.account,
        captcha: that.captcha,
        password: that.password
      })
        .then(res => {
          that.$dialog.success(res.msg).then(() => {
            that.$router.push({ name: "Login" });
          });
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
      registerVerify({ phone: that.account })
        .then(res => {
          that.$dialog.success(res.msg);
          that.sendCode();
        })
        .catch(res => {
          that.$dialog.error(res.msg);
        });
    }
  }
};
</script>
