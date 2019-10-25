<template>
  <div class="evaluate-con">
    <div class="goodsStyle acea-row row-between" v-if="orderCon.productInfo">
      <div class="pictrue">
        <img :src="orderCon.productInfo.image" class="image" />
      </div>
      <div class="text acea-row row-between">
        <div class="name line2">
          {{ orderCon.productInfo.store_name }}
        </div>
        <div class="money">
          <div>￥{{ orderCon.productInfo.price }}</div>
          <div class="num">x{{ orderCon.cart_num }}</div>
        </div>
      </div>
    </div>
    <div class="score">
      <div
        class="item acea-row row-middle"
        v-for="(item, indexw) in scoreList"
        :key="indexw"
      >
        <div>{{ item.name }}</div>
        <div class="starsList">
          <span
            @click="stars(indexn, indexw)"
            v-for="(itemn, indexn) in item.stars"
            :key="indexn"
            class="iconfont"
            :class="
              item.index >= indexn
                ? 'icon-shitixing font-color-red'
                : 'icon-kongxinxing'
            "
          ></span>
        </div>
        <span class="evaluate">{{
          item.index === -1 ? "" : item.index + 1 + "分"
        }}</span>
      </div>
      <div class="textarea">
        <textarea
          placeholder="商品满足你的期待么？说说你的想法，分享给想买的他们吧~"
          v-model="expect"
        ></textarea>
        <div class="list acea-row row-middle">
          <div
            class="pictrue"
            v-for="(item, index) in uploadPictures"
            :key="index"
          >
            <img :src="item" />
            <span
              class="iconfont icon-guanbi1 font-color-red"
              @click="uploadPictures.splice(index, 1)"
            ></span>
          </div>
          <VueCoreImageUpload
            class="btn btn-primary"
            :crop="false"
            compress="80"
            @imageuploaded="imageuploaded"
            :headers="headers"
            :max-file-size="5242880"
            :credentials="false"
            inputAccept="image/*"
            inputOfFile="file"
            :url="url"
            v-if="uploadPictures.length < 8"
          >
            <div
              class="pictrue uploadBnt acea-row row-center-wrapper row-column"
            >
              <span class="iconfont icon-icon25201"></span>
              <div>上传图片</div>
            </div>
          </VueCoreImageUpload>
        </div>
      </div>
      <div class="evaluateBnt bg-color-red" @click="submit">立即评价</div>
    </div>
  </div>
</template>
<style scoped>
.evaluate-con .score .textarea .list .pictrue.uploadBnt {
  border: 1px solid #ddd;
}
</style>
<script>
import { postOrderProduct, postOrderComment } from "@api/store";
import { trim, VUE_APP_API_URL } from "@utils";
import { required } from "@utils/validate";
import VueCoreImageUpload from "vue-core-image-upload";
import { validatorDefaultCatch } from "@utils/dialog";

const NAME = "GoodsEvaluate";

export default {
  name: NAME,
  components: {
    VueCoreImageUpload
  },
  props: {},
  data: function() {
    return {
      orderCon: {
        cartProduct: {
          productInfo: {}
        }
      },
      scoreList: [
        {
          name: "商品质量",
          stars: ["", "", "", "", ""],
          index: -1
        },
        {
          name: "服务态度",
          stars: ["", "", "", "", ""],
          index: -1
        }
      ],
      url: `${VUE_APP_API_URL}/upload/image`,
      headers: {
        "Authori-zation": "Bearer " + this.$store.state.app.token
      },
      uploadPictures: [],
      expect: "",
      unique: this.$route.params.id
    };
  },
  mounted: function() {
    this.getOrderProduct();
  },
  watch: {
    $route(n) {
      if (n.name === NAME && this.unique !== n.params.id) {
        this.unique = n.params.id;
        this.$set(this.scoreList[0], "index", -1);
        this.$set(this.scoreList[1], "index", -1);
        this.expect = "";
        this.uploadPictures = [];
        this.getOrderProduct();
      }
    }
  },
  methods: {
    getOrderProduct: function() {
      let that = this,
        unique = that.unique;
      postOrderProduct(unique).then(res => {
        that.orderCon = res.data;
      });
    },
    stars: function(indexn, indexw) {
      this.scoreList[indexw].index = indexn;
    },
    imageuploaded(res) {
      if (res.status !== 200)
        return this.$dialog.error(res.msg || "上传图片失败");
      this.uploadPictures.push(res.data.url);
    },
    async submit() {
      const expect = trim(this.expect),
        product_score =
          this.scoreList[0].index + 1 === 0 ? "" : this.scoreList[0].index + 1,
        service_score =
          this.scoreList[1].index + 1 === 0 ? "" : this.scoreList[1].index + 1;
      try {
        await this.$validator({
          product_score: [
            required("请选择商品质量分数", {
              type: "number"
            })
          ],
          service_score: [
            required("请选择服务态度分数", {
              type: "number"
            })
          ]
        }).validate({ product_score, service_score });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      postOrderComment({
        product_score: product_score,
        service_score: service_score,
        unique: this.unique,
        pics: this.uploadPictures.join(","),
        comment: expect
      })
        .then(() => {
          this.$dialog.success("评价成功");
          this.$router.replace({
            path: "/order/detail/" + this.orderCon.order_id
          });
        })
        .catch(res => {
          this.$dialog.error(res.msg);
        });
    }
  }
};
</script>
