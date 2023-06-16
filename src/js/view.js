// перерисовка === рендер === View

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'sent':
      elements.form.reset();
      elements.input.focus();
      break;

    case 'error':
      elements.submitButton.disabled = false;
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

const renderError = (elements, error, initialState) => {
  if (initialState.form.valid === false) {
    elements.feedback.classList.add('is-invalid');
  }
  elements.feedback.classList.add('text-danger');
  elements.feedback.classList.remove('text-success');
  // elements.feedback.textContent = error.message;
};

export default (initialState, elements) => (path, value, prevValue) => {
  // i18nInstance
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
      handleProcessState(elements, value);
      break;

    case 'form.valid':
      // валидность формы влияет на активность кнопки submit
      elements.submitButton.disabled = !value;
      break;

    case 'form.errors':
      // запускает функцию для обработки ошибок
      renderError(elements, value, initialState);
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