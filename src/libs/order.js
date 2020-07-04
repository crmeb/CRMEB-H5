import { cancelOrder, takeOrder, delOrder, payOrder } from "@api/order";
import dialog from "@utils/dialog";
import { pay } from "@libs/wechat";
import router from "../router";

export function cancelOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认取消该订单?",
      opts() {
        cancelOrder(orderId)
          .then(res => {
            dialog.success("取消成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error("取消失败");
            reject(err);
          });
      }
    });
  });
}

export function takeOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    takeOrder(orderId)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        dialog.error("收货失败");
        reject(err);
      });
  });
}

export function delOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认删除该订单?",
      opts() {
        delOrder(orderId)
          .then(res => {
            dialog.success("删除成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error("删除失败");
            reject(err);
          });
      }
    });
  });
}

export function payOrderHandle(orderId, type, from) {
  return new Promise((resolve, reject) => {
    dialog.loading.open("");
    payOrder(orderId, type, from)
      .then(res => {
        const data = res.data;
        dialog.loading.close();
        switch (data.status) {
          case "WECHAT_H5_PAY":
            reject(data);
            setTimeout(() => {
              location.replace(data.result.jsConfig.mweb_url);
            }, 100);
            break;
          case "ORDER_EXIST":
          case "EXTEND_ORDER":
          case "PAY_ERROR":
          case "PAY_DEFICIENCY":
            dialog.toast({ mes: res.msg });
            reject(data);
            break;
          case "SUCCESS":
            dialog.success(res.msg);
            resolve(data);
            break;
          case "WECHAT_PAY":
            pay(data.result.jsConfig).then(() => {
              resolve(data);
            });
        }
      })
      .catch(err => {
        dialog.loading.close();
        dialog.toast({ mes: err.msg || "订单支付失败" });
      });
  });
}

export function goShopDetail(item) {
  return new Promise(resolve => {
    if (item.activity && item.activity.type === "1") {
      router.push({
        path:
          "/activity/seckill_detail/" +
          item.activity.id +
          "/" +
          item.activity.time +
          "/1"
      });
    } else if (item.activity && item.activity.type === "2") {
      router.push({
        path: "/activity/dargain_detail/" + item.activity.id
      });
    } else if (item.activity && item.activity.type === "3") {
      router.push({
        path: "/activity/group_detail/" + item.activity.id
      });
    } else {
      resolve(item);
    }
  });
}
