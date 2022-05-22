import './scss/style.scss';
import * as yup from 'yup';
import render from './view';

const form = document.querySelector('.rss-form');

const state = {
  valid: true,
  processState: 'filling',
  processError: null,
  data: {
    url: '',
  },
  feeds: [],
};

const watchedState = render(state, form);

const validate = (datas, feeds) => {
  const schema = yup.object({
    url: yup.string().required().url()
      .notOneOf(feeds),
  });
  return schema.validate(datas, { abortEarly: false })
    .then(() => '')
    .catch((e) => {
      if (e.message === 'url must be a valid URL') {
        return 'невалидный url';
      }
      console.log(e.message);
      return 'уже такая ссылка есть';
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = data.get('url');
  // state.processState = 'sending';
  // state.processError = null;
  watchedState.data.url = value;
  validate(state.data, state.feeds)
    .then((errors) => {
      if (errors === '') {
        watchedState.feeds.push(value);
      } else {
        watchedState.processError = `${errors}`;
      }
    }).catch((er) => {
      watchedState.processState = 'error';
      watchedState.processError = `${er}`;
    });
});
