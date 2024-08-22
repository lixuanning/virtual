export const assignSelectedData = (addFormTemplate, selectedRowData) => {
  const result = {};
  Object.keys(addFormTemplate).forEach((key) => {
    if (key in selectedRowData) {
      result[key] = selectedRowData[key];
    } else {
      result[key] = addFormTemplate[key]; // 如果选中数据没有该字段，用模板的默认值
    }
  });
  return result;
};

export const clearFormFields = (formObject) => {
  Object.keys(formObject).forEach((key) => {
    if (typeof formObject[key] === "string") {
      formObject[key] = ""; // 如果是字符串，重置为空字符串
    } else if (typeof formObject[key] === "number") {
      formObject[key] = ""; // 如果是数字，重置为 0
    } else if (typeof formObject[key] === "boolean") {
      formObject[key] = false; // 如果是布尔值，重置为 false
    } else if (Array.isArray(formObject[key])) {
      formObject[key] = []; // 如果是数组，重置为空数组
    } else if (
      typeof formObject[key] === "object" &&
      formObject[key] !== null
    ) {
      formObject[key] = {}; // 如果是对象，重置为空对象
    } else {
      formObject[key] = null; // 其他类型，重置为 null
    }
  });
};
