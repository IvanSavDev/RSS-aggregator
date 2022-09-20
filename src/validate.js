import * as yup from 'yup';

const validate = async (data, listRSS) => {
  try {
    const schema = yup.object({
      url: yup.string().required().url('uncorrectURL')
        .notOneOf(listRSS, 'existRSS'),
    });

    await schema.validate(data, { abortEarly: false });
    return [];
  } catch (error) {
    return [error.message];
  }
};

export default validate;
