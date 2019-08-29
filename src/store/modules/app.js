import store from "@utils/store/cookie";
import { getUserInfo } from "@api/user";
import dialog from "@utils/dialog";

const LOGIN_KEY = "login_status";

const state = {
  footer: true,
  home: true,
  homeActive: false,
  token: store.get(LOGIN_KEY) || null,
  backgroundColor: "#fff",
  userInfo: null
};

const mutations = {
  SHOW_FOOTER(state) {
    state.footer = true;
  },
  HIDE_FOOTER(state) {
    state.footer = false;
  },
  SHOW_HOME(state) {
    state.home = true;
  },
  HIDE_HOME(state) {
    state.home = false;
  },
  OPEN_HOME(state) {
    state.homeActive = true;
  },
  CLOSE_HOME(state) {
    state.homeActive = false;
  },
  LOGIN(state, token, expires_time) {
    state.token = token;
    store.set(LOGIN_KEY, token, expires_time);
  },
  LOGOUT(state) {
    state.token = undefined;
    store.remove(LOGIN_KEY);
  },
  BACKGROUND_COLOR(state, color) {
    state.color = color;
    document.body.style.backgroundColor = color;
  },
  UPDATE_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  }
};

const actions = {
  USERINFO({ state, commit }, force) {
    if (state.userInfo !== null && !force)
      return Promise.resolve(state.userInfo);
    else
      return new Promise(reslove => {
        getUserInfo().then(res => {
          commit("UPDATE_USERINFO", res.data);
          reslove(res.data);
        });
      }).catch(() => {
        dialog.error("获取信息失败!");
      });
  }
};

export default {
  state,
  mutations,
  actions
};
