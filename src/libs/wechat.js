import WechatJSSDK from "wechat-jssdk/dist/client.umd";
import { getWechatConfig, wechatAuth } from "@api/public";
import { parseQuery } from "@utils";
import cookie from "@utils/store/cookie";
import store from "@/store";
import dayjs from "dayjs";

const STATE_KEY = "wx_authorize_state";
const WX_AUTH = "wx_auth";
const BACK_URL = "login_back_url";
const LOGINTYPE = "loginType";
let instance;

export default function wechat() {
  return new Promise((resolve, reject) => {
    if (instance) return resolve(instance);
    getWechatConfig()
      .then(res => {
        const _wx = WechatJSSDK(res.data);
        _wx
          .initialize()
          .then(() => {
            instance = _wx.wx;
            instance.initConfig = res.data;
            resolve(instance);
          })
          .catch(reject);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

export function clearAuthStatus() {
  cookie.remove(WX_AUTH);
  cookie.remove(STATE_KEY);
}

export function oAuth() {
  if (cookie.has(WX_AUTH) && store.state.app.token) return;
  const { code } = parseQuery();
  if (!code) return toAuth();
}

export function auth(code) {
  return new Promise((resolve, reject) => {
    let loginType = cookie.get(LOGINTYPE);
    //if (state !== cookie.get(STATE_KEY)) return reject();
    wechatAuth(code, parseInt(cookie.get("spread")), loginType)
      .then(({ data }) => {
        const expires_time = dayjs(data.expires_time);
        store.commit("LOGIN", data.token, expires_time);
        cookie.set(WX_AUTH, code, expires_time);
        cookie.remove(STATE_KEY);
        loginType && cookie.remove("loginType");
        resolve();
      })
      .catch(reject);
  });
}

export function toAuth() {
  wechat().then(wx => {
    location.href = getAuthUrl(wx.initConfig.appId);
  });
}

function getAuthUrl(appId) {
  const redirect_uri = encodeURIComponent(
    `${location.origin}/auth/` +
      encodeURIComponent(
        encodeURIComponent(
          cookie.has(BACK_URL)
            ? cookie.get(BACK_URL)
            : location.pathname + location.search
        )
      )
  );
  cookie.remove(BACK_URL);
  const state = encodeURIComponent(
    ("" + Math.random()).split(".")[1] + "authorizestate"
  );
  cookie.set(STATE_KEY, state);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
}

function toPromise(fn, config = {}) {
  return new Promise((resolve, reject) => {
    fn({
      ...config,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
      complete(err) {
        reject(err);
      },
      cancel(err) {
        reject(err);
      }
    });
  });
}

export function pay(config) {
  return toPromise(instance.chooseWXPay, config);
}

export function openAddress() {
  return toPromise(instance.openAddress);
}

export function openShareAppMessage(config) {
  instance.updateAppMessageShareData(config);
  instance.onMenuShareAppMessage && instance.onMenuShareAppMessage(config);
}

export function openShareTimeline(config) {
  instance.updateTimelineShareData(config);
  instance.onMenuShareTimeline && instance.onMenuShareTimeline(config);
}

export function ready() {
  return new Promise(resolve => {
    instance.ready(() => {
      resolve();
    });
  });
}
