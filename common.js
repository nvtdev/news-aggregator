export default {
  shortenText: function(text, limit) {
    const shortened = text.indexOf(" ", limit);
    if (shortened == -1) return text;
    return text.substring(0, shortened);
  },

  shuffleArray: function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};
