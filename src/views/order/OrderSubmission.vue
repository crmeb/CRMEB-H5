<template>
  <div class="order-submission">
    <div
      class="allAddress"
      :style="store_self_mention ? '' : 'padding-top: 0.2rem'"
    >
      <div class="nav acea-row">
        <div
          class="item font-color-red"
          :class="shipping_type === 0 ? 'on' : 'on2'"
          @click="addressType(0)"
          v-if="store_self_mention"
        ></div>
        <div
          class="item font-color-red"
          :class="shipping_type === 1 ? 'on' : 'on2'"
          @click="addressType(1)"
          v-if="store_self_mention"
        ></div>
      </div>
      <div
        class="address acea-row row-between-wrapper"
        v-if="shipping_type === 0"
        @click="addressTap"
      >
        <div class="addressCon" v-if="addressInfo.real_name">
          <div class="name">
            {{ addressInfo.real_name }}
            <span class="phone">{{ addressInfo.phone }}</span>
          </div>
          <div>
            <span class="default font-color-red" v-if="addressInfo.is_default"
              >[默认]</span
            >
            {{ addressInfo.province }}{{ addressInfo.city
            }}{{ addressInfo.district }}{{ addressInfo.detail }}
          </div>
        </div>
        <div class="addressCon" v-else>
          <div class="setaddress">设置收货地址</div>
        </div>
        <div class="iconfont icon-jiantou"></div>
      </div>
      <div
        class="address acea-row row-between-wrapper"
        v-else
        @click="showStoreList"
      >
        <div class="addressCon">
          <div class="name" v-if="storeItem">
            {{ storeItem.name }}
            <span class="phone" v-text="storeItem.phone"></span>
          </div>
          <div
            v-text="storeItem.address + ',' + storeItem.detailed_address"
            v-if="storeItem && storeItem.address && storeItem.detailed_address"
          ></div>
        </div>
        <div class="iconfont icon-jiantou"></div>
      </div>
      <div class="line">
        <img src="@assets/images/line.jpg" />
      </div>
    </div>
    <OrderGoods :evaluate="0" :cartInfo="orderGroupInfo.cartInfo"></OrderGoods>
    <div class="wrapper">
      <div
        class="item acea-row row-between-wrapper"
        @click="couponTap"
        v-if="deduction === false"
      >
        <div>优惠券</div>
        <div class="discount">
          {{ usableCoupon.coupon_title || "请选择" }}
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="deduction === false">
        <div>积分抵扣</div>
        <div class="discount">
          <div class="select-btn">
            <div class="checkbox-wrapper">
              <label class="well-check">
                <input type="checkbox" v-model="useIntegral" />
                <i class="icon"></i>
                <span class="integral">
                  当前积分
                  <span class="num font-color-red">
                    {{ userInfo.integral || 0 }}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="
          orderGroupInfo.priceGroup.vipPrice > 0 &&
            userInfo.vip &&
            pinkId == 0 &&
            orderGroupInfo.bargain_id == 0 &&
            orderGroupInfo.combination_id == 0 &&
            orderGroupInfo.seckill_id == 0
        "
      >
        会员优惠
        <div class="discount">-￥{{ orderGroupInfo.priceGroup.vipPrice }}</div>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="shipping_type === 0">
        <div>快递费用</div>
        <div class="discount">
          {{
            orderPrice.pay_postage > 0
              ? "￥" + orderPrice.pay_postage
              : "免运费"
          }}
        </div>
      </div>
      <div v-else>
        <div class="item acea-row row-between-wrapper">
          <div>联系人</div>
          <div class="discount">
            <input
              type="text"
              placeholder="请填写您的联系姓名"
              v-model="contacts"
            />
          </div>
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>联系电话</div>
          <div class="discount">
            <input
              type="text"
              placeholder="请填写您的联系电话"
              v-model="contactsTel"
            />
          </div>
        </div>
      </div>
      <div class="item">
        <div>备注信息</div>
        <textarea
          placeholder="请添加备注（150字以内）"
          v-model="mark"
        ></textarea>
      </div>
    </div>
    <div class="wrapper">
      <div class="item">
        <div>支付方式</div>
        <div class="list">
          <div
            class="payItem acea-row row-middle"
            :class="active === 'weixin' ? 'on' : ''"
            @click="payItem('weixin')"
            v-show="isWeixin"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-weixin2"
                :class="active === 'weixin' ? 'bounceIn' : ''"
              ></div>
              微信支付
            </div>
            <div class="tip">微信快捷支付</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'weixin' ? 'on' : ''"
            @click="payItem('weixin')"
            v-show="!isWeixin"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-weixin2"
                :class="active === 'weixin' ? 'bounceIn' : ''"
              ></div>
              微信支付
            </div>
            <div class="tip">微信快捷支付</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'yue' ? 'on' : ''"
            @click="payItem('yue')"
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-icon-test"
                :class="active === 'yue' ? 'bounceIn' : ''"
              ></div>
              余额支付
            </div>
            <div class="tip">可用余额：{{ userInfo.now_money || 0 }}</div>
          </div>
          <div
            class="payItem acea-row row-middle"
            :class="active === 'offline' ? 'on' : ''"
            @click="payItem('offline')"
            v-if="
              offlinePayStatus === 1 &&
                deduction === false &&
                shipping_type === 0
            "
          >
            <div class="name acea-row row-center-wrapper">
              <div
                class="iconfont icon-yinhangqia"
                :class="active === 'offline' ? 'bounceIn' : ''"
              ></div>
              线下支付
            </div>
            <div class="tip">线下方便支付</div>
          </div>
        </div>
      </div>
    </div>
    <div class="moneyList">
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.total_price !== undefined"
      >
        <div>商品总价：</div>
        <div class="money">￥{{ orderPrice.total_price }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.pay_postage > 0"
      >
        <div>运费：</div>
        <div class="money">+￥{{ orderPrice.pay_postage }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.coupon_price > 0"
      >
        <div>优惠券抵扣：</div>
        <div class="money">-￥{{ orderPrice.coupon_price }}</div>
      </div>
      <div
        class="item acea-row row-between-wrapper"
        v-if="orderPrice.deduction_price > 0"
      >
        <div>积分抵扣：</div>
        <div class="money">-￥{{ orderPrice.deduction_price }}</div>
      </div>
    </div>

    <div style="height:1.2rem"></div>
    <div class="footer acea-row row-between-wrapper">
      <div>
        合计:
        <span class="font-color-red">￥{{ orderPrice.pay_price }}</span>
      </div>
      <div class="settlement" @click="createOrder">立即结算</div>
    </div>
    <CouponListWindow
      v-on:couponchange="changecoupon($event)"
      v-model="showCoupon"
      :price="orderPrice.total_price"
      :checked="usableCoupon.id"
      :cartid="cartid"
      @checked="changeCoupon"
    ></CouponListWindow>
    <AddressWindow
      @checked="changeAddress"
      @redirect="addressRedirect"
      v-model="showAddress"
      :checked="addressInfo.id"
      ref="mychild"
    ></AddressWindow>
  </div>
</template>
<style scoped>
.order-submission .wrapper .shipping select {
  color: #999;
  padding-right: 0.15rem;
}
.order-submission .wrapper .shipping .iconfont {
  font-size: 0.3rem;
  color: #515151;
}
.order-submission .allAddress {
  width: 100%;
  background-image: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  background-image: -webkit-linear-gradient(
    to bottom,
    #e93323 0%,
    #f5f5f5 100%
  );
  background-image: -moz-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  padding-top: 1rem;
}
.order-submission .allAddress .nav {
  width: 7.1rem;
  margin: 0 auto;
}
.order-submission .allAddress .nav .item {
  width: 3.55rem;
}
.order-submission .allAddress .nav .item.on {
  position: relative;
  width: 2.5rem;
}
.order-submission .allAddress .nav .item.on:before {
  position: absolute;
  bottom: 0;
  content: "快递配送";
  font-size: 0.28rem;
  display: block;
  height: 0;
  width: 3.55rem;
  border-width: 0 0.2rem 0.8rem 0;
  border-style: none solid solid;
  border-color: transparent transparent #fff;
  z-index: 9;
  border-radius: 0.07rem 0.3rem 0 0;
  text-align: center;
  line-height: 0.8rem;
}
.order-submission .allAddress .nav .item:nth-of-type(2).on:before {
  content: "到店自提";
  border-width: 0 0 0.8rem 0.2rem;
  border-radius: 0.3rem 0.07rem 0 0;
}
.order-submission .allAddress .nav .item.on2 {
  position: relative;
}
.order-submission .allAddress .nav .item.on2:before {
  position: absolute;
  bottom: 0;
  content: "到店自提";
  font-size: 0.28rem;
  display: block;
  height: 0;
  width: 4.6rem;
  border-width: 0 0 0.6rem 0.6rem;
  border-style: none solid solid;
  border-color: transparent transparent #f7c1bd;
  border-radius: 0.4rem 0.06rem 0 0;
  text-align: center;
  line-height: 0.6rem;
}
.order-submission .allAddress .nav .item:nth-of-type(1).on2:before {
  content: "快递配送";
  border-width: 0 0.6rem 0.6rem 0;
  border-radius: 0.06rem 0.4rem 0 0;
}
.order-submission .allAddress .address {
  width: 7.1rem;
  height: 1.5rem;
  margin: 0 auto;
}
.order-submission .allAddress .line {
  width: 7.1rem;
  margin: 0 auto;
}
.order-submission .wrapper .item .discount input::placeholder {
  color: #ccc;
}
</style>
<script>
import OrderGoods from "@components/OrderGoods";
import CouponListWindow from "@components/CouponListWindow";
import AddressWindow from "@components/AddressWindow";
import { postOrderConfirm, postOrderComputed, createOrder } from "@api/order";
import { storeListApi } from "@api/store";
import { getUser } from "@api/user";
import { pay } from "@libs/wechat";
import { isWeixin } from "@utils";
import { mapGetters } from "vuex";
import cookie from "@utils/store/cookie";
const NAME = "OrderSubmission",
  _isWeixin = isWeixin();
const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";
export default {
  name: NAME,
  components: {
    OrderGoods,
    CouponListWindow,
    AddressWindow
  },
  props: {},
  computed: {
    ...mapGetters(["storeItems"]),
    storeItem: function() {
      if (JSON.stringify(this.storeItems) == "{}") {
        return this.storeList;
      } else {
        return this.storeItems;
      }
    }
  },
  data: function() {
    return {
      cartid: "",
      offlinePayStatus: 2,
      from: _isWeixin ? "weixin" : "weixinh5",
      deduction: true,
      isWeixin: _isWeixin,
      pinkId: 0,
      active: _isWeixin ? "weixin" : "yue",
      showCoupon: false,
      showAddress: false,
      addressInfo: {},
      couponId: 0,
      orderGroupInfo: {
        priceGroup: {}
      },
      usableCoupon: {},
      addressLoaded: false,
      useIntegral: false,
      orderPrice: {
        pay_price: "计算中"
      },
      mark: "",
      system_store: {},
      shipping_type: 0,
      contacts: "",
      contactsTel: "",
      store_self_mention: 0,
      userInfo: {},
      storeList: {}
    };
  },
  watch: {
    useIntegral() {
      this.computedPrice();
    },
    $route(n) {
      if (n.name === NAME) {
        console.log(this.$route.query.pinkid);
        if (this.$route.query.pinkid !== undefined)
          this.pinkId = this.$route.query.pinkid;
        else {
          this.pinkId = 0;
        }
        this.getUserInfo();
        this.getCartInfo();
      }
    },
    shipping_type() {
      this.computedPrice();
    }
  },
  mounted: function() {
    let that = this;
    that.getUserInfo();
    that.getCartInfo();
    that.getList();
    if (this.$route.query.pinkid !== undefined)
      this.pinkId = this.$route.query.pinkid;
    if (that.$route.params.id !== undefined)
      that.cartid = that.$route.params.id;
  },
  methods: {
    // 获取门店列表数据
    getList: function() {
      let data = {
        latitude: cookie.get(LATITUDE) || "", //纬度
        longitude: cookie.get(LONGITUDE) || "", //经度
        page: 1,
        limit: 10
      };
      storeListApi(data)
        .then(res => {
          this.storeList = res.data.list[0];
        })
        .catch(err => {
          this.$dialog.error(err.msg);
        });
    },
    // 跳转到门店列表
    showStoreList() {
      this.$store.commit("GET_TO", "orders");
      this.$router.push("/shop/storeList/orders");
    },
    getUserInfo() {
      getUser()
        .then(res => {
          this.userInfo = res.data;
        })
        .catch(() => {});
    },
    addressType: function(index) {
      if (index && !this.system_store.id)
        return this.$dialog.error("暂无门店信息，您无法选择到店自提！");
      this.shipping_type = index;
    },
    computedPrice() {
      let shipping_type = this.shipping_type;
      postOrderComputed(this.orderGroupInfo.orderKey, {
        addressId: this.addressInfo.id,
        useIntegral: this.useIntegral ? 1 : 0,
        couponId: this.usableCoupon.id || 0,
        shipping_type: parseInt(shipping_type) + 1,
        payType: this.active
      })
        .then(res => {
          const data = res.data;
          if (data.status === "EXTEND_ORDER") {
            this.$router.replace({
              path: "/order/detail/" + data.result.orderId
            });
          } else {
            this.orderPrice = data.result;
          }
        })
        .catch(res => {
          this.$dialog.error(res.msg);
        });
    },
    getCartInfo() {
      const cartIds = this.$route.params.id;
      if (!cartIds) {
        this.$dialog.error("参数有误");
        return this.$router.go(-1);
      }
      postOrderConfirm(cartIds)
        .then(res => {
          this.offlinePayStatus = res.data.offline_pay_status;
          this.orderGroupInfo = res.data;
          this.deduction = res.data.deduction;
          this.usableCoupon = res.data.usableCoupon || {};
          this.addressInfo = res.data.addressInfo || {};
          this.system_store = res.data.system_store || {};
          this.store_self_mention = res.data.store_self_mention;
          this.computedPrice();
        })
        .catch(() => {
          this.$dialog.error("加载订单数据失败");
        });
    },
    addressTap: function() {
      this.showAddress = true;
      if (!this.addressLoaded) {
        this.addressLoaded = true;
        this.$refs.mychild.getAddressList();
      }
    },
    addressRedirect() {
      this.addressLoaded = false;
      this.showAddress = false;
    },
    couponTap: function() {
      this.showCoupon = true;
    },
    changeCoupon: function(coupon) {
      if (!coupon) {
        this.usableCoupon = { coupon_title: "不使用优惠券", id: 0 };
      } else {
        this.usableCoupon = coupon;
      }
      this.computedPrice();
    },
    payItem: function(index) {
      this.active = index;
      this.computedPrice();
    },
    changeAddress(addressInfo) {
      this.addressInfo = addressInfo;
      this.computedPrice();
    },
    createOrder() {
      let shipping_type = this.shipping_type;
      if (!this.active) return this.$dialog.toast({ mes: "请选择支付方式" });
      if (!this.addressInfo.id && !this.shipping_type)
        return this.$dialog.toast({ mes: "请选择收货地址" });
      if (this.shipping_type) {
        if (
          (this.contacts === "" || this.contactsTel === "") &&
          this.shipping_type
        )
          return this.$dialog.toast({ mes: "请填写联系人或联系人电话" });
        if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.contactsTel)) {
          return this.$dialog.toast({ mes: "请填写正确的手机号" });
        }
        if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(this.contacts)) {
          return this.$dialog.toast({ mes: "请填写您的真实姓名" });
        }
      }
      this.$dialog.loading.open("生成订单中");
      createOrder(this.orderGroupInfo.orderKey, {
        real_name: this.contacts,
        phone: this.contactsTel,
        addressId: this.addressInfo.id,
        useIntegral: this.useIntegral ? 1 : 0,
        couponId: this.usableCoupon.id || 0,
        payType: this.active,
        pinkId: this.pinkId,
        seckill_id: this.orderGroupInfo.seckill_id,
        combinationId: this.orderGroupInfo.combination_id,
        bargainId: this.orderGroupInfo.bargain_id,
        from: this.from,
        mark: this.mark || "",
        shipping_type: parseInt(shipping_type) + 1,
        store_id: this.storeItem ? this.storeItem.id : 0
      })
        .then(res => {
          this.$dialog.loading.close();
          const data = res.data;
          let url = "/order/status/" + data.result.orderId;
          switch (data.status) {
            case "ORDER_EXIST":
            case "EXTEND_ORDER":
            case "PAY_DEFICIENCY":
            case "PAY_ERROR":
              this.$dialog.toast({ mes: res.msg });
              this.$router.replace({
                path: url + "/0?msg=" + res.msg
              });
              break;
            case "SUCCESS":
              this.$dialog.success(res.msg);
              this.$router.replace({
                path: url + "/1"
              });
              break;
            case "WECHAT_H5_PAY":
              this.$router.replace({
                path: url + "/2"
              });
              setTimeout(() => {
                location.href = data.result.jsConfig.mweb_url;
              }, 100);
              break;
            case "WECHAT_PAY":
              pay(data.result.jsConfig).finally(() => {
                this.$router.replace({
                  path: url + "/4"
                });
              });
          }
        })
        .catch(err => {
          this.$dialog.error(err.msg || "创建订单失败");
          this.$dialog.loading.close();
          this.$router.go(-1);
        });
    }
  }
};
</script>
