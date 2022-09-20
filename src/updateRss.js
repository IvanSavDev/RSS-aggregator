import _ from 'lodash';
import loader from './loader';
import parser from './parser';

const getNewPosts = (parsedData, feeds, posts) => parsedData.map((content) => {
  const { title } = content.feed;
  const { id } = feeds.find((feed) => feed.title === title);
  const oldPosts = posts.filter((post) => post.feedId === id);
  const samePosts = _.intersectionBy(oldPosts, content.posts, 'title');
  const newPosts = _.differenceBy(content.posts, samePosts, 'title');
  newPosts.forEach((newPost) => { newPost.feedId = id; });

  return newPosts;
});

const updateRSS = async (state, watchedState) => {
  const { listRSS, feeds, posts } = state;

  if (listRSS.length) {
    const requests = listRSS.map((RSS) => loader(RSS));

    const responce = await Promise.allSettled(requests);
    const parsedResult = responce
      .filter((data) => data.status === 'fulfilled')
      .map((data) => parser(data.value, _.uniqueId()));
    const newPosts = getNewPosts(parsedResult, feeds, posts);
    watchedState.posts.unshift(...newPosts.flat());
  }
};

export default updateRSS;
