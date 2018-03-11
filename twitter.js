export default {
  search: function(searchTerm) {
    // adding 'return' below allows us to make this function return a promise
    return (
      fetch(`https://api.twitter.com/1.1/search/tweets.json?q=${searchTerm}`)
        .then(res => res.json())
        //   .then(data => data.data.children.map(data => data.data))
        .catch(error => console.log(error))
    );
  }
};
