<template>
  <div>
    <div class="address-window" :class="value === true ? 'on' : ''">
      <div class="title">
        选择地址<span class="iconfont icon-guanbi" @click="closeAddress"></span>
      </div>
      <div class="list" v-if="addressList.length">
        <div
          class="item acea-row row-between-wrapper"
          :class="item.id === checked ? 'font-color-red' : ''"
          v-for="(item, index) in addressList"
          @click="tapAddress(index)"
          :key="index"
        >
          <span
            class="iconfont icon-ditu"
            :class="item.id === checked ? 'font-color-red' : ''"
          ></span>
          <div class="addressTxt">
            <div
              class="name"
              :class="item.id === checked ? 'font-color-red' : ''"
            >
              {{ item.real_name }}<span class="phone">{{ item.phone }}</span>
            </div>
            <div class="line1">
              {{ item.province }}{{ item.city }}{{ item.district
              }}{{ item.detail }}
            </div>
          </div>
          <span
            class="iconfont icon-complete"
            :class="item.id === checked ? 'font-color-red' : ''"
          ></span>
        </div>
      </div>
      <div class="pictrue" v-if="addressList.length < 1">
        <img src="@assets/images/noAddress.png" class="image" />
      </div>
      <div class="addressBnt bg-color-red" @click="goAddressPages">
        新加地址
      </div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      :hidden="value === false"
      @click="closeAddress"
    ></div>
  </div>
</template>
<script>
import { getAddressList } from "../api/user";
export default {
  name: "AddressWindow",
  props: {
    value: Boolean,
    checked: Number
  },
  data: function() {
    return {
      addressList: [],
      current: 0,
      cartId: 0,
      pinkId: 0,
      couponId: 0
    };
  },
  mounted: function() {},
  methods: {
    getAddressList: function() {
      let that = this;
      getAddressList().then(res => {
        that.addressList = res.data;
      });
    },
    closeAddress() {
      this.$emit("input", false);
    },
    goAddressPages: function() {
      this.$router.push({ path: "/user/add_address" });
      this.$emit("redirect");
    },
    tapAddress: function(index) {
      this.$emit("checked", this.addressList[index]);
      this.$emit("input", false);
    }
  }
};
</script>
