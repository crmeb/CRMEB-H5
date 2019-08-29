<template>
  <div class="register absolute">
    <div class="shading">
      <div class="pictrue acea-row row-center-wrapper">
        <img src="@assets/images/logo2.png" />
      </div>
    </div>
    <div class="whiteBg">
      <div class="title">注册账号</div>
      <div class="list">
        <div class="item">
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-phone_"></use>
            </svg>
            <input type="text" placeholder="输入手机号码" />
          </div>
        </div>
        <div class="item">
          <div class="align-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-code_1"></use>
            </svg>
            <input type="text" placeholder="填写验证码" class="codeIput" />
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
            <input type="text" placeholder="填写您的登录密码" />
          </div>
        </div>
      </div>
      <div class="logon">注册</div>
      <div class="tip">
        已有账号?
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

export default {
  name: "Register",
  mixins: [sendVerifyCode],
  methods: {
    code: function() {
      this.sendCode();
    }
  }
};
</script>
