export default {
  getHeadlines: function() {
    return fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=3ec940fd3870472ab3728801d7cb1fde`
    )
      .then(res => res.json())
      .then(data => data.articles)
      .catch(error => console.log(error));
  },

  search: function(searchTerm, searchLimit, sortByIndex) {
    const sortByOptions = ["relevancy", "popularity", "publishedAt"];
    // adding 'return' below allows us to make this function return a promise
    return fetch(
      `https://newsapi.org/v2/everything?language=en&q=${searchTerm}&pageSize=100&sortBy=${
        sortByOptions[sortByIndex]
      }&apiKey=3ec940fd3870472ab3728801d7cb1fde`
    )
      .then(res => res.json())
      .then(data => data.articles)
      .catch(error => console.log(error));
  },

  formatData: function(data) {
    let processedArray = [],
      sources = [];
    data.forEach(post => {
      processedArray.push({
        imageUrl: post.urlToImage
          ? post.urlToImage
          : "https://yt3.ggpht.com/7xqC5TXeVwzt4_Yergj3yEBX1z0JyO152DgWyUoKycm66TeJbXhXe2oMK_wDuVyvByuzWhqFs9-T07b_f5k=s900-mo-c-c0xffffffff-rj-k-no",
        title: post.title,
        description: post.description,
        iconClass: "fas fa-newspaper",
        date: new Date(post.publishedAt),
        url: post.url,
        source: post.source
      });
      if (post.source.id) sources[post.source.id] = post.source.name;
    });
    console.log(sources);
    return {
      news: processedArray,
      sources: sources
    };
  }
};
