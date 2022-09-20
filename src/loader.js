import axios from 'axios';

export default async (url) => {
  try {
    const { data } = await axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
    return data.contents;
  } catch {
    throw new Error('loadError');
  }
};
