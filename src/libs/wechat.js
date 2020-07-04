import WechatJSSDK from "wechat-jssdk/dist/client.umd";
import { getWechatConfig, wechatAuth } from "@api/public";
import { parseQuery } from "@utils";
import cookie from "@utils/store/cookie";
import store from "@/store";
const STATE_KEY = "wx_authorize_state";
const WX_AUTH = "wx_auth";
const BACK_URL = "login_back_url";
const LOGINTYPE = "loginType";
let instance;
let wechatObj;
const LONGITUDE = "user_longitude";
const LATITUDE = "user_latitude";

const WECHAT_SCRIPT_URL = "//res.wx.qq.com/open/js/jweixin-1.6.0.js";

export default function wechat() {
  return new Promise((resolve, reject) => {
    if (instance) return resolve(instance);
    getWechatConfig()
      .then(res => {
        res.data.customUrl = WECHAT_SCRIPT_URL;
        const _wx = WechatJSSDK(res.data);
        wechatObj = _wx;
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
        let expires_time = data.expires_time.substring(0, 19);
        expires_time = expires_time.replace(/-/g, "/");
        expires_time = new Date(expires_time).getTime() - 28800000;
        const datas = {
          token: data.token,
          expires_time: expires_time
        };
        store.commit("LOGIN", datas);
        cookie.set(WX_AUTH, code, expires_time);
        cookie.remove(STATE_KEY);
        loginType && cookie.remove(LOGINTYPE);
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
  return new Promise((resolve, reject) => {
    wechatEvevt("openAddress", {})
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        if (res.is_ready) {
          res.wx.openAddress({
            fail(res) {
              reject(res);
            },
            success(res) {
              resolve(res);
            }
          });
        } else {
          reject(res);
        }
      });
  });
}

export function openShareAll(config) {
  config || {};
  config.type = config.type == undefined ? "link" : config.type;
  return new Promise(resolve => {
    getWechatConfig().then(res => {
      wechatObj.signSignature({
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
        timestamp: res.data.timestamp
      });
      instance = wechatObj.getOriginalWx();
      instance.ready(() => {
        instance.updateAppMessageShareData(config);
        instance.updateTimelineShareData(config);
        resolve();
      });
    });
  });
}

export function openShareAppMessage(config) {
  instance.updateAppMessageShareData(config);
  instance.onMenuShareAppMessage && instance.onMenuShareAppMessage(config);
}

export function openShareTimeline(config) {
  instance.updateTimelineShareData(config);
  instance.onMenuShareTimeline && instance.onMenuShareTimeline(config);
}

/**
 * 公众号事件
 * @param name 事件名
 * @param config 配置
 * @returns {Promise<unknown>}
 */
export function wechatEvevt(name, config) {
  return new Promise((resolve, reject) => {
    let wx;
    let configDefault = {
      fail(res) {
        console.log(res);
        if (wx) return reject({ is_ready: true, wx: wx });
        getWechatConfig().then(res => {
          wechatObj.signSignature({
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            timestamp: res.data.timestamp
          });
          wx = wechatObj.getOriginalWx();
          reject({ is_ready: true, wx: wx });
        });
      },
      success(res) {
        resolve(res);
      },
      cancel(err) {
        reject(err);
      },
      complete(err) {
        reject(err);
      }
    };
    Object.assign(configDefault, config);
    getWechatConfig().then(res => {
      const _wx = WechatJSSDK(res.data);
      _wx.initialize().then(() => {
        instance = _wx.getOriginalWx();
        instance.ready(() => {
          if (typeof name === "object") {
            name.forEach(item => {
              instance[item] && instance[item](configDefault);
            });
          } else instance[name] && instance[name](configDefault);
        });
      });
    });
  });
}

export function ready() {
  return new Promise(resolve => {
    if (typeof instance !== "undefined") {
      instance.ready(() => {
        resolve(instance);
      });
    } else {
      getWechatConfig().then(res => {
        const _wx = WechatJSSDK(res.data);
        _wx.initialize().then(() => {
          instance = _wx.wx;
          instance.ready(() => {
            resolve(instance);
          });
        });
      });
    }
  });
}

export function wxShowLocation() {
  return new Promise((resolve, reject) => {
    let longitude = cookie.get(LONGITUDE); //经度
    let latitude = cookie.get(LATITUDE); //纬度
    if (longitude && latitude) {
      return resolve({ longitude: longitude, latitude: latitude });
    }
    wechatEvevt("getLocation", { type: "wgs84" })
      .then(res => {
        let latitude = res.latitude; // 纬度
        let longitude = res.longitude; // 经度
        cookie.set(LATITUDE, latitude);
        cookie.set(LONGITUDE, longitude);
        resolve(res);
      })
      .catch(res => {
        cookie.remove(LATITUDE);
        cookie.remove(LONGITUDE);
        reject(res);
        if (res.is_ready) {
          res.wx.getLocation({
            success(res) {
              let latitude = res.latitude; // 纬度
              let longitude = res.longitude; // 经度
              cookie.set(LATITUDE, latitude);
              cookie.set(LONGITUDE, longitude);
              resolve(res);
            },
            cancel(res) {
              cookie.remove(LATITUDE);
              cookie.remove(LONGITUDE);
              reject(res);
            },
            fail(res) {
              cookie.remove(LATITUDE);
              cookie.remove(LONGITUDE);
              reject(res);
            }
          });
        } else {
          cookie.remove(LATITUDE);
          cookie.remove(LONGITUDE);
          reject(res);
        }
      })
      .fail(error => {
        reject(error);
      });
  });
}
