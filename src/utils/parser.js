export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml'); // returns a document HTML/XML
  const error = doc.querySelector('parsererror');

  if (error) throw new Error('invalidRss');

  const channel = doc.querySelector('channel'); // внутри него лежит весь документ rss
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

  console.log(channel.innerHTML);
  return { feed, posts };
};
