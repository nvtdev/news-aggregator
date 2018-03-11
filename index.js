import reddit from "./api/reddit";
import news from "./api/news";
import twitter from "./twitter";
import cookies from "./cookies";
import common from "./common";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const sourcesList = document.getElementById("sources-list");

let redditResults = [],
  redditRetrieved = false,
  newsData = [],
  newsRetrieved = false,
  sourcesSelected = [];

let currentPosts = [];

updateCookies();
initialLoad();

function initialLoad() {
  news.getHeadlines().then(results => {
    newsData = news.formatData(results);
    displayData(newsData.news);
    showSources(newsData.sources);
    addListeners();
  });
}

searchForm.addEventListener("submit", e => {
  const searchTerm = searchInput.value;

  if (searchTerm === "")
    showMessage("Please add a search term", "alert-danger");
  else {
    search(searchTerm);
  }

  e.preventDefault();
});

function search(searchTerm) {
  (redditRetrieved = false), (newsRetrieved = false);

  // const searchLimit = document.getElementById("limit").value;
  const sortBy = parseInt(
    document.querySelector('input[name="sortby"]:checked').value
  );
  // reddit.search(searchTerm, 100, sortBy).then(results => {
  //   // displayData(reddit.formatData(results));
  //   (redditRetrieved = true), (redditResults = reddit.formatData(results));
  //   mergeData();
  // });

  news.search(searchTerm).then(results => {
    // displayData(news.formatData(results));
    // (newsRetrieved = true), (newsResults = news.formatData(results).news);
    // mergeData();
    newsData = news.formatData(results);
    displayData(newsData.news);
    showSources(newsData.sources);
    addListeners();
  });

  updateCookies(searchTerm);
}

function showSources(sources) {
  let output = "";
  for (var key in sources) {
    const source = sources[key];
    output += `
      <span class="badge badge-light source-item" data-sourceid="${key}">${source}</span>
    `;
  }
  sourcesList.innerHTML = output;
}

function filterSources() {
  if (sourcesSelected.length > 0) {
    let filteredNews = [];
    newsData.news.forEach(item => {
      if (sourcesSelected.indexOf(item.source.id) > -1) filteredNews.push(item);
    });
    displayData(filteredNews);
  } else displayData(newsData.news);
}

function mergeData() {
  let mergedData = [];
  if (redditRetrieved || newsRetrieved) {
    mergedData = [...redditResults, ...newsResults];
    displayData(mergedData);
  }
}

function displayData(data) {
  let output = '<div class="card-columns">';
  data.forEach(post => {
    output += `
        <div class="card search-card">
            <a href="${
              post.url
            }" target="_blank" data-toggle="tooltip" data-placement="top" title="Click to see post">
                <img class="card-img-top" src="${
                  post.imageUrl
                }" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${post.title}</h5>
                  <p class="card-text">${post.description}</p>
                  <hr>
                  <div class="post-stats">
                      <i data-toggle="tooltip" data-placement="top" title="A Reddit post" class="${
                        post.iconClass
                      }"></i>
                      <span>${post.source.name}</span>
                      <span style="float: right">${moment(
                        post.date
                      ).fromNow()}</span>
                  </div>
                </div>
            </a>
        </div>
        `;
  });
  output += "</div";

  document.getElementById("results").innerHTML = output;
}

function updateCookies(searchTerm) {
  const latestSearches = document.getElementById("latest-searches"),
    searchCookies = cookies.getCookie("searches");

  if (searchTerm) addCookie("searches", searchTerm);

  let searchBadges = "";
  cookies
    .getCookie("searches")
    .split("separator")
    .forEach(cookie => {
      searchBadges += `
                  <span class="badge badge-pill badge-info search-badge">${cookie}</span>
              `;
    });
  latestSearches.innerHTML = searchBadges;
}

function addCookie(key, value) {
  var cookieList = cookies.getCookie(key);

  if (cookieList) {
    if (!cookieList.includes(value))
      cookies.setCookie(key, cookieList + "separator" + value);
  } else cookies.setCookie(key, value);
}

function addListeners() {
  document.querySelectorAll(".search-badge").forEach(element => {
    element.addEventListener("click", e => {
      const searchTerm = e.target.innerHTML;
      searchInput.value = searchTerm;
      search(searchTerm);
    });
  });

  document.querySelectorAll(".source-item").forEach(element => {
    element.addEventListener("click", e => {
      const tag = e.target,
        source = e.target.dataset.sourceid;
      if (tag.classList.contains("badge-light")) {
        tag.classList.remove("badge-light");
        tag.classList.add("badge-success");
      } else {
        tag.classList.add("badge-light");
        tag.classList.remove("badge-success");
      }

      const sourceIndex = sourcesSelected.indexOf(source);

      if (sourceIndex > -1) sourcesSelected.splice(sourceIndex, 1);
      else sourcesSelected.push(source);

      filterSources();
    });
  });
}

function showMessage(message, className) {
  const div = document.createElement("div");
  const searchContainer = document.getElementById("search-container");
  const search = document.getElementById("search");

  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));

  searchContainer.insertBefore(div, search);
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

function checkSavedPost(postId) {
  const cookieFavs = cookies.getCookie("savedPosts").split("separator");
  if (cookieFavs == "") return false;
  cookieFavs.forEach(cookie => {
    if (JSON.parse(cookie).id == postId) return true;
  });
  return false;
}
