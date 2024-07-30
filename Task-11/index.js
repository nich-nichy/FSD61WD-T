// Variables
let newsFeed;
let topHeadlines;
const contentArr = [
  "sports",
  "politics",
  "business",
  "health",
  "entertainment",
];
let skeletons = document.getElementById("skeletons");

async function getNewsData(type, query) {
  let url = type?.toLowerCase()?.includes("everything")
    ? `https://real-time-news-data.p.rapidapi.com/search?query=${query}&limit=50&time_published=anytime&country=IN&lang=en`
    : `https://real-time-news-data.p.rapidapi.com/search?query=latest&limit=50&time_published=7d&country=IN&lang=en`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "41fb6bf81dmshf5cc04b56e7f029p198756jsnc9a35e8ec8be",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    // console.log({ json });
    skeletons.innerHTML = "";
    return json?.data;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

const truncateText = (text, maxLength) => {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const getCarouselData = async (newsFeed, mode) => {
  // console.log({ newsFeed, mode });
  let carouselItems = newsFeed
    .map((headline, index) => {
      return `
    ${
      mode?.toLowerCase().includes("hero")
        ? `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${headline.photo_url}" class="d-block w-100" alt="${
            headline?.title
          }">
          <div class="customised-card-wrapper">
              <div class="card customised-card">
                  <div class="card-body">
                      <h5 class="card-title customised-card-head fs-2">${truncateText(
                        headline.title,
                        100
                      )}</h5>
                      <p class="card-text customised-card-desc">${truncateText(
                        headline.snippet,
                        150
                      )}</p>
                      <a href="${
                        headline.source_url
                      }" class="btn btn-lg btn-block btn-outline-primary rounded-pill me-3 customised-card-btn">Explore <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
              </div>
          </div>
        </div>`
        : `<div class="carousel-item mb-5 ${index === 0 ? "active" : ""}">
          <div class="carousel-two-wrapper mb-5">
              <div class="card">
                <div class="card-body text-center">
                  <h5 class="card-title fs-2 ps-5 pe-5 card-two-head">${
                    headline?.title
                  }</h5>
                  <p class="card-two-desc">Provider: ${headline?.snippet}</p>
                  <a href="${
                    headline?.source_url
                  }" class="btn btn-lg btn-block btn-outline-primary card-btn">Explore <i class="fa-solid fa-arrow-right"></i></a>
                </div>
              </div>
          </div>
        </div>`
    }`;
    })
    .join("");
  return carouselItems;
};

const createCard = (image, header, content, url, publishedAt) => `
    <div class="container col-12 col-md-4">
      <div class="card-deck mb-3">
        <div class="card mb-4 box-shadow card-ht">
        <img src="${image}" class="card-img-top card-image" alt="${header}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title card-header-md">${truncateText(
              header,
              100
            )}</h5>
            <p class="card-text card-desc-md">${truncateText(content, 100)}</p>
            <p class="text-muted card-desc-md">Published: ${formatDate(
              publishedAt
            )}</p>
            <button type="button" class="mt-auto btn btn-lg btn-block btn-outline-primary card-btn" onclick="window.location.href='${url}'">Explore <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
`;

const createCardDynamicallyForAll = (
  image,
  header,
  content,
  url,
  publishedAt
) => `
<div class="container col-16 col-md-4">
      <div class="card-deck mb-3">
        <div class="card mb-4 box-shadow" style="height: 33rem">
        <img src="${image}" class="card-img-top card-image" alt="${header}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title card-header-md">${header}</h5>
            <p class="card-text card-desc-md">${truncateText(content, 100)}</p>
            <p class="text-muted card-desc-md">Published: ${formatDate(
              publishedAt
            )}</p>
            <button type="button" class="mt-auto btn btn-lg btn-block btn-outline-primary " onclick="window.location.href='${url}'">Explore <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
`;

const renderRow = (cards) => {
  return `
    <div class="row">
      ${cards
        .map((card) =>
          createCard(
            card.photo_url,
            card.title,
            card.snippet,
            card.source_url,
            card.published_datetime_utc
          )
        )
        .join("")}
    </div>
  `;
};

const renderCards = (cards) => {
  const firstRow = renderRow(cards.slice(0, 3));
  const secondRow = renderRow(cards.slice(3, 6));
  return { firstRow, secondRow };
};

const renderCardsForSubLinks = (cards) => {
  const firstRow = renderRow(cards.slice(0, 3));
  const secondRow = renderRow(cards.slice(3, 6));

  const thirdRow = renderRow(cards.slice(6, 9));
  const fourthRow = renderRow(cards.slice(9, 12));
  return { firstRow, secondRow, thirdRow, fourthRow };
};

const validateNewsArray = async (array, mode) => {
  // console.log(array);
  let checkArray = array && array.length > 0 ? array : [];
  if (mode?.toLowerCase().includes("top-headlines")) {
    checkArray = getRandomNews(checkArray, 5, "top-headlines");
  } else if (mode?.toLowerCase().includes("newsfeed")) {
    checkArray = getRandomNews(checkArray, 10, "newsFeed");
  } else {
    checkArray = getRandomNews(array, 20, mode);
  }
  return checkArray;
};

const getRandomNews = (array, n, mode) => {
  // console.log({ array, n, mode });
  // let shuffled = shuffled.slice(0, n);
  return array.slice(0, n);
};

const renderDynamicContent = async (params) => {
  // console.log(params);
  const fetchDesiredContent = await getNewsData("everything", params);
  const desiredContent = await validateNewsArray(fetchDesiredContent, params);
  const renderDesiredContent = renderCardsForSubLinks(desiredContent);
  const getContainer = document.getElementById(`card-container-${params}`);
  getContainer.innerHTML =
    renderDesiredContent?.firstRow +
    renderDesiredContent?.secondRow +
    renderDesiredContent?.thirdRow +
    renderDesiredContent?.fourthRow;
  // console.log(desiredContent, "fetchDesiredContent");
};

function createSkeletons(count) {
  let skeletonHTML = "";
  for (let i = 0; i < count; i++) {
    skeletonHTML += `
        <div class="col-12 col-md-4 mb-4">
          <div class="card" aria-hidden="true">
            <img src="..." class="card-img-top card-placeholder" alt="...">
            <div class="card-body">
              <h5 class="card-title placeholder-glow">
                <span class="placeholder col-6"></span>
              </h5>
              <p class="card-text placeholder-glow">
                <span class="placeholder col-7"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-6"></span>
                <span class="placeholder col-8"></span>
              </p>
              <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
            </div>
          </div>
        </div>
      `;
  }
  skeletons.innerHTML = skeletonHTML;
}

const renderEntireHtml = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const toSearch = urlParams.get("content");
  // console.log({ toSearch });
  createSkeletons(9);
  const toSearchNews = contentArr.filter((content) =>
    content.toLowerCase().includes(toSearch?.toLowerCase())
  );
  // console.log(toSearchNews);
  if (toSearchNews === null || toSearchNews?.length === 0) {
    const fetchHeadlines = await getNewsData("top-headlines", "");
    const fetchNewsFeed = await getNewsData("everything", "recent");
    const fetchLatest = await getNewsData("everything", "latest");
    const topHeadlines = await validateNewsArray(
      fetchHeadlines,
      "top-headlines"
    );
    const newsFeed = await validateNewsArray(fetchNewsFeed, "newsFeed");
    const latestFeed = await validateNewsArray(fetchLatest, "newsFeed");
    const renderCarousel = document.getElementById("carousel-inner");
    const renderNewsFeed = document.getElementById("carousel-feed");
    const cardContainer = document.getElementById("topNews-card-container");
    const renderLatestNews = renderCards(latestFeed);
    const renderHeadlines = await getCarouselData(topHeadlines, "feed");
    const carouselItems = await getCarouselData(newsFeed, "hero");
    if (renderCarousel && renderNewsFeed && cardContainer) {
      renderCarousel.innerHTML = carouselItems;
      renderNewsFeed.innerHTML = renderHeadlines;
      cardContainer.innerHTML =
        renderLatestNews?.firstRow + renderLatestNews?.secondRow;
    } else {
      console.error("One or more HTML elements not found.");
    }
  } else {
    renderDynamicContent(toSearchNews[0]);
  }
};

window.onload = function exampleFunction() {
  renderEntireHtml();
};
