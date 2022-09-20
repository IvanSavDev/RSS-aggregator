import { uniqueId } from 'lodash';

export default (data, feedId) => {
  try {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(data, 'application/xml');

    const feedTitleElement = parsedDocument.querySelector('channel title');
    const feedTitle = feedTitleElement.textContent;
    const feedDescriptionElement = parsedDocument.querySelector('channel description');
    const feedDescription = feedDescriptionElement.textContent;
    const feed = { title: feedTitle, description: feedDescription, id: feedId };

    const postsElements = parsedDocument.querySelectorAll('item');
    const posts = Array.from(postsElements).map((post) => {
      const titleElement = post.querySelector('title');
      const title = titleElement.textContent;
      const linkElement = post.querySelector('link');
      const link = linkElement.textContent;
      const descriptionElement = post.querySelector('description');
      const description = descriptionElement.textContent;

      return {
        id: uniqueId(),
        title,
        link,
        description,
        feedId,
      };
    });

    return { feed, posts };
  } catch {
    throw new Error('parseError');
  }
};
