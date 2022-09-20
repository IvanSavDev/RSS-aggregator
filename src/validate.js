import * as yup from 'yup';

const validate = async (data, feeds) => {
  try {
    yup.setLocale({
      mixed: {
        notOneOf: () => 'existRSS',
      },
      string: {
        url: () => 'uncorrectURL',
      },
    });

    const schema = yup.object({
      url: yup.string().required().url()
        .notOneOf(feeds),
    });

    await schema.validate(data, { abortEarly: false });
    return [];
  } catch (error) {
    return [error.message];
  }
};

export default validate;
