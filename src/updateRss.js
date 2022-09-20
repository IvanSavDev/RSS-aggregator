import _ from 'lodash';
import onChange from 'on-change';
import loader from './loader';
import parser from './parser';

const getNewPosts = (parsedData, { feeds, posts }) => parsedData.map((data) => {
  const { title } = data.feed;
  const { id } = feeds.find((feed) => feed.title === title);
  const postsWithCurrentFeed = posts.filter((post) => post.feedId === id);
  const samePosts = _.intersectionBy(postsWithCurrentFeed, data.posts, 'title');
  const newPosts = _.differenceBy(data.posts, samePosts, 'title');
  newPosts.forEach((newPost) => { newPost.feedId = id; });

  return newPosts;
});

const updateRSS = async (watchedState) => {
  const state = onChange.target(watchedState);
  const urls = state.existUrls;

  if (urls.length === 0 || state.processState === 'error') {
    return;
  }

  const requests = urls.map((url) => loader(url));

  const result = await Promise.allSettled(requests);
  const parsedResult = result
    .filter((data) => data.status === 'fulfilled')
    .map((data) => parser(data.value, _.uniqueId()));
  const newPosts = getNewPosts(parsedResult, state);
  watchedState.posts.unshift(...newPosts.flat());
};

export default updateRSS;
