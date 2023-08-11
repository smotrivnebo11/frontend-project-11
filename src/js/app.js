// дефолтная функция и контроллеры, initial state === Modal & Controllers

import onChange from 'on-change';
import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import render from './view.js';
import parse from '../utils/parser.js';

const timeOut = 5000;

// проверяемый урл и список урлов которые уже были загружены
const validateURL = (url, existedUrls) => {
  // схема валидации: строка, урл, не один из списка уже загруженных
  const schema = yup.string().url().notOneOf(existedUrls);
  return schema.validate(url); // асинхронный метод
  // returns a Promise object, that is fulfilled with the VALUE, or rejected with a ValidationError.
};

const getOriginsProxy = (url) => { // прокси прослойка между пользователем и сервером
  const originsProxy = 'https://allorigins.hexlet.app/get';
  const rssUrl = new URL(originsProxy);
  rssUrl.searchParams.set('url', url);
  rssUrl.searchParams.set('disableCache', 'true');
  return axios.get(rssUrl);
};

const makePosts = (watchedState, posts, feedId) => {
  const extractedPosts = posts.map((post) => ({ ...post, feedId, id: _.uniqueId() }));
  watchedState.posts.push(...watchedState.posts, ...extractedPosts);
};

const updateRss = (watchedState) => {
  const feedPromises = watchedState.feeds
    .map(({ feedId, link }) => getOriginsProxy(link)
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const uploadedPosts = watchedState.posts.map((post) => post.link);
        const newPosts = posts.filter((post) => !uploadedPosts.includes(post.link));
        if (newPosts.length > 0) {
          makePosts(watchedState, newPosts, feedId);
        }
        return Promise.resolve();
      }));

  Promise.allSettled(feedPromises)
    .finally(() => {
      setTimeout(() => updateRss(watchedState), timeOut);
    });
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
      modalElement: document.querySelector('.modal'),
      head: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      linkButton: document.querySelector('.modal-footer > .full-article'),
    },
  };

  const initialState = { // Modal
    valid: true, // false
    process: {
      processState: 'filling', // sending, sent, error
      error: '', // ошибка выдается уже после submit
    },
    uiState: {
      modalPostId: '',
      visitedPostId: new Set(), // объект для хранения уникальных значений
    },
    posts: [],
    feeds: [],
    existedUrls: [], // те урлы которые уже вводили
  };

  const watchedState = onChange(initialState, render(elements, initialState, i18nInstance));
  updateRss(watchedState);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputURL = formData.get('url').trim(); // то, что ввел пользователь

    // сравниваем наш урл с теми урлами которые уже есть чтобы избежать дублирования
    validateURL(inputURL, watchedState.existedUrls)
      .then(() => {
        watchedState.valid = true;
        watchedState.process.processState = 'sending';
        return getOriginsProxy(inputURL);
      })
      .then((response) => {
        const content = response.data.contents;
        watchedState.existedUrls.push(inputURL);
        const { feed, posts } = parse(content);
        const feedId = _.uniqueId();
        watchedState.feeds.push({ ...feed, id: feedId, link: inputURL });
        makePosts(watchedState, posts, feedId);
        watchedState.process.processState = 'sent'; // success
        // присвоить id фидам и добавить фиды и посты в соответствующие массивы в watched state
        // у поста будет id фида и его id, а у фида только id самого фида
      })
      .catch((error) => {
        watchedState.valid = false;
        watchedState.process.error = error.message ?? 'defaultError';
        watchedState.process.processState = 'error';
      });
  });

  elements.modal.modalElement.addEventListener('show.bs.modal', (event) => {
    // связь модального окна с посещенным постом
    const postId = event.relatedTarget.getAttribute('data-id');
    watchedState.uiState.visitedPostId.add(postId);
    watchedState.uiState.modalPostId = postId;
  });

  elements.posts.addEventListener('click', (event) => {
    const postId = event.target.dataset.id;
    if (postId) {
      watchedState.uiState.visitedPostId.add(postId);
    }
  });
};
