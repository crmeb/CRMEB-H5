import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import animate from "animate.css";
import schema from "async-validator";
import dialog from "./utils/dialog";
import $scroll from "@utils/loading";
import cookie from "@utils/store/cookie";

import "@assets/iconfont/iconfont";
import "@assets/iconfont/iconfont.css";
import "@assets/js/media_750";
import "vue-ydui/dist/ydui.base.css";
import "@assets/css/base.css";
import "@assets/css/reset.css";
import "@assets/css/style.css";
import { isWeixin, parseQuery } from "@utils";

Vue.use(animate);
Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== "production";
Vue.prototype.$validator = function(rule) {
  return new schema(rule);
};
Vue.prototype.$scroll = $scroll;
Vue.prototype.$dialog = dialog;

const CACHE_KEY = "clear_0.0.1";

if (!cookie.has(CACHE_KEY)) {
  cookie.clearAll();
  cookie.set(CACHE_KEY, 1);
}

var urlSpread = parseQuery()["spread"];

if (urlSpread !== undefined) {
  var spread = cookie.get("spread");
  urlSpread = parseInt(urlSpread);
  if (!Number.isNaN(urlSpread) && spread !== urlSpread) {
    cookie.set("spread", urlSpread || 0);
  } else if (spread === 0 || typeof spread !== "number") {
    cookie.set("spread", urlSpread || 0);
  }
}

const _isWechat = isWeixin();
// const module = () => import("vconsole");
// module().then(Module => {
//   new Module.default();
// });

if (_isWechat) {
  const module = () => import("@libs/wechat");
  module().then(Module => {
    Module.default().then(() => Module.oAuth());
  });
}

const $vm = new Vue({
  router,
  store,
  render: h => h(App)
});

setTimeout(() => {
  $vm.$mount("#app");
}, 300);
