import onChange from 'on-change';
import _ from 'lodash';

const resetForm = (i18n, elements) => {
  const { inputRSS, feedback: textError, form } = elements;

  textError.textContent = i18n.t('succesfulUpload');
  if (textError.classList.contains('text-danger')) {
    textError.classList.remove('text-danger');
  }
  textError.classList.add('text-success');
  inputRSS.classList.remove('is-invalid');
  form.reset();
  inputRSS.focus();
};

const renderErrors = (nameError, elements) => {
  const { inputRSS, feedback: textError } = elements;

  textError.textContent = nameError;
  textError.classList.add('text-danger');
  inputRSS.classList.add('is-invalid');
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
  const containerList = document.createElement('ul');
  containerList.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(containerList);
  return container;
};

const generateLink = (state, post) => {
  const link = document.createElement('a');
  const listActiveLink = state.ui.activeLink;

  link.setAttribute('class', 'fw-bold');
  link.setAttribute('href', post.link);
  link.setAttribute('data-id', post.id);
  link.setAttribute('target', '_blank');
  link.textContent = post.title;

  if (listActiveLink.includes(post.link)) {
    link.setAttribute('class', 'fw-normal link-secondary');
  }

  return link;
};

const generatebutton = (post, i18n) => {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.setAttribute('type', 'button');
  button.textContent = i18n.t('watchButton');
  return button;
};

const generateFeeds = (feeds) => {
  const listFeeds = [];
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
    listFeeds.push(item);
  });
  return listFeeds;
};

/*
const generatePosts = (state, posts, i18n) => {
  const containerPosts = [];
  posts.forEach((post) => {
    const item = document.createElement('li');
item.classList.add('list-group-item',
'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = generateLink(state, post);
    const button = generatebutton(post, i18n);
    item.append(link);
    item.append(button);
    containerPosts.push(item);
  });
  return posts.map((post) => {
    const item = document.createElement('li');
item.classList.add('list-group-item',
'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = generateLink(state, post);
    const button = generatebutton(post, i18n);
    item.append(link);
    item.append(button);
    containerPosts.push(item);
  })
  return containerPosts;
}; */

const generatePosts = (state, posts, i18n) => posts.map((post) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const link = generateLink(state, post);
  const button = generatebutton(post, i18n);
  item.append(link);
  item.append(button);
  return item;
});

const renderPosts = (state, posts, elements, i18n) => {
  const listPosts = generatePosts(state, posts, i18n);

  let containerListPosts = elements.posts.querySelector('ul');
  if (elements.posts.children.length === 0) {
    const containerPosts = generateContainerForPostsAndFeeds('Посты');
    elements.posts.append(containerPosts);
    containerListPosts = elements.posts.querySelector('ul');
  }

  containerListPosts.addEventListener('click', (event) => {
    const currentElement = event.target;
    let activeLink;
    if (currentElement.tagName === 'A') {
      activeLink = currentElement;
    }
    if (currentElement.tagName === 'BUTTON') {
      activeLink = currentElement.previousElementSibling;
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      const buttonShowArticle = document.querySelector('.link-article');
      const idbutton = currentElement.getAttribute('data-id');
      const objWithData = _.find(state.posts, { id: idbutton });

      modalTitle.innerHTML = objWithData.title;
      modalBody.innerHTML = objWithData.description;
      buttonShowArticle.setAttribute('href', objWithData.link);
    }
    if (activeLink) {
      activeLink.setAttribute('class', 'fw-normal link-secondary');
      const currentLink = activeLink.getAttribute('href');
      state.ui.activeLink.push(currentLink);
    }
  });

  containerListPosts.replaceChildren(...listPosts);
};

const renderFeed = (feeds, elements) => {
  const listFeeds = generateFeeds(feeds);

  if (elements.feeds.children.length === 0) {
    const containerFeeds = generateContainerForPostsAndFeeds('Фиды');
    elements.feeds.append(containerFeeds);
  }

  const containerListFeeds = elements.feeds.querySelector('ul');
  containerListFeeds.replaceChildren(...listFeeds);
};

const handleProcessState = (i18n, processState, elements) => {
  const { addRSS, feedback } = elements;

  switch (processState) {
    case 'filling':
      if (addRSS.classList.contains('disabled')) {
        addRSS.classList.remove('disabled');
      }
      break;

    case 'sending':
      addRSS.classList.add('disabled');
      feedback.textContent = '';
      break;

    case 'error':
      if (addRSS.classList.contains('disabled')) {
        addRSS.classList.remove('disabled');
      }
      break;

    case 'sent':
      if (addRSS.classList.contains('disabled')) {
        addRSS.classList.remove('disabled');
      }
      resetForm(i18n, elements);
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (state, elements, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'processError':
        renderErrors(value, elements);
        break;

      case 'processState':
        handleProcessState(i18n, value, elements);
        break;

      case 'posts':
        renderPosts(state, value, elements, i18n);
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
