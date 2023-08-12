export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorNode = doc.querySelector('parsererror');

  if (errorNode) {
    const error = new Error(errorNode.textContent);
    error.isParsingError = true;
    error.data = data;
    throw new Error('invalidRss');
  }

  const channel = doc.querySelector('channel');
  const titleF = channel.querySelector('title').textContent;
  const linkF = channel.querySelector('link').textContent;
  const descriptionF = channel.querySelector('description').textContent;
  const feed = { title: titleF, description: descriptionF, link: linkF };

  const items = Array.from(channel.querySelectorAll('item'));

  const posts = items.map((item) => {
    const titleP = item.querySelector('title').textContent;
    const linkP = item.querySelector('link').textContent;
    const descriptionP = item.querySelector('description').textContent;

    const post = { title: titleP, description: descriptionP, link: linkP };
    return post;
  });

  return { feed, posts };
};
