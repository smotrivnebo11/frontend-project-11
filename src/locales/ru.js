export default {
  translation: {
    button: 'Просмотр',
    feedback: {
      success: 'RSS успешно загружен',
      errors: {
        defaultError: 'Неверные данные',
        network: 'Ошибка сети', // ошибка сервера - axios
        doubleRss: 'RSS уже существует',
        invalidUrl: 'Ссылка должна быть валидным URL',
        invalidRss: 'Ресурс не содержит валидный RSS', // ошибка парсинга
        emptyField: 'Не должно быть пустым',
      },
    },
    posts: 'Посты',
    feeds: 'Фиды',
  },
};
