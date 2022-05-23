import { uniqueId } from 'lodash';

export default (data, feedId) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');
    const feedTitle = doc.querySelector('channel title');
    const feedTitleContent = feedTitle.textContent;
    const descriptionFeed = doc.querySelector('channel description');
    const descriptionFeedContent = descriptionFeed.textContent;
    const feed = { title: feedTitleContent, description: descriptionFeedContent, id: feedId };

    const postsEls = doc.querySelectorAll('item');
    const posts = Array.from(postsEls).map((post) => {
      const titlePost = post.querySelector('title');
      const titlePostContent = titlePost.textContent;
      const linkPost = post.querySelector('link');
      const linkPostContent = linkPost.textContent;
      const descriptionPost = post.querySelector('description');
      const descriptionPostContent = descriptionPost.textContent;

      return {
        id: uniqueId(),
        title: titlePostContent,
        link: linkPostContent,
        description: descriptionPostContent,
        feedId,
      };
    });

    return { feed, posts };
  } catch (e) {
    throw new Error('errorParse');
  }
};
