import onChange from 'on-change';

const renderUrl = (data, form) => {
  const textError = document.querySelector('.feedback');
  const input = form.querySelector('.form-control');
  textError.textContent = '';
  input.classList.remove('is-invalid');
  form.reset();
  input.focus();
};

const renderErrors = (nameError, form) => {
  const input = form.querySelector('.form-control');
  const textError = document.querySelector('.feedback');

  textError.textContent = nameError;
  input.classList.add('is-invalid');
};

export default (state, form) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        renderUrl(value, form);
        break;
      case 'processError':
        renderErrors(value, form);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
