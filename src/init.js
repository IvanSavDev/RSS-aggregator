import i18next from 'i18next';
import onChange from 'on-change';
import ru from './locales/ru';
import updateRSS from './updateRss';
import {
  renderErrors, renderFeed, renderPosts, handleProcessState,
} from './view';
import addContent from './addContent';

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
    processState: 'filling',
    processError: null,
    listRSS: [],
    feeds: [],
    posts: [],
    ui: {
      activeLinks: [],
    },
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'processError':
        renderErrors(value, elements);
        break;

      case 'processState':
        handleProcessState(value, elements, i18n);
        break;

      case 'posts':
        renderPosts(state, value, elements, i18n);
        break;

      case 'feeds':
        renderFeed(value, elements, i18n);
        break;

      default:
        break;
    }
  });

  setTimeout(function updatePosts() {
    updateRSS(state, watchedState);
    setTimeout(updatePosts, 5000);
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.processState = 'sending';
    watchedState.processError = null;
    const formData = new FormData(event.target);
    const url = formData.get('url');
    addContent(state, watchedState, url, i18n);
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
