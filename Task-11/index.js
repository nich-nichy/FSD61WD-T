// Variables
let newsFeed;
let topHeadlines;

console.log("Globally checking data");

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
    console.log(json);
    return json?.articles;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

const getCarouselData = async (newsFeed, mode) => {
  let carouselItems = newsFeed
    ?.slice(0, 5)
    .map((headline, index) => {
      return `
    ${
      mode === "hero"
        ? `<div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${
              headline?.urlToImage
            }" class="d-block w-100 h-50" alt="${headline?.title}">
          <div class="customised-card-wrapper">
              <div class="card customised-card ">
                  <div class="card-body">
                      <h5 class="card-title fs-2">${headline?.title}</h5>
                      <p class="card-text">${headline?.description}</p>
                      <a href="${
                        headline?.url
                      }" class="btn border rounded-pill me-3">Explore <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
              </div>
          </div>
        </div>`
        : `<div class="carousel-item ${index === 0 ? "active" : ""}">
          <div class="customised-card-wrapper">
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title fs-2">${headline?.title}</h5>
                      <a href="${
                        headline?.url
                      }" class="btn border rounded-pill me-3">Explore <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
              </div>
          </div>
        </div>`
    }`;
    })
    .join("");
  return carouselItems;
};

const getHeadlines = () => {};

// let fetchHeadlines = [
//   {
//     source: {
//       id: null,
//       name: "Gizmodo.com",
//     },
//     author: "Lucas Ropek",
//     title: "Can Biden Really Drone Strike Mar-a-Lago Now?",
//     description:
//       "A recent Supreme Court decision affirmed that a sitting president has legal immunity. How far does it go?",
//     url: "https://gizmodo.com/can-biden-really-drone-strike-mar-a-lago-now-2000377658",
//     urlToImage: "https://gizmodo.com/app/uploads/2024/07/trump_drone.jpg",
//     publishedAt: "2024-07-10T15:40:58Z",
//     content:
//       "The Supreme Court passed a sweeping but vague ruling last week that gave broad legal immunity to U.S. Presidents for the actions they take while in office. Critics claim that the ruling (which relate… [+11181 chars]",
//   },
//   {
//     source: {
//       id: null,
//       name: "BBC News",
//     },
//     author: null,
//     title: "Princess Anne returns to public duties after head injury",
//     description:
//       "The Princess Royal is gradually returning to her duties, following her recent hospital admission.",
//     url: "https://www.bbc.com/news/articles/c80e1kr34glo",
//     urlToImage:
//       "https://ichef.bbci.co.uk/news/1024/branded_news/a2ff/live/07da63a0-4057-11ef-9909-c12337993a63.jpg",
//     publishedAt: "2024-07-12T14:37:26Z",
//     content:
//       "By Chloe Harcombe and Hollie Cole, BBC News\r\nPrincess Anne has carried out her first public engagement since receiving a minor head injury and concussion thought to be caused by a horse last month.\r\n… [+2959 chars]",
//   },
// ];

const renderEntireHtml = async () => {
  let fetchHeadlines = await getNewsData("top-headlines", "");
  let fetchNewsFeed = await getNewsData("everything", "recent");
  let renderCarousel = document.getElementById("carousel-inner");
  let renderNewsFeed = document.getElementById("carousel-feed");
  topHeadlines =
    fetchHeadlines && fetchHeadlines?.length > 0 ? fetchHeadlines : [];
  newsFeed = fetchNewsFeed && fetchNewsFeed?.length > 0 ? fetchNewsFeed : [];
  let renderHeadlines = await getCarouselData(topHeadlines, "feed");
  let carouselItems = await getCarouselData(newsFeed, "hero");
  renderCarousel.innerHTML = carouselItems;
  renderNewsFeed.innerHTML = renderHeadlines;
};

window.onload = function exampleFunction() {
  renderEntireHtml();
};
