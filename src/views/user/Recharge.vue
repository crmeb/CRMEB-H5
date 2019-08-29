<template>
  <div>
    <div class="recharge">
      <div class="nav acea-row row-around row-middle">
        <div
          class="item"
          :class="active === index ? 'on' : ''"
          v-for="(item, index) in navRecharge"
          :key="index"
          @click="navRecharges(index)"
        >
          {{ item }}
        </div>
      </div>
      <div class="info-wrapper">
        <div class="money">
          <span>￥</span>
          <input type="number" placeholder="0.00" v-model="money" />
        </div>
        <div class="tips">
          提示：当前余额为<span>￥{{ now_money || 0 }}</span>
        </div>
        <div class="pay-btn bg-color-red" @click="recharge">立即充值</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { pay } from "@libs/wechat";
import { isWeixin } from "@utils";
import { rechargeWechat } from "@api/user";
import { add } from "@utils/bc";

export default {
  name: "Recharge",
  components: {},
  props: {},
  data: function() {
    return {
      navRecharge: ["账户充值", "佣金导入"],
      active: 0,
      payType: ["weixin"],
      from: isWeixin() ? "weixin" : "weixinh5",
      money: "",
      now_money: ""
    };
  },
  computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.now_money = this.userInfo.now_money;
  },
  methods: {
    navRecharges: function(index) {
      this.active = index;
    },
    recharge: function() {
      let that = this,
        price = Number(this.money);
      if (price === 0) {
        return that.$dialog.toast({ mes: "请输入您要充值的金额" });
      } else if (price < 0.01) {
        return that.$dialog.toast({ mes: "充值金额不能低于0.01" });
      }
      rechargeWechat({ price: price, from: that.from })
        .then(res => {
          var data = res.data;
          if (data.type == "weixinh5") {
            location.replace(data.data.mweb_url);
            this.$dialog.confirm({
              mes: "充值余额",
              opts: [
                {
                  txt: "已充值",
                  color: false,
                  callback: () => {
                    that.$router.replace({
                      path: "/user/account"
                    });
                  }
                },
                {
                  txt: "查看余额",
                  color: false,
                  callback: () => {
                    that.$router.replace({
                      path: "/user/account"
                    });
                  }
                }
              ]
            });
          } else {
            pay(data.data)
              .finally(() => {
                that.now_money = add(price, parseInt(that.userInfo.now_money));
                that.$dialog.toast({ mes: "支付成功" });
              })
              .catch(function() {
                that.$dialog.toast({ mes: "支付失败" });
              });
          }
        })
        .catch(res => {
          that.$dialog.toast({ mes: res.msg });
        });
    }
  }
};
</script>
<style scoped>
#iframe {
  display: none;
}
.recharge {
  width: 7.03rem;
  padding: 0.5rem 0.63rem 0.45rem;
  background-color: #fff;
  margin: 0.2rem auto 0 auto;
  border-radius: 0.1rem;
}
.recharge .nav {
  height: 0.75rem;
  line-height: 0.75rem;
  padding: 0 1rem;
}
.recharge .nav .item {
  font-size: 0.3rem;
  color: #333;
}
.recharge .nav .item.on {
  font-weight: bold;
  border-bottom: 0.04rem solid #e83323;
}
.recharge .info-wrapper {
  text-align: center;
}
.recharge .info-wrapper .money {
  margin-top: 0.6rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px dashed #ddd;
}
.recharge .info-wrapper .money span {
  font-size: 0.56rem;
  color: #333;
  font-weight: bold;
}
.recharge .info-wrapper .money input {
  display: inline-block;
  width: 3rem;
  font-size: 0.84rem;
  text-align: center;
  color: #282828;
  font-weight: bold;
  padding-right: 0.7rem;
}
.recharge .info-wrapper .money input::placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input::-webkit-input-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input:-moz-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input::-moz-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input:-ms-input-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .tips {
  font-size: 0.26rem;
  color: #888;
  margin: 0.25rem auto 0 auto;
  line-height: 1.5;
  padding: 0 0.3rem;
}
.recharge .info-wrapper .tips span {
  color: #ef4a49;
}
.recharge .info-wrapper .pay-btn {
  display: block;
  width: 5.5rem;
  height: 0.86rem;
  margin: 0.5rem auto 0 auto;
  line-height: 0.86rem;
  text-align: center;
  color: #fff;
  border-radius: 0.5rem;
  font-size: 0.3rem;
  font-weight: bold;
}
</style>
