import { isEmpty, uniqueId } from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru';
import validate from './validate';
import updateRss from './updateRss';
import render from './view';
import loader from './loader';
// import testRss from './testRss';
import parser from './parser';

const addPostsAndFeeds = (inputData, state, watchedState) => {
  const currentWatchedState = watchedState;
  const { feed, posts } = parser(inputData, uniqueId());
  const updatePosts = [...posts, ...state.posts];
  const updateFeeds = [feed, ...state.feeds];
  currentWatchedState.feeds = updateFeeds;
  currentWatchedState.posts = updatePosts;
};

const updatePostsViaInterval = (func, param) => {
  func(param);
  setTimeout(() => {
    setTimeout(updatePostsViaInterval(func, param), 5000);
  }, 5000);
};

const validateInputData = (state, watchedState, textLib) => {
  const currentWatchedState = watchedState;
  const inputUrl = state.data.url;
  validate(state.data, state.existUrls, textLib)
    .then((errors) => {
      if (isEmpty(errors)) {
        state.existUrls.push(inputUrl);
      } else {
        throw new Error(`${errors}`);
      }
    })
    .then(() => loader(inputUrl))
    .then((data) => {
      currentWatchedState.processState = 'sent';
      addPostsAndFeeds(data, state, watchedState);
    })
    .catch((error) => {
      currentWatchedState.processState = 'error';
      currentWatchedState.processError = `${error.message}`;
    });
};

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
    existUrls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = render(state, elements, textLib);

  updatePostsViaInterval(updateRss, watchedState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.processState = 'sending';
    watchedState.processError = null;
    const dataFromForm = new FormData(e.target);
    const value = dataFromForm.get('url');
    state.data.url = value;

    validateInputData(state, watchedState, textLib);
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then((result) => {
    app(result);
  });
};
