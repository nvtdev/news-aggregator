// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({16:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  shortenText: function shortenText(text, limit) {
    var shortened = text.indexOf(" ", limit);
    if (shortened == -1) return text;
    return text.substring(0, shortened);
  },

  shuffleArray: function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [arr[j], arr[i]];
      arr[i] = _ref[0];
      arr[j] = _ref[1];
    }
    return arr;
  }
};
},{}],9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require("../common");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  search: function search(searchTerm, searchLimit, sortByIndex) {
    var sortByOptions = ["relevance", "top", "new"];
    // adding 'return' below allows us to make this function return a promise
    return fetch("http://www.reddit.com/search.json?q=" + searchTerm + "&sort=" + sortByOptions[sortByIndex] + "&limit=" + searchLimit).then(function (res) {
      return res.json();
    }).then(function (data) {
      return data.data.children.map(function (data) {
        return data.data;
      });
    }).catch(function (error) {
      return console.log(error);
    });
  },

  formatData: function formatData(data) {
    var processedArray = [];
    data.forEach(function (post) {
      var imageUrl = post.preview ? post.preview.images[0].source.url : "https://is3-ssl.mzstatic.com/image/thumb/Purple118/v4/e1/b7/35/e1b73581-862b-027a-e5d0-e2f95d2ee9d8/AppIcon-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg";

      processedArray.push({
        imageUrl: imageUrl,
        title: post.title,
        description: _common2.default.shortenText(post.selftext, 100),
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
},{"../common":16}],10:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  getHeadlines: function getHeadlines() {
    return fetch("https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=3ec940fd3870472ab3728801d7cb1fde").then(function (res) {
      return res.json();
    }).then(function (data) {
      return data.articles;
    }).catch(function (error) {
      return console.log(error);
    });
  },

  search: function search(searchTerm, searchLimit, sortByIndex) {
    var sortByOptions = ["relevancy", "popularity", "publishedAt"];
    // adding 'return' below allows us to make this function return a promise
    return fetch("https://newsapi.org/v2/everything?language=en&q=" + searchTerm + "&pageSize=100&sortBy=" + sortByOptions[sortByIndex] + "&apiKey=3ec940fd3870472ab3728801d7cb1fde").then(function (res) {
      return res.json();
    }).then(function (data) {
      return data.articles;
    }).catch(function (error) {
      return console.log(error);
    });
  },

  formatData: function formatData(data) {
    var processedArray = [],
        sources = [];
    data.forEach(function (post) {
      processedArray.push({
        imageUrl: post.urlToImage ? post.urlToImage : "https://yt3.ggpht.com/7xqC5TXeVwzt4_Yergj3yEBX1z0JyO152DgWyUoKycm66TeJbXhXe2oMK_wDuVyvByuzWhqFs9-T07b_f5k=s900-mo-c-c0xffffffff-rj-k-no",
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
},{}],7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  search: function search(searchTerm) {
    // adding 'return' below allows us to make this function return a promise
    return fetch("https://api.twitter.com/1.1/search/tweets.json?q=" + searchTerm).then(function (res) {
      return res.json();
    })
    //   .then(data => data.data.children.map(data => data.data))
    .catch(function (error) {
      return console.log(error);
    });
  }
};
},{}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  getCookie: function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  setCookie: function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
};
},{}],3:[function(require,module,exports) {
"use strict";

var _reddit = require("./api/reddit");

var _reddit2 = _interopRequireDefault(_reddit);

var _news = require("./api/news");

var _news2 = _interopRequireDefault(_news);

var _twitter = require("./twitter");

var _twitter2 = _interopRequireDefault(_twitter);

var _cookies = require("./cookies");

var _cookies2 = _interopRequireDefault(_cookies);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
var sourcesList = document.getElementById("sources-list");

var redditResults = [],
    redditRetrieved = false,
    newsData = [],
    newsRetrieved = false,
    sourcesSelected = [];

var currentPosts = [];

updateCookies();
initialLoad();

function initialLoad() {
  _news2.default.getHeadlines().then(function (results) {
    newsData = _news2.default.formatData(results);
    displayData(newsData.news);
    showSources(newsData.sources);
    addListeners();
  });
}

searchForm.addEventListener("submit", function (e) {
  var searchTerm = searchInput.value;

  if (searchTerm === "") showMessage("Please add a search term", "alert-danger");else {
    search(searchTerm);
  }

  e.preventDefault();
});

function search(searchTerm) {
  redditRetrieved = false, newsRetrieved = false;

  // const searchLimit = document.getElementById("limit").value;
  var sortBy = parseInt(document.querySelector('input[name="sortby"]:checked').value);
  // reddit.search(searchTerm, 100, sortBy).then(results => {
  //   // displayData(reddit.formatData(results));
  //   (redditRetrieved = true), (redditResults = reddit.formatData(results));
  //   mergeData();
  // });

  _news2.default.search(searchTerm).then(function (results) {
    // displayData(news.formatData(results));
    // (newsRetrieved = true), (newsResults = news.formatData(results).news);
    // mergeData();
    newsData = _news2.default.formatData(results);
    displayData(newsData.news);
    showSources(newsData.sources);
    addListeners();
  });

  updateCookies(searchTerm);
}

function showSources(sources) {
  var output = "";
  for (var key in sources) {
    var source = sources[key];
    output += "\n      <span class=\"badge badge-light source-item\" data-sourceid=\"" + key + "\">" + source + "</span>\n    ";
  }
  sourcesList.innerHTML = output;
}

function filterSources() {
  if (sourcesSelected.length > 0) {
    var filteredNews = [];
    newsData.news.forEach(function (item) {
      if (sourcesSelected.indexOf(item.source.id) > -1) filteredNews.push(item);
    });
    displayData(filteredNews);
  } else displayData(newsData.news);
}

function mergeData() {
  var mergedData = [];
  if (redditRetrieved || newsRetrieved) {
    mergedData = [].concat(redditResults, _toConsumableArray(newsResults));
    displayData(mergedData);
  }
}

function displayData(data) {
  var output = '<div class="card-columns">';
  data.forEach(function (post) {
    output += "\n        <div class=\"card search-card\">\n            <a href=\"" + post.url + "\" target=\"_blank\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click to see post\">\n                <img class=\"card-img-top\" src=\"" + post.imageUrl + "\" alt=\"Card image cap\">\n                <div class=\"card-body\">\n                  <h5 class=\"card-title\">" + post.title + "</h5>\n                  <p class=\"card-text\">" + post.description + "</p>\n                  <hr>\n                  <div class=\"post-stats\">\n                      <i data-toggle=\"tooltip\" data-placement=\"top\" title=\"A Reddit post\" class=\"" + post.iconClass + "\"></i>\n                      <span>" + post.source.name + "</span>\n                      <span style=\"float: right\">" + moment(post.date).fromNow() + "</span>\n                  </div>\n                </div>\n            </a>\n        </div>\n        ";
  });
  output += "</div";

  document.getElementById("results").innerHTML = output;
}

function updateCookies(searchTerm) {
  var latestSearches = document.getElementById("latest-searches"),
      searchCookies = _cookies2.default.getCookie("searches");

  if (searchTerm) addCookie("searches", searchTerm);

  var searchBadges = "";
  _cookies2.default.getCookie("searches").split("separator").forEach(function (cookie) {
    searchBadges += "\n                  <span class=\"badge badge-pill badge-info search-badge\">" + cookie + "</span>\n              ";
  });
  latestSearches.innerHTML = searchBadges;
}

function addCookie(key, value) {
  var cookieList = _cookies2.default.getCookie(key);

  if (cookieList) {
    if (!cookieList.includes(value)) _cookies2.default.setCookie(key, cookieList + "separator" + value);
  } else _cookies2.default.setCookie(key, value);
}

function addListeners() {
  document.querySelectorAll(".search-badge").forEach(function (element) {
    element.addEventListener("click", function (e) {
      var searchTerm = e.target.innerHTML;
      searchInput.value = searchTerm;
      search(searchTerm);
    });
  });

  document.querySelectorAll(".source-item").forEach(function (element) {
    element.addEventListener("click", function (e) {
      var tag = e.target,
          source = e.target.dataset.sourceid;
      if (tag.classList.contains("badge-light")) {
        tag.classList.remove("badge-light");
        tag.classList.add("badge-success");
      } else {
        tag.classList.add("badge-light");
        tag.classList.remove("badge-success");
      }

      var sourceIndex = sourcesSelected.indexOf(source);

      if (sourceIndex > -1) sourcesSelected.splice(sourceIndex, 1);else sourcesSelected.push(source);

      filterSources();
    });
  });
}

function showMessage(message, className) {
  var div = document.createElement("div");
  var searchContainer = document.getElementById("search-container");
  var search = document.getElementById("search");

  div.className = "alert " + className;
  div.appendChild(document.createTextNode(message));

  searchContainer.insertBefore(div, search);
  setTimeout(function () {
    return document.querySelector(".alert").remove();
  }, 3000);
}

function checkSavedPost(postId) {
  var cookieFavs = _cookies2.default.getCookie("savedPosts").split("separator");
  if (cookieFavs == "") return false;
  cookieFavs.forEach(function (cookie) {
    if (JSON.parse(cookie).id == postId) return true;
  });
  return false;
}
},{"./api/reddit":9,"./api/news":10,"./twitter":7,"./cookies":8,"./common":16}],32:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '42366' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[32,3])
//# sourceMappingURL=/dist/reddit-search.map