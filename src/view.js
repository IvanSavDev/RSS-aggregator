import onChange from 'on-change';

const resetForm = (textLib, elements) => {
  const { input, feedback: textError, form } = elements;

  textError.textContent = textLib('succesfullUpload');
  if (textError.classList.contains('text-danger')) {
    textError.classList.remove('text-danger');
  }
  textError.classList.add('text-success');
  input.classList.remove('is-invalid');
  form.reset();
  input.focus();
};

const renderErrors = (nameError, elements) => {
  const { input, feedback: textError } = elements;

  textError.textContent = nameError;
  textError.classList.add('text-danger');
  input.classList.add('is-invalid');
};

const handleProcessState = (textLib, processState, elements) => {
  const { btn, feedback } = elements;

  switch (processState) {
    case 'filling':
      if (btn.classList.contains('disabled')) {
        btn.classList.remove('disabled');
      }
      break;

    case 'sending':
      btn.classList.add('disabled');
      feedback.textContent = '';
      break;

    case 'error':
      if (btn.classList.contains('disabled')) {
        btn.classList.remove('disabled');
      }
      break;

    case 'sent':
      if (btn.classList.contains('disabled')) {
        btn.classList.remove('disabled');
      }
      resetForm(textLib, elements);
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const generateContainerForPostsAndFeeds = (nameGroup) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const body = document.createElement('div');
  body.classList.add('card-body');
  const titleBody = document.createElement('h2');
  titleBody.classList.add('card-title', 'h4');
  titleBody.textContent = `${nameGroup}`;
  body.append(titleBody);
  container.append(body);
  return container;
};

const generateLink = (post) => {
  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('href', post.link);
  link.setAttribute('data-id', post.id);
  link.setAttribute('target', '_blank');
  link.textContent = post.title;
  return link;
};

const generateBtn = (post) => {
  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.setAttribute('data-id', post.id);
  btn.setAttribute('data-bs-toggel', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.setAttribute('type', 'button');
  btn.textContent = 'Просмотр';
  return btn;
};

const renderPosts = (posts, elements) => {
  const containerPosts = generateContainerForPostsAndFeeds('Посты');

  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = generateLink(post);
    const btn = generateBtn(post);
    item.append(link);
    item.append(btn);
    listPosts.append(item);
  });

  listPosts.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.target.setAttribute('class', 'fw-normal link-secondary');
    }
  });

  containerPosts.append(listPosts);
  elements.posts.replaceChildren(containerPosts);
};

// const generateFeeds = (elements) => {
//   const listFeeds = [];
//   elements.forEach((element) => {
//     const item = document.createElement('li');
//     item.classList.add('list-group-item', 'border-0', 'border-end-0');
//     const titleFeed = document.createElement('h3');
//     titleFeed.classList.add('h6', 'm-0');
//     titleFeed.textContent = element.title;
//     const descriptionFeed = document.createElement('p');
//     descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
//     descriptionFeed.textContent = element.description;
//     item.append(titleFeed);
//     item.append(descriptionFeed);
//     listFeeds.push(item);
//   });
//   return listFeeds;
// };

const renderFeed = (feeds, elements) => {
  const containerFeeds = generateContainerForPostsAndFeeds('Фиды');

  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleFeed = document.createElement('h3');
    titleFeed.classList.add('h6', 'm-0');
    titleFeed.textContent = feed.title;
    const descriptionFeed = document.createElement('p');
    descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
    descriptionFeed.textContent = feed.description;
    item.append(titleFeed);
    item.append(descriptionFeed);
    listFeeds.append(item);
  });

  containerFeeds.append(listFeeds);
  elements.feeds.replaceChildren(containerFeeds);
};

export default (state, elements, textLib) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'processError':
        renderErrors(value, elements);
        break;

      case 'processState':
        handleProcessState(textLib, value, elements);
        break;

      case 'posts':
        renderPosts(value, elements);
        break;

      case 'feeds':
        renderFeed(value, elements);
        break;

      default:
        break;
    }
  });

  return watchedState;
};
