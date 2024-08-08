import { i18n } from '../main'; // 请确保路径正确

export const getI18nText = (key) => {
  return i18n.global.t(key);
};
