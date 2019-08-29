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
    </div>
    <div class="confirmBnt bg-color-red" @click="confirm">确认绑定</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import sendVerifyCode from "@mixins/SendVerifyCode";
import { required, alpha_num, chs_phone } from "@utils/validate";
import { validatorDefaultCatch } from "@utils/dialog";
import { registerVerify, bindingPhone } from "@api/user";

export default {
  name: "BindingPhone",
  components: {},
  props: {},
  data: function() {
    return {
      captcha: "",
      phone: "" //手机号
    };
  },
  mixins: [sendVerifyCode],
  computed: mapGetters(["userInfo"]),
  mounted: function() {},
  methods: {
    async confirm() {
      let that = this;
      const { phone, captcha } = that;
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
            ]
          })
          .validate({ phone, captcha });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      bindingPhone({
        phone: this.phone,
        captcha: this.captcha
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

      registerVerify({ phone: phone })
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
