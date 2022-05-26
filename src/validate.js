import * as yup from 'yup';

export default (datas, feeds, textLib) => {
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
    .then(() => [])
    .catch((e) => textLib(e.message));
};
