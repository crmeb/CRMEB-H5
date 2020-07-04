<template>
  <div class="ChangePassword">
    <div class="list">
      <div class="item">
        <input type="number" placeholder="填写手机号码" v-model="phone" />
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
      <div class="item acea-row row-between-wrapper" v-if="isShowCode">
        <input
          type="text"
          placeholder="填写验证码"
          class="codeIput"
          v-model="codeVal"
        />
        <div class="codeVal" @click="again"><img :src="codeUrl" /></div>
      </div>
    </div>
    <div class="confirmBnt bg-color-red" @click="confirm">确认绑定</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import sendVerifyCode from "@mixins/SendVerifyCode";
import attrs, { required, alpha_num, chs_phone } from "@utils/validate";
import { validatorDefaultCatch } from "@utils/dialog";
import { registerVerify, bindingPhone, getCodeApi } from "@api/user";
import { VUE_APP_API_URL } from "@utils";

export default {
  name: "BindingPhone",
  components: {},
  props: {},
  data: function() {
    return {
      captcha: "",
      phone: "", //手机号
      keyCode: "",
      codeUrl: "",
      codeVal: "",
      isShowCode: false
    };
  },
  mixins: [sendVerifyCode],
  computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.getCode();
  },
  methods: {
    again() {
      this.codeUrl =
        VUE_APP_API_URL + "/captcha?" + this.keyCode + Date.parse(new Date());
    },
    getCode() {
      getCodeApi()
        .then(res => {
          this.keyCode = res.data.key;
        })
        .catch(res => {
          this.$dialog.error(res.msg);
        });
    },
    async confirm() {
      let that = this;
      const { phone, captcha, codeVal } = that;
      try {
        await that
          .$validator({
            phone: [
              chs_phone(chs_phone.message("手机号码")),
              alpha_num(alpha_num.message())
            ],
            captcha: [
              required(required.message("验证码")),
              alpha_num(alpha_num.message("验证码"))
            ],
            codeVal: this.isShowCode
              ? [
                  required(required.message("验证码")),
                  attrs.length(4, attrs.length.message("验证码")),
                  alpha_num(alpha_num.message("验证码"))
                ]
              : []
          })
          .validate({ phone, captcha, codeVal });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      bindingPhone({
        phone: this.phone,
        captcha: this.captcha,
        code: this.codeVal
      })
        .then(res => {
          if (res.data !== undefined && res.data.is_bind) {
            that.$dialog.confirm({
              mes: res.msg,
              opts: [
                {
                  txt: "确认绑定",
                  color: false,
                  callback: () => {
                    bindingPhone({
                      phone: this.phone,
                      captcha: this.captcha,
                      step: 1
                    })
                      .then(res => {
                        that.$dialog.success(res.msg).then(() => {
                          that.$router.replace({ name: "PersonalData" });
                        });
                      })
                      .catch(res => {
                        that.$dialog.error(res.msg).then(() => {
                          that.$router.replace({ name: "PersonalData" });
                        });
                      });
                  }
                },
                {
                  txt: "取消",
                  color: false,
                  callback: () => {
                    that.$dialog.error("已取消绑定").then(() => {
                      that.$router.replace({ name: "PersonalData" });
                    });
                  }
                }
              ]
            });
          } else {
            that.$dialog.success(res.msg).then(() => {
              that.$router.replace({ name: "PersonalData" });
            });
          }
        })
        .catch(res => {
          that.$dialog.error(res.msg);
        });
    },
    async code() {
      let that = this;
      const { phone } = that;
      try {
        await that
          .$validator({
            phone: [
              required(required.message("手机号码")),
              chs_phone(chs_phone.message())
            ]
          })
          .validate({ phone });
      } catch (e) {
        return validatorDefaultCatch(e);
      }

      registerVerify({ phone: phone, key: that.keyCode, code: that.codeVal })
        .then(res => {
          that.$dialog.success(res.msg);
          that.sendCode();
        })
        .catch(res => {
          if (res.data.status === 402) {
            that.codeUrl = `${VUE_APP_API_URL}/sms_captcha?key=${that.keyCode}`;
            that.isShowCode = true;
          }
          that.$dialog.error(res.msg);
        });
    }
  }
};
</script>
<style scoped>
.codeVal {
  width: 1.5rem;
  height: 0.5rem;
}
.codeVal img {
  width: 100%;
  height: 100%;
}
</style>
