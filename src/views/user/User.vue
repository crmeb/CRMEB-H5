<template>
  <div class="user">
    <div class="header bg-color-red acea-row row-between-wrapper">
      <div class="picTxt acea-row row-between-wrapper">
        <div class="pictrue"><img :src="userInfo.avatar" /></div>
        <div class="text">
          <div class="acea-row row-middle">
            <div class="name line1">{{ userInfo.nickname }}</div>
            <div class="member acea-row row-middle" v-if="userInfo.vip">
              <img :src="userInfo.vip_icon" />{{ userInfo.vip_name }}
            </div>
          </div>
          <router-link :to="'/user/data'" class="id" v-if="userInfo.phone">
            ID：{{ userInfo.uid || 0
            }}<span class="iconfont icon-bianji1"></span>
          </router-link>
          <router-link :to="'/user/binding'" class="binding" v-else>
            <span>绑定手机号</span>
          </router-link>
        </div>
      </div>
      <span
        class="iconfont icon-shezhi"
        @click="$router.push({ path: '/user/data' })"
      ></span>
    </div>
    <div class="wrapper">
      <div class="nav acea-row row-middle">
        <router-link :to="{ path: '/user/account' }" class="item">
          <div>我的余额</div>
          <div class="num">{{ userInfo.now_money || 0 }}</div>
        </router-link>
        <router-link
          :to="'/user/user_promotion'"
          class="item"
          v-if="userInfo.is_promoter === 1 || userInfo.statu === 2"
        >
          <div>当前佣金</div>
          <div class="num">{{ userInfo.brokerage_price || 0 }}</div>
        </router-link>
        <router-link :to="'/user/integral'" class="item" v-else>
          <div>当前积分</div>
          <div class="num">{{ userInfo.integral || 0 }}</div>
        </router-link>
        <router-link :to="'/user/user_coupon'" class="item">
          <div>优惠券</div>
          <div class="num">{{ userInfo.couponCount || 0 }}</div>
        </router-link>
      </div>
      <div class="myOrder">
        <div class="title acea-row row-between-wrapper">
          <div>我的订单</div>
          <router-link :to="'/order/list/'" class="allOrder">
            全部订单<span class="iconfont icon-jiantou"></span>
          </router-link>
        </div>
        <div class="orderState acea-row row-middle">
          <router-link :to="{ path: '/order/list/' + 0 }" class="item">
            <div class="pictrue">
              <img src="@assets/images/dfk.png" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.unpaid_count > 0"
                >{{ orderStatusNum.unpaid_count }}</span
              >
            </div>
            <div>待付款</div>
          </router-link>
          <router-link :to="{ path: '/order/list/' + 1 }" class="item">
            <div class="pictrue">
              <img src="@assets/images/dfh.png" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.unshipped_count > 0"
                >{{ orderStatusNum.unshipped_count }}</span
              >
            </div>
            <div>待发货</div>
          </router-link>
          <router-link :to="{ path: '/order/list/' + 2 }" class="item">
            <div class="pictrue">
              <img src="@assets/images/dsh.png" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.received_count > 0"
                >{{ orderStatusNum.received_count }}</span
              >
            </div>
            <div>待收货</div>
          </router-link>
          <router-link :to="{ path: '/order/list/' + 3 }" class="item">
            <div class="pictrue">
              <img src="@assets/images/dpj.png" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.evaluated_count > 0"
                >{{ orderStatusNum.evaluated_count }}</span
              >
            </div>
            <div>待评价</div>
          </router-link>
          <router-link :to="'/order/refund_list'" class="item">
            <div class="pictrue">
              <img src="@assets/images/sh.png" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.refund_count > 0"
                >{{ orderStatusNum.refund_count }}</span
              >
            </div>
            <div>售后/退款</div>
          </router-link>
        </div>
      </div>
      <div class="myService">
        <div class="title acea-row row-middle">我的服务</div>
        <div class="serviceList acea-row row-middle">
          <template v-for="(item, index) in MyMenus">
            <div
              class="item"
              :key="index"
              @click="goPages(index)"
              v-if="item.wap_url"
            >
              <div class="pictrue">
                <img :src="item.pic" />
              </div>
              <div>{{ item.name }}</div>
            </div>
          </template>
          <!--<div-->
          <!--class="item"-->
          <!--@click="changeswitch(true)"-->
          <!--v-if="userInfo.phone && isWeixin"-->
          <!--&gt;-->
          <!--<div class="pictrue"><img src="@assets/images/switch.png" /></div>-->
          <!--<div>账号切换</div>-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <img src="@assets/images/support.png" class="support" />
    <div class="footer-line-height"></div>
    <SwitchWindow
      v-on:changeswitch="changeswitch"
      :switchActive="switchActive"
      :login_type="userInfo.login_type"
    ></SwitchWindow>
  </div>
</template>
<script>
import { getUser, getMenuUser } from "@api/user";
import { isWeixin } from "@utils";
import SwitchWindow from "@components/SwitchWindow";

const NAME = "User";

export default {
  name: NAME,
  components: {
    SwitchWindow
  },
  props: {},
  data: function() {
    return {
      userInfo: {},
      MyMenus: [],
      orderStatusNum: {},
      switchActive: false,
      isWeixin: false
    };
  },
  watch: {
    $route(n) {
      if (n.name === NAME) this.User();
    }
  },
  mounted: function() {
    this.User();
    this.MenuUser();
    this.isWeixin = isWeixin();
  },
  methods: {
    changeswitch: function(data) {
      this.switchActive = data;
    },
    User: function() {
      let that = this;
      getUser().then(res => {
        that.userInfo = res.data;
        that.orderStatusNum = res.data.orderStatusNum;
      });
    },
    MenuUser: function() {
      let that = this;
      getMenuUser().then(res => {
        that.MyMenus = res.data.routine_my_menus;
      });
    },
    goPages: function(index) {
      let url = this.MyMenus[index].wap_url;
      if (url === "/user/user_promotion" && this.userInfo.statu === 1) {
        if (!this.userInfo.is_promoter)
          return this.$dialog.toast({ mes: "您还没有推广权限！！" });
      }
      if (url === "/customer/index" && !this.userInfo.adminid) {
        return this.$dialog.toast({ mes: "您还不是客服！！" });
      }

      this.$router.push({ path: this.MyMenus[index].wap_url });
    }
  }
};
</script>

<style scoped>
.footer-line-height {
  height: 1rem;
}
.order-status-num {
  min-width: 0.33rem;
  background-color: #fff;
  color: #ee5a52;
  border-radius: 15px;
  position: absolute;
  right: -0.14rem;
  top: -0.15rem;
  font-size: 0.2rem;
  padding: 0 0.08rem;
  border: 1px solid #ee5a52;
}

.pictrue {
  position: relative;
}
.switch-h5 {
  margin-left: 0.2rem;
}
.binding {
  padding: 0.05rem 0.2rem;
  background-color: #ca1f10;
  border-radius: 50px;
  font-size: 0.14rem;
  border: 1px solid #e8695e;
  color: #ffffff;
}
</style>
