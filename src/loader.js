import axios from 'axios';

export default async (url) => {
  try {
    const response = await axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
    return response.data.contents;
  } catch {
    throw new Error('loadError');
  }
};
