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

async function getNewsData(type, query) {
  const url = type?.toLowerCase()?.includes("everything")
    ? `https://newsapi.org/v2/${type}?q=${query}`
    : `https://newsapi.org/v2/${type}?country=in`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": "e24f7b48197f4be39fc8dbbb5f6d08fe",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    // console.log(json);
    return json?.articles;
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
          <img src="${headline?.urlToImage}" class="d-block w-100" alt="${
            headline?.title
          }">
          <div class="customised-card-wrapper">
              <div class="card customised-card">
                  <div class="card-body">
                      <h5 class="card-title customised-card-head fs-2">${truncateText(
                        headline?.title,
                        100
                      )}</h5>
                      <p class="card-text customised-card-desc">${truncateText(
                        headline?.description,
                        150
                      )}</p>
                      <a href="${
                        headline?.url
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
                  <p class="card-two-desc">Provider: ${
                    headline?.source.name
                  }</p>
                  <a href="${
                    headline?.url
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
            <h5 class="card-title card-header-md">${header}</h5>
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
            card.urlToImage,
            card.title,
            card.description,
            card.url,
            card.publishedAt
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
  let filteredArray;
  let shuffled = array?.sort(() => 0.5 - Math.random());
  let returnDesiredArray = shuffled.slice(0, n);
  if (mode?.toLowerCase().includes("top-headlines")) {
    filteredArray = array?.slice(0, 5).filter((news) => !news.urlToImage);
    // console.log({ filteredArray }, "headlines");
    return filteredArray;
  } else if (contentArr?.includes(mode)) {
    ("yes the mode is present");
    filteredArray = array
      ?.slice(0, n)
      .filter(
        (news) =>
          news.urlToImage &&
          news.title !== "[Removed]" &&
          news.description !== "[Removed]"
      );
    // console.log({ filteredArray }, "headlines");
    return filteredArray;
  } else {
    filteredArray = returnDesiredArray.filter(
      (news) =>
        news.urlToImage &&
        news.title !== "[Removed]" &&
        news.description !== "[Removed]"
    );
    // console.log(filteredArray, "feed");
    return filteredArray;
  }
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

const renderEntireHtml = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const toSearch = urlParams.get("content");
  // console.log({ toSearch });

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
