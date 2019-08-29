<template>
  <div class="ChangePassword">
    <div class="phone">
      当前手机号:<input type="text" v-model="phone" disabled />
    </div>
    <div class="list">
      <div class="item">
        <input type="password" placeholder="设置新密码" v-model="password" />
      </div>
      <div class="item">
        <input type="password" placeholder="确认新密码" v-model="password2" />
      </div>
      <div class="item acea-row row-between-wrapper">
        <input
          type="text"
          placeholder="填写验证码"
          class="codeIput"
          v-model="captcha"
        />
        <button
          class="code font-color-red"
          :disabled="disabled"
          :class="disabled === true ? 'on' : ''"
          @click="code"
        >
          {{ text }}
        </button>
      </div>
    </div>
    <div class="confirmBnt bg-color-red" @click="confirm">确认修改</div>
  </div>
</template>
<style scoped>
.ChangePassword .phone input {
  width: 2rem;
  text-align: center;
}
</style>
<script>
// import { mapGetters } from "vuex";
import sendVerifyCode from "@mixins/SendVerifyCode";
import attrs, { required, alpha_num, chs_phone } from "@utils/validate";
import { validatorDefaultCatch } from "@utils/dialog";
import { registerReset, registerVerify, getUserInfo } from "@api/user";

export default {
  name: "ChangePassword",
  components: {},
  props: {},
  data: function() {
    return {
      password: "",
      password2: "",
      captcha: "",
      phone: "", //隐藏几位数的手机号；
      yphone: "" //手机号；
    };
  },
  mixins: [sendVerifyCode],
  // computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo: function() {
      let that = this;
      getUserInfo().then(res => {
        that.yphone = res.data.phone;
        let reg = /^(\d{3})\d*(\d{4})$/;
        that.phone = that.yphone.replace(reg, "$1****$2");
      });
    },
    async confirm() {
      let that = this;
      const { password, password2, captcha } = that;
      try {
        await that
          .$validator({
            password: [
              required(required.message("密码")),
              attrs.range([6, 16], attrs.range.message("密码")),
              alpha_num(alpha_num.message("密码"))
            ],
            captcha: [
              required(required.message("验证码")),
              alpha_num(alpha_num.message("验证码"))
            ]
          })
          .validate({ password, captcha });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      if (password !== password2) return that.$dialog.error("两次密码不一致");
      registerReset({
        account: that.yphone,
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
      let that = this;
      const { yphone } = that;
      try {
        await that
          .$validator({
            yphone: [
              required(required.message("手机号码")),
              chs_phone(chs_phone.message())
            ]
          })
          .validate({ yphone });
      } catch (e) {
        return validatorDefaultCatch(e);
      }

      registerVerify({ phone: yphone })
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
