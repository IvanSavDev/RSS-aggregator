import _ from 'lodash';

const generateContentContainer = (nameGroup) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const body = document.createElement('div');
  body.classList.add('card-body');
  const titleBody = document.createElement('h2');
  titleBody.classList.add('card-title', 'h4');
  titleBody.textContent = `${nameGroup}`;
  body.append(titleBody);
  container.append(body);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(list);
  return container;
};

const generateLink = (state, post) => {
  const link = document.createElement('a');
  const listActiveLinks = state.ui.activeLinks;

  link.setAttribute('class', 'fw-bold');
  link.setAttribute('href', post.link);
  link.setAttribute('data-id', post.id);
  link.setAttribute('target', '_blank');
  link.textContent = post.title;

  if (listActiveLinks.includes(post.link)) {
    link.setAttribute('class', 'fw-normal link-secondary');
  }

  return link;
};

const generateWatchButton = (post, i18n) => {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.setAttribute('type', 'button');
  button.textContent = i18n.t('watchButton');
  return button;
};

const generateFeeds = (feeds) => feeds.map((feed) => {
  const feedElement = document.createElement('li');
  feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;
  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;
  feedElement.append(title);
  feedElement.append(description);
  return feedElement;
});

const generatePosts = (state, posts, i18n) => posts.map((post) => {
  const postElement = document.createElement('li');
  postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const link = generateLink(state, post);
  const watchButton = generateWatchButton(post, i18n);
  postElement.append(link);
  postElement.append(watchButton);
  return postElement;
});

export const renderPosts = (state, newPosts, elements, i18n) => {
  const { posts } = elements;
  const listPosts = generatePosts(state, newPosts, i18n);

  let containerListPosts = posts.querySelector('ul');
  if (!posts.children.length) {
    const containerPosts = generateContentContainer(i18n.t('posts'));
    posts.append(containerPosts);
    containerListPosts = posts.querySelector('ul');
  }
  containerListPosts.replaceChildren(...listPosts);

  containerListPosts.addEventListener('click', ({ target }) => {
    let activeLink = null;
    if (target.tagName === 'A') {
      activeLink = target;
    }
    if (target.tagName === 'BUTTON') {
      activeLink = target.previousElementSibling;
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      const linkPost = document.querySelector('.link-article');
      const postId = target.getAttribute('data-id');
      const postData = _.find(state.posts, { id: postId });
      modalTitle.textContent = postData.title;
      modalBody.textContent = postData.description;
      linkPost.setAttribute('href', postData.link);
    }
    if (activeLink) {
      activeLink.setAttribute('class', 'fw-normal link-secondary');
      const currentLink = activeLink.getAttribute('href');
      state.ui.activeLinks.push(currentLink);
    }
  });
};

export const renderFeed = (newFeeds, elements, i18n) => {
  const { feeds } = elements;
  const listNewFeeds = generateFeeds(newFeeds);

  if (!feeds.children.length) {
    const containerFeeds = generateContentContainer(i18n.t('feeds'));
    feeds.append(containerFeeds);
  }

  const containerListFeeds = feeds.querySelector('ul');
  containerListFeeds.replaceChildren(...listNewFeeds);
};

export const renderErrors = (errorName, elements) => {
  const { inputRSS, feedback } = elements;

  feedback.textContent = errorName;
  feedback.classList.add('text-danger');
  inputRSS.classList.add('is-invalid');
};

const resetForm = (elements, i18n) => {
  const { inputRSS, feedback, form } = elements;

  feedback.textContent = i18n.t('succesfulUpload');
  if (feedback.classList.contains('text-danger')) {
    feedback.classList.remove('text-danger');
  }
  feedback.classList.add('text-success');
  inputRSS.classList.remove('is-invalid');
  form.reset();
  inputRSS.focus();
};

export const handleProcessState = (processState, elements, i18n) => {
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
      resetForm(elements, i18n);
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};
