import './scss/style.scss';
import { isEmpty, uniqueId } from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru';
import validate from './validate';
import render from './view';
import loader from './loader';
// import testRss from './testRss';
import parser from './parser';

const app = (textLib) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    btn: document.querySelector('[aria-label="add"]'),
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
    existUrl: [],
    feeds: [],
    posts: [],
  };

  const watchedState = render(state, elements, textLib);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.processState = 'sending';
    watchedState.processError = null;
    const dataFromForm = new FormData(e.target);
    const value = dataFromForm.get('url');
    state.data.url = value;

    validate(state.data, state.existUrl, textLib)
      .then((errors) => {
        if (isEmpty(errors)) {
          state.existUrl.push(value);
        } else {
          throw new Error(`${errors}`);
        }
      })
      .then(() => loader(state.data.url))
      .then((data) => {
        watchedState.processState = 'sent';
        const { feed, posts } = parser(data, uniqueId());
        const updatePosts = [...posts, ...state.posts];
        const updateFeeds = [feed, ...state.feeds];
        watchedState.feeds = updateFeeds;
        watchedState.posts = updatePosts;
      })
      .catch((error) => {
        watchedState.processState = 'error';
        watchedState.processError = `${error.message}`;
      });
  });
};

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then((result) => {
    app(result);
  });
};

runApp();
