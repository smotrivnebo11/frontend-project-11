// инициалищация приложения === импорты и библиотека i18next

import i18n from 'i18next';
import { setLocale } from 'yup';
import application from './app.js';
import resources from '../locales/index.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18n.createInstance();

  setLocale({
    mixed: {
      notOneOf: 'doubleRss',
    },
    string: {
      url: 'invalidUrl',
    },
  });

  i18nInstance.init({
    language: defaultLanguage,
    debug: true,
    resources,
  }).then(() => application(i18nInstance));
};
