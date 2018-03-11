import common from "../common";

export default {
  search: function(searchTerm, searchLimit, sortByIndex) {
    const sortByOptions = ["relevance", "top", "new"];
    // adding 'return' below allows us to make this function return a promise
    return fetch(
      `http://www.reddit.com/search.json?q=${searchTerm}&sort=${
        sortByOptions[sortByIndex]
      }&limit=${searchLimit}`
    )
      .then(res => res.json())
      .then(data => data.data.children.map(data => data.data))
      .catch(error => console.log(error));
  },

  formatData: function(data) {
    let processedArray = [];
    data.forEach(post => {
      const imageUrl = post.preview
        ? post.preview.images[0].source.url
        : "https://is3-ssl.mzstatic.com/image/thumb/Purple118/v4/e1/b7/35/e1b73581-862b-027a-e5d0-e2f95d2ee9d8/AppIcon-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg";

      processedArray.push({
        imageUrl: imageUrl,
        title: post.title,
        description: common.shortenText(post.selftext, 100),
        iconClass: "fab fa-reddit-alien",
        date: new Date(post.created),
        url: post.url
      });

      console.log(post);
      console.log(new Date(post.created));
    });
    return processedArray;
  }
};
