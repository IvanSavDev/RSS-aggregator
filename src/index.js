import './scss/style.scss';
import * as yup from 'yup';
import i18next from 'i18next';
import ru from './locales/ru';
import render from './view';

const app = (textLib) => {
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
    yup.setLocale({
      mixed: {
        notOneOf: () => 'existUrl',
      },
      string: {
        url: () => 'uncorrectUrl',
      },
    });

    const schema = yup.object({
      url: yup.string().required().url()
        .notOneOf(feeds),
    });
    return schema.validate(datas, { abortEarly: false })
      .then(() => '')
      .catch((e) => {
        // if (e.message === 'url must be a valid URL') {
        //   return 'невалидный url';
        // }
        //   console.log(e.message);
        //   return 'уже такая ссылка есть';
        console.log(e.message);
        return textLib(e.message);
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
