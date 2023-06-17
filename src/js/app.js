// дефолтная функция и контроллеры, initial state === Modal & Controllers

import onChange from 'on-change';
// import { container } from 'webpack';
import * as yup from 'yup';
// import axios from 'axios';
import render from './view.js';
// import parse from './parser.js';

// проверяемый урл и список урлов которые уже были загружены
const validateURL = (url, existedUrls) => {
  // схема валидации: строка, урл, не один из списка уже загруженных
  const schema = yup.string().url().notOneOf(existedUrls);
  return schema.validate(url); // асинхронный метод
  // returns a Promise object, that is fulfilled with the value, or rejected with a ValidationError.
};

export default (i18nInstance) => { // основная функция
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'), // сообщение об ошибке или об успехе
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    postsButtons: document.querySelector('button[data-bs-target="#modal"]'),
    modal: {
      head: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      linkButton: document.querySelector('.modal-footer > .full-article'),
    },
  };

  const initialState = { // Modal
    form: {
      // inputRss: '',
      valid: true, // false
      processState: 'filling', // sending, sent, error
      errors: {}, // ошибка выдается уже после submit
    },
    posts: [],
    feeds: [],
    existedUrls: [], // те урлы которые уже вводили
  };

  const watchedState = onChange(initialState, render(elements, initialState, i18nInstance));

  // elements.input.addEventListener('input', (event) => {
  //   event.preventDefault();
  //   // записываем в наблюдаемое состояние введенное пользователем в инпут значение
  //   watchedState.form.inputRss = event.target.value;
  //   watchedState.form.processState = 'filling';
  // });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const urlRss = data.get('url').trim();

    // сравниваем наш урл с теми урлами которые уже есть чтобы избежать дублирования
    validateURL(urlRss, watchedState.existedUrls)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.processState = 'sending';
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.form.errors = error.message ?? 'defaultError';
        watchedState.form.processState = 'error';
      });
    // loadRss(url);
  });
};

// const wachedState = watch(initialState, elements, i18nInstance);

// const loadRss = (url, wachedState) => {};

// const updateRss = (wachedState) => {};

// elements.postsContainer.addEventListener('click', () => {
//   //меняем состояние
// });

// updateRss(wachedState);
