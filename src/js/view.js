// перерисовка === рендер === View
const buildFeeds = (watchedState, element) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.feeds.forEach((feed) => {
    const { title, description } = feed;

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    li.append(h3, p);
    ul.append(li);
  });

  element.append(ul);
};

const buildPosts = (watchedState, element, i18nInstance) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const { title, id, link } = post;

    const a = document.createElement('a');
    a.setAttribute('href', link);
    if (watchedState.uiState.visitedPostId.has(id)) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
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

  element.append(ul);
};

const buildContainer = (type, watchedState, elements, i18nInstance) => {
  const mapping = {
    feeds: (element) => buildFeeds(watchedState, element),
    posts: (element) => buildPosts(watchedState, element, i18nInstance),
  };

  elements[type].innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nInstance.t(type);

  cardBody.append(h2);
  cardBorder.append(cardBody);
  elements[type].append(cardBorder);
  mapping[type](cardBorder);
  // полиморфизм для buildPosts и BuildFeeds
};

const handleModal = (watchedState, elements, postId) => {
  const pickedPost = watchedState.posts.find(({ id }) => id === postId);
  const { title, description, link } = pickedPost;

  elements.modal.head.textContent = title;
  elements.modal.body.textContent = description;
  elements.modal.linkButton.setAttribute('href', link);
};

const handleSusscess = (elements, i18nInstance) => {
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.input.classList.remove('is-invalid');
  elements.feedback.textContent = i18nInstance.t('feedback.success');
  elements.form.reset();
  elements.input.focus();
};

const handleError = (elements, error, i18nInstance) => {
  elements.feedback.classList.add('text-danger');
  elements.feedback.classList.remove('text-success');
  elements.feedback.textContent = i18nInstance.t(`feedback.errors.${error.replace(/ /g, '')}`);
  if (error !== 'Network Error') {
    elements.input.classList.add('is-invalid');
  }

  elements.submitButton.disabled = false;
  elements.input.disabled = false;
};

const handleProcessState = (elements, processState, watchedState, i18nInstance) => {
  switch (processState) {
    case 'sent': // success
      elements.submitButton.disabled = false;
      handleSusscess(elements, i18nInstance);
      break;

    case 'error':
      elements.submitButton.disabled = false;
      handleError(elements, watchedState.process.error, i18nInstance, watchedState);
      break;

    case 'sending':
      // кнопка не активна, тк происходит отправка на сервер
      elements.submitButton.disabled = true;
      break;

    case 'filling':
      // форма в состоянии заполнения, кнопка активна
      elements.submitButton.disabled = false;
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (elements, watchedState, i18nInstance) => (path, value) => {
  switch (path) {
    // path - ключи в watchedState
    case 'valid':
      elements.submitButton.disabled = !value;
      break;

    case 'process.processState':
      handleProcessState(elements, value, watchedState, i18nInstance);
      break;

    case 'process.error':
      handleError(elements, watchedState.process.error, i18nInstance);
      break;

    case 'uiState.modalPostId':
      handleModal(watchedState, elements, value);
      break;

    case 'uiState.visitedPostId':
      buildContainer('posts', watchedState, elements, i18nInstance);
      break;

    case 'posts':
      buildContainer('posts', watchedState, elements, i18nInstance);
      break;

    case 'feeds':
      buildContainer('feeds', watchedState, elements, i18nInstance);
      break;

    default:
      break;
  }
};
