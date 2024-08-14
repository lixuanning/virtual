export const getPlay = (key) => {
  const list = [
    {
      key: 1,
      name: "银行卡",
      type: "warning",
    },
    {
      key: 2,
      name: "微信",
      type: "success",
    },
    {
      key: 3,
      name: "支付宝",
      type: "primary",
    },
  ];
  if (key) {
    const item = list.find((item) => item.key === key);
    console.log(item, "item");
    return item;
  } else {
    console.log(list, "???");
    return list;
  }
};
// 状态1:新建 2:已转账 3:确认收到转账(完成) 4:取消
export const getStatus = (key) => {
  const list = [
    {
      key: 1,
      name: "新建",
      type: "default",
    },
    {
      key: 2,
      name: "已转账",
      type: "info",
    },
    {
      key: 3,
      name: "完成",
      type: "success",
    },
    {
      key: 4,
      name: "取消",
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
