import { uniqueId, isEmpty } from 'lodash';
import parser from './parser';
import loader from './loader';
import validate from './validate';

const addContent = async (state, watchedState, i18n) => {
  try {
    const { url } = state.data;
    const resultValidate = await validate(state.data, state.listRSS);
    if (!isEmpty(resultValidate)) throw new Error(`${resultValidate}`);
    const responce = await loader(url);
    state.listRSS.push(url);
    watchedState.processState = 'sent';
    const { feed, posts } = parser(responce, uniqueId());
    const updatePosts = [...posts, ...state.posts];
    const updateFeeds = [feed, ...state.feeds];
    watchedState.feeds = updateFeeds;
    watchedState.posts = updatePosts;
  } catch (error) {
    watchedState.processState = 'error';
    watchedState.processError = i18n.t(error.message);
  }
};

export default addContent;
