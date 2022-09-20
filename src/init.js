import i18next from 'i18next';
import ru from './locales/ru';
import updateRSS from './updateRss';
import view from './view';
import addPostsAndFeeds from './addContent';

const app = (i18n) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    inputRSS: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    addRSS: document.querySelector('button[aria-label="add"]'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = {
    valid: true,
    processState: 'filling',
    processError: null,
    data: {
      url: '',
    },
    existUrls: [],
    feeds: [],
    posts: [],
    ui: {
      activeLink: [],
    },
  };

  const watchedState = view(state, elements, i18n);

  setTimeout(function updatePosts() {
    updateRSS(watchedState);
    setTimeout(updatePosts, 5000);
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.processState = 'sending';
    watchedState.processError = null;
    const dataFromForm = new FormData(event.target);
    const value = dataFromForm.get('url');
    state.data.url = value;
    addPostsAndFeeds(state, watchedState, i18n);
  });
};

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });
  app(i18nextInstance);
};
