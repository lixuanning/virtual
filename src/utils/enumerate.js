import zh from "../language/zh.js";
import en from "../language/en.js";
let locale = sessionStorage.getItem("locale") || "zh";
const language = {
  zh: zh.enumerate,
  en: en.enumerate,
};
export const getPlay = (key) => {
  const list = [
    {
      key: 1,
      // name: "信用卡",
      name: language[locale].bankCard,
      type: "warning",
    },
    {
      key: 2,
      // name: "微信",
      name: language[locale].weChat,
      type: "success",
    },
    {
      key: 3,
      // name: "支付宝",
      name: language[locale].aliPay,
      type: "primary",
    },
  ];
  if (key) {
    const item = list.find((item) => item.key === key);
    return item;
  } else {
    return list;
  }
};
// 状态1:新建 2:已转账 3:确认收到转账(完成) 4:取消
export const getStatus = (key) => {
  const list = [
    {
      key: 1,
      // name: "新建",
      name: language[locale].new,
      type: "default",
    },
    {
      key: 2,
      // name: "已转账",
      name: language[locale].transferred,
      type: "info",
    },
    {
      key: 3,
      // name: "完成",
      name: language[locale].completed,
      type: "success",
    },
    {
      key: 4,
      // name: "取消",
      name: language[locale].cancelled,
      type: "warning",
    },
  ];

  if (key) {
    const item = list.find((item) => item.key === key);
    return item;
  } else {
    return list;
  }
};

// 1:待审核 2:审核通过 3:审核未通过 4:封禁
export const getAuditStatus = (key) => {
  const list = [
    {
      key: 1,
      // name: "待审核",
      name: language[locale].pending,
      type: "default",
    },
    {
      key: 2,
      // name: "审核通过",
      name: language[locale].approved,
      type: "success",
    },
    {
      key: 3,
      // name: "审核未通过",
      name: language[locale].rejected,
      type: "info",
    },
    {
      key: 4,
      // name: "封禁",
      name: language[locale].banned,
      type: "warning",
    },
  ];

  if (key) {
    const item = list.find((item) => item.key === key);
    return item;
  } else {
    return list;
  }
};

// 1:待审核 2:审核通过 3:审核未通过 4:封禁
export const getWithdrawalList = (key) => {
  const list = [
    {
      key: 1,
      // name: "新建",
      name: language[locale].new,
      type: "default",
    },
    {
      key: 2,
      // name: "完成",
      name: language[locale].completed,
      type: "success",
    },
    {
      key: 3,
      // name: "取消",
      name: language[locale].cancelled,
      type: "info",
    },
  ];

  if (key) {
    const item = list.find((item) => item.key === key);
    return item;
  } else {
    return list;
  }
};
