// перерисовка === рендер === View

const buildContainer = (type, i18nInstance) => {
  // elements[type].textContent = '';
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nInstance.t(type);
  cardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorder.replaceChildren(cardBody, ul);
  return { cardBorder, ul };

  // cardBorder.append(cardBody);
  // elements[type].append(cardBorder);

  // if (type === 'posts') {
  //   renderPosts(state, divCard, i18nInstance);
  // }

  // if (type === 'feeds') {
  //   renderFeeds(state, divCard);
  // }
};

const buildFeeds = (watchedState, elements, i18nInstance) => {
  elements.feeds.innerHTML = '';
  const { cardBorder, ul } = buildContainer('feeds', i18nInstance);
  // const ul = document.createElement('ul');
  // ul.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');

    const { title, description } = feed;

    h3.textContent = title;
    p.textContent = description;

    li.append(h3, p);
    ul.append(li);
  });

  elements.feeds.append(cardBorder);
};

const buildPosts = (watchedState, elements, i18nInstance) => {
  console.log('buildposts', watchedState.posts);
  elements.posts.innerHTML = '';
  const { cardBorder, ul } = buildContainer('posts', i18nInstance);
  // const ul = document.createElement('ul');
  // ul.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const { title, id, link } = post;
    console.log(title, id, link);
    console.log('post', post);
    console.log('id', post.id);
    console.log('title', post.title);
    console.log('link', post.link);

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.classList.add('fw-bold');
    a.setAttribute('data-id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nInstance.t('button');

    li.append(a, button);
    ul.append(li);
  });

  elements.posts.append(cardBorder);
};

const handleSusscess = (elements, i18nInstance) => {
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.input.classList.remove('is-invalid');
  elements.feedback.textContent = i18nInstance.t('feedback.success');
  elements.form.reset();
  elements.input.focus();
};

const handleError = (elements, error, i18nInstance, watchedState) => {
  if (watchedState.form.valid === false) {
    elements.input.classList.add('is-invalid');
  }
  elements.feedback.classList.add('text-danger');
  elements.feedback.classList.remove('text-success');
  elements.feedback.textContent = i18nInstance.t(`feedback.errors.${error}`);
};

const handleProcessState = (elements, processState, watchedState, i18nInstance) => {
  switch (processState) {
    case 'sent':
      elements.submitButton.disabled = false;
      handleSusscess(elements, i18nInstance);
      break;

    case 'error':
      elements.submitButton.disabled = false;
      handleError(elements, watchedState.form.error, i18nInstance, watchedState);
      break;

    case 'sending':
      // кнопка не активна, тк происходит отправка на сервер
      elements.submitButton.disabled = true;
      break;

    case 'filling':
      // форма в состоянии заполнения и заполнена без ошибок = тогда кнопка активна
      elements.submitButton.disabled = false;
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (elements, watchedState, i18nInstance) => (path, value) => {
  // const renderPosts = () => {
  //     container.innerHTML = '';
  //     const buttons = state.posts.map();

  //     container.append(...buttons);
  // }
  switch (path) {
    // path - ключи в state
    // в зависимости от значения ключа в state мы делаем манипуляции
    case 'form.processState':
      // запускает функцию handleProcessState для переключения состояния processState
      handleProcessState(elements, value, watchedState, i18nInstance);
      break;

    case 'form.valid':
      // валидность формы влияет на активность кнопки submit
      elements.submitButton.disabled = !value;
      break;

    case 'form.error':
      // запускает функцию для обработки ошибок
      handleError(elements, watchedState.form.error, i18nInstance, watchedState);
      break;

    case 'posts':
      buildPosts(watchedState, elements, i18nInstance);
      break;

    case 'feeds':
      buildFeeds(watchedState, elements, i18nInstance);
      break;

    default:
      break;
  }
};

// const renderForm = () => {
//   return i18nInstance.t('required');
// };

// switch (state.mode) {
//   case 'posts': {
//       renderPosts();
//       break;
//   }
//   case 'form': {
//       renderForm();
//       break;
//   }
//   default:
//   // ссылка
//   throw new Error(Unknow node: ${state.mode});
// }

// const wachedState = onChange(initialState, (path, value, previousValue) => {
//   render(wachedState, elements, i18nInstance);
// });

// return wachedState;
