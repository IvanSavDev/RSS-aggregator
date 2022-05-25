import _ from 'lodash';
import onChange from 'on-change';
import loader from './loader';
import parser from './parser';

const searchNewPosts = (parseDatas, originalState) => parseDatas.map((parseData) => {
  const titleFeed = parseData.feed.title;
  let idFeedOrigin;
  originalState.feeds.forEach((feed) => {
    if (feed.title === titleFeed) {
      idFeedOrigin = feed.id;
    }
  });
  const postsWithCurrentFeed = originalState.posts.filter((post) => post.feedId === idFeedOrigin);
  const samePosts = _.intersectionBy(postsWithCurrentFeed, parseData.posts, 'title');
  const newPosts = _.differenceBy(parseData.posts, samePosts, 'title');

  newPosts.forEach((newPost) => {
    const copyNewPost = newPost;
    copyNewPost.feedId = idFeedOrigin;
    return copyNewPost;
  });

  return newPosts;
});

export default (watchedState) => {
  const requests = [];

  const originalState = onChange.target(watchedState);
  const urls = originalState.existUrls;

  if (urls.length === 0) {
    return;
  }

  urls.forEach((url) => {
    requests.push(loader(url));
  });

  Promise.allSettled(requests)
    .then((results) => results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value))
    .then((datas) => datas.map((data) => parser(data, _.uniqueId())))
    .then((parseDatas) => searchNewPosts(parseDatas, originalState))
    .then((newPosts) => watchedState.posts.unshift(...newPosts.flat()))
    .catch((e) => {
      console.log(e);
    });
};
