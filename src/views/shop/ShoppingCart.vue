<template>
  <div class="shoppingCart">
    <div class="labelNav acea-row row-around row-middle">
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>100%正品保证
      </div>
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>所有商品精挑细选
      </div>
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>售后无忧
      </div>
    </div>
    <div class="nav acea-row row-between-wrapper">
      <div>
        购物数量 <span class="num font-color-red">{{ count }}</span>
      </div>
      <div
        v-if="cartList.valid.length > 0"
        class="administrate acea-row row-center-wrapper"
        @click="manage"
      >
        {{ footerswitch ? "取消" : "管理" }}
      </div>
    </div>
    <div v-if="cartList.valid.length > 0 || cartList.invalid.length > 0">
      <div class="list">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, index) in cartList.valid"
          :key="index"
        >
          <div class="select-btn">
            <div class="checkbox-wrapper">
              <label class="well-check">
                <input
                  type="checkbox"
                  name=""
                  value=""
                  :checked="item.checked"
                  @click="switchSelect(index)"
                />
                <i class="icon"></i>
              </label>
            </div>
          </div>
          <div class="picTxt acea-row row-between-wrapper">
            <div
              class="pictrue"
              @click="$router.push({ path: '/detail/' + item.product_id })"
            >
              <img
                :src="item.productInfo.attrInfo.image"
                v-if="item.productInfo.attrInfo"
              />
              <img :src="item.productInfo.image" v-else />
            </div>
            <div class="text">
              <div class="line1">{{ item.productInfo.store_name }}</div>
              <div class="infor line1" v-if="item.productInfo.attrInfo">
                属性：{{ item.productInfo.attrInfo.suk }}
              </div>
              <div class="money">￥{{ item.truePrice }}</div>
            </div>
            <div class="carnum acea-row row-center-wrapper">
              <div
                class="reduce"
                :class="cartList.valid[index].cart_num <= 1 ? 'on' : ''"
                @click.prevent="reduce(index)"
              >
                -
              </div>
              <div class="num">{{ item.cart_num }}</div>
              <div
                class="plus"
                v-if="cartList.valid[index].attrInfo"
                :class="
                  cartList.valid[index].cart_num >=
                  cartList.valid[index].attrInfo.stock
                    ? 'on'
                    : ''
                "
                @click.prevent="plus(index)"
              >
                +
              </div>
              <div
                class="plus"
                v-else
                :class="
                  cartList.valid[index].cart_num >= cartList.valid[index].stock
                    ? 'on'
                    : ''
                "
                @click.prevent="plus(index)"
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="invalidGoods" v-if="cartList.invalid.length > 0">
        <div class="goodsNav acea-row row-between-wrapper">
          <div @click="goodsOpen">
            <span
              class="iconfont"
              :class="goodsHidden === true ? 'icon-xiangyou' : 'icon-xiangxia'"
            ></span
            >失效商品
          </div>
          <div class="del" @click="delInvalidGoods">
            <span class="iconfont icon-shanchu1"></span>清空
          </div>
        </div>
        <div class="goodsList" :hidden="goodsHidden">
          <router-link
            :to="{ path: '/detail/' + item.product_id }"
            class="item acea-row row-between-wrapper"
            v-for="(item, index) in cartList.invalid"
            :key="index"
          >
            <div class="invalid acea-row row-center-wrapper">失效</div>
            <div class="pictrue">
              <img
                :src="item.productInfo.attrInfo.image"
                v-if="item.productInfo.attrInfo"
              />
              <img :src="item.productInfo.image" v-else />
            </div>
            <div class="text acea-row row-column-between">
              <div class="line1">{{ item.productInfo.store_name }}</div>
              <div class="infor line1" v-if="item.productInfo.attrInfo">
                属性：{{ item.productInfo.attrInfo.suk }}
              </div>
              <div class="acea-row row-between-wrapper">
                <div class="end">该商品已下架</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <!--购物车暂无商品-->
    <div
      class="noCart"
      v-if="cartList.valid.length === 0 && cartList.invalid.length === 0"
    >
      <div class="pictrue"><img src="@assets/images/noCart.png" /></div>
      <Recommend></Recommend>
    </div>
    <div style="height:2.1rem"></div>
    <div
      class="footer acea-row row-between-wrapper"
      v-if="cartList.valid.length > 0"
    >
      <div>
        <div class="select-btn">
          <div class="checkbox-wrapper">
            <label class="well-check">
              <input
                type="checkbox"
                name=""
                value=""
                :checked="isAllSelect && cartCount > 0"
                @click="allChecked"
              />
              <i class="icon"></i>
              <span class="checkAll">全选 ({{ cartCount }})</span>
            </label>
          </div>
        </div>
      </div>
      <div class="money acea-row row-middle" v-if="footerswitch === false">
        <span class="font-color-red">￥{{ countmoney }}</span>
        <div class="placeOrder bg-color-red" @click="placeOrder">立即下单</div>
      </div>
      <div class="button acea-row row-middle" v-else>
        <div class="bnt cart-color" @click="collectAll">收藏</div>
        <div class="bnt" @click="delgoods">删除</div>
      </div>
    </div>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import {
  getCartList,
  postCartDel,
  changeCartNum,
  getCartCount
} from "@api/store";
import { postCollectAll } from "@api/user";
import { mul, add } from "@utils/bc";
import cookie from "@utils/store/cookie";
import debounce from "lodash.debounce";

const CHECKED_IDS = "cart_checked";

export default {
  name: "ShoppingCart",
  components: {
    Recommend
  },
  props: {},
  data: function() {
    return {
      cartList: { invalid: [], valid: [] },
      isAllSelect: false,
      cartCount: 0,
      countmoney: 0,
      goodsHidden: true,
      footerswitch: false,
      count: 0,
      checkedIds: [],
      loaded: false
    };
  },
  watch: {
    $route(n) {
      if (n.name === "ShoppingCart") {
        this.carnum();
        this.countMoney();
        this.getCartList();
        this.gainCount();
        this.goodsHidden = true;
        this.footerswitch = false;
      }
    }
  },
  mounted: function() {
    let that = this;
    that.carnum();
    that.countMoney();
    that.getCartList();
    that.gainCount();
  },
  methods: {
    getCartList: function() {
      let that = this;
      getCartList().then(res => {
        that.cartList = res.data;
        let checkedIds = cookie.get(CHECKED_IDS) || [];
        if (!Array.isArray(checkedIds)) checkedIds = [];
        this.cartList.valid.forEach(cart => {
          if (checkedIds.length) {
            if (checkedIds.indexOf(cart.id) !== -1) cart.checked = true;
            else cart.checked = false;
          } else {
            cart.checked = true;
            that.checkedIds.push(cart.id);
          }
        });
        if (checkedIds.length) {
          that.checkedIds = checkedIds;
        }
        that.isAllSelect =
          that.checkedIds.length === this.cartList.valid.length;
        that.carnum();
        that.countMoney();
        this.loaded = true;
      });
    },
    //删除商品；
    delgoods: function() {
      let that = this,
        id = [],
        valid = [],
        list = that.cartList.valid;
      list.forEach(function(val) {
        if (val.checked === true) {
          id.push(val.id);
        }
      });
      if (id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      postCartDel(id).then(function() {
        list.forEach(function(val, i) {
          if (val.checked === false || val.checked === undefined)
            valid.push(list[i]);
        });
        that.$set(that.cartList, "valid", valid);
        that.carnum();
        that.countMoney();
        that.gainCount();
      });
    },
    // //获取数量
    gainCount: function() {
      let that = this;

      getCartCount().then(res => {
        that.count = res.data.count;
      });
    },
    //清除失效产品；
    delInvalidGoods: function() {
      let that = this,
        id = [],
        list = that.cartList.invalid;
      list.forEach(function(val) {
        id.push(val.id);
      });
      postCartDel(id).then(function() {
        list.splice(0, list.length);
        that.gainCount();
      });
    },
    //批量收藏;
    collectAll: function() {
      let that = this,
        data = { id: [], category: "" },
        list = that.cartList.valid;
      list.forEach(function(val) {
        if (val.checked === true) {
          data.id.push(val.product_id);
          data.category = val.type;
        }
      });
      if (data.id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      postCollectAll(data).then(function() {
        that.$dialog.toast({ mes: "收藏成功!" });
      });
    },
    //立即下单；
    placeOrder: function() {
      let that = this,
        list = that.cartList.valid,
        id = [];
      list.forEach(function(val) {
        if (val.checked === true) {
          id.push(val.id);
        }
      });
      if (id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      this.$router.push({ path: "/order/submit/" + id });
    },
    manage: function() {
      let that = this;
      that.footerswitch = !that.footerswitch;
    },
    goodsOpen: function() {
      let that = this;
      that.goodsHidden = !that.goodsHidden;
    },
    //加
    plus: function(index) {
      let that = this;
      let list = that.cartList.valid[index];
      list.cart_num++;
      if (list.attrInfo) {
        if (list.cart_num >= list.attrInfo.stock) {
          that.$set(list, "cart_num", list.attrInfo.stock);
        }
      } else {
        if (list.cart_num >= list.stock) {
          that.$set(list, "cart_num", list.stock);
        }
      }
      that.carnum();
      that.countMoney();
      that.syncCartNum(list);
    },
    //减
    reduce: function(index) {
      let that = this;
      let list = that.cartList.valid[index];
      list.cart_num--;
      if (list.cart_num < 1) {
        that.$set(list, "cart_num", 1);
      }
      that.carnum();
      that.countMoney();
      that.syncCartNum(list);
    },
    syncCartNum(cart) {
      if (!cart.sync)
        cart.sync = debounce(() => {
          changeCartNum(cart.id, Math.max(cart.cart_num, 1) || 1);
        }, 500);

      cart.sync();
    },
    //单选
    switchSelect: function(index) {
      let that = this,
        cart = that.cartList.valid[index],
        i = this.checkedIds.indexOf(cart.id);
      cart.checked = !cart.checked;

      if (i !== -1) this.checkedIds.splice(i, 1);
      if (cart.checked) {
        this.checkedIds.push(cart.id);
      }
      let len = that.cartList.valid.length;
      let selectnum = [];
      for (let i = 0; i < len; i++) {
        if (that.cartList.valid[i].checked === true) {
          selectnum.push(true);
        }
      }
      that.isAllSelect = selectnum.length === len;
      that.$set(that, "cartList", that.cartList);
      that.$set(that, "isAllSelect", that.isAllSelect);
      cookie.set(CHECKED_IDS, that.checkedIds);
      that.carnum();
      that.countMoney();
    },
    //全选
    allChecked: function() {
      let that = this;
      let selectAllStatus = that.isAllSelect;
      selectAllStatus = !selectAllStatus;
      let checkedIds = [];
      // for (let i = 0; i < array.length; i++) {
      //   array[i].checked = selectAllStatus;
      //   checked.push()
      // }
      that.cartList.valid.forEach(cart => {
        cart.checked = selectAllStatus;
        if (selectAllStatus) checkedIds.push(cart.id);
      });
      that.$set(that, "cartList", that.cartList);
      that.$set(that, "isAllSelect", selectAllStatus);
      this.checkedIds = checkedIds;
      cookie.set(CHECKED_IDS, checkedIds);
      that.carnum();
      that.countMoney();
    },
    //数量
    carnum: function() {
      let that = this;
      var carnum = 0;
      var array = that.cartList.valid;
      for (let i = 0; i < array.length; i++) {
        if (array[i].checked === true) {
          carnum += parseInt(array[i].cart_num);
        }
      }
      that.$set(that, "cartCount", carnum);
    },
    //总共价钱；
    countMoney: function() {
      let that = this;
      let carmoney = 0;
      let array = that.cartList.valid;
      for (let i = 0; i < array.length; i++) {
        if (array[i].checked === true) {
          carmoney = add(carmoney, mul(array[i].cart_num, array[i].truePrice));
        }
      }
      that.countmoney = carmoney;
    }
  }
};
</script>
