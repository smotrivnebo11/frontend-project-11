// инициалищация приложения === импорты и библиотека i18next

import i18n from 'i18next';
import resources from './locales/index.js';

export default async (container, initialState = {}) => {
  // BEGIN (write your solution here)
  const defaultLanguage = 'ru';

  const state = {
    lng: defaultLanguage,
    clicksCount: 0,
    ...initialState,
  };

  const i18nInstance = i18n.createInstance();

  await i18nInstance.init({
    lng: state.lng,
    debug: false,
    resources,
  });

};
