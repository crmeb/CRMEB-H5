<template>
  <div>
    <div class="product-window" :class="attr.cartAttr === true ? 'on' : ''">
      <div class="textpic acea-row row-between-wrapper">
        <div class="pictrue">
          <img :src="attr.productSelect.image" class="image" />
        </div>
        <div class="text">
          <div class="line1">
            {{ attr.productSelect.store_name }}
          </div>
          <div class="money font-color-red">
            ￥<span class="num">{{ attr.productSelect.price }}</span
            ><span class="stock">库存: {{ attr.productSelect.stock }}</span>
          </div>
        </div>
        <div class="iconfont icon-guanbi" @click="closeAttr"></div>
      </div>
      <div class="productWinList">
        <div
          class="item"
          v-for="(item, indexw) in attr.productAttr"
          :key="indexw"
        >
          <div class="title">{{ item.attr_name }}</div>
          <div class="listn acea-row row-middle">
            <div
              class="itemn"
              :class="item.index === indexn ? 'on' : ''"
              v-for="(itemn, indexn) in item.attr_value"
              @click="tapAttr(indexw, indexn)"
              :key="indexn"
            >
              {{ itemn.attr }}
            </div>
          </div>
        </div>
      </div>
      <div class="cart">
        <div class="title">数量</div>
        <div class="carnum acea-row row-left">
          <div
            class="item reduce"
            :class="attr.productSelect.cart_num <= 1 ? 'on' : ''"
            @click="CartNumDes"
          >
            -
          </div>
          <div class="item num">{{ attr.productSelect.cart_num }}</div>
          <div
            class="item plus"
            :class="
              attr.productSelect.cart_num >= attr.productSelect.stock
                ? 'on'
                : ''
            "
            @click="CartNumAdd"
          >
            +
          </div>
        </div>
      </div>
    </div>
    <div
      class="mask"
      @touchmove.prevent
      :hidden="attr.cartAttr === false"
      @click="closeAttr"
    ></div>
  </div>
</template>
<script>
export default {
  name: "ProductWindow",
  props: {
    attr: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    closeAttr: function() {
      this.$emit("changeFun", { action: "changeattr", value: false });
    },
    CartNumDes: function() {
      this.$emit("changeFun", { action: "ChangeCartNum", value: false });
    },
    CartNumAdd: function() {
      this.$emit("changeFun", { action: "ChangeCartNum", value: 1 });
    },
    tapAttr: function(indexw, indexn) {
      let that = this;
      that.attr.productAttr[indexw].index = indexn;
      let value = that
        .getCheckedValue()
        .sort()
        .join(",");
      that.$emit("changeFun", { action: "ChangeAttr", value: value });
    },
    //获取被选中属性；
    getCheckedValue: function() {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (let i = 0; i < productAttr.length; i++) {
        for (let j = 0; j < productAttr[i].attr_values.length; j++) {
          if (productAttr[i].index === j) {
            value.push(productAttr[i].attr_values[j]);
          }
        }
      }
      return value;
    }
  }
};
</script>
