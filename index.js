async function getCats() {
  let url = "https://api.thecatapi.com/v1/images/search";
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const cat = await response.json();
    // console.log({ cat });
    return cat[0];
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

async function getCatFacts() {
  let url = "https://meowfacts.herokuapp.com/";
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const cat = await response.json();
    // console.log({ cat });
    return cat?.data[0];
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

function createSkeletons(count, skeletons) {
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

const renderDynamicCat = (cat) => {
  return `<img src="${cat.url}" class="d-block rounded mx-lg-auto img-fluid" alt="Bootstrap Themes" width="450" height="500">`;
};

const renderCatFacts = (image, fact) => {
  // console.log({ image: image.url, fact }, "from acts");
  return `
    <div class="d-flex justify-content-center align-items-center min-vh-100 facts-wrapper">
      <a type="button" class="btn btn-lg btn-outline-primary rounded-pill m-5" href="index.html">
        <i class="fa-solid fa-house me-1"></i>Home
      </a>
      <div class="card card-custom shadow rounded">
        <img src="${image.url}" class="card-img-top rounded-top" alt="fact">
        <div class="card-body">
          <blockquote class="blockquote mb-0 text-center blockquote-scroll">
            <p class="fs-2">${fact}</p>
          </blockquote>
        </div>
      </div>
      <div class="d-flex flex-column btn-wrapper">
        <a type="button" class="btn btn-lg btn-custom-primary rounded-pill m-5" href="facts.html?mode=facts">
          <i class="fa-solid fa-wand-magic-sparkles me-1"></i> Next Fact
        </a>
        <a type="button" class="btn btn-lg btn-custom-secondary rounded-pill m-5" href="moreFacts.html?mode=moreFacts">
          <i class="fa-solid fa-paper-plane me-1"></i> All
        </a>
      </div>
    </div>
  `;
};

const renderMoreCatFacts = (image, fact) => {
  // console.log({ image: image.url, fact }, "from acts");
  return `
    <div class="col-12 col-md-4 mb-4 d-flex justify-content-center align-items-center">
      <div class="card card-custom shadow rounded">
        <img src="${image.url}" class="card-img-top rounded-top" alt="fact">
        <div class="card-body">
          <blockquote class="blockquote mb-0 text-center blockquote-scroll">
            <p class="fs-2">${fact}</p>
          </blockquote>
        </div>
      </div>
    </div>
  `;
};

async function fetchAndRenderCatFacts(skeletons) {
  const catFactsContainer = document.getElementById("cat-facts-container");
  const fetchPromises = [];
  for (let i = 0; i < 9; i++) {
    fetchPromises.push(Promise.all([getCats(), getCatFacts()]));
  }
  const fetchedData = await Promise.all(fetchPromises);
  skeletons.innerHTML = "";
  fetchedData.forEach(([catImage, catFact]) => {
    if (catImage && catFact) {
      const catFactHTML = renderMoreCatFacts(catImage, catFact);
      catFactsContainer.innerHTML += catFactHTML;
    }
  });
}

async function renderEntireHtml() {
  const urlParams = new URLSearchParams(window.location.search);
  const toSearch = urlParams.get("mode");
  const fetchCatImages = await getCats();
  const fetchCatFacts = await getCatFacts();
  const getImage = document.getElementById("cat-img");
  const getFacts = document.getElementById("cat-fact-container");
  const skeletons = document.getElementById("skeletons");
  const renderImg = renderCatFacts(fetchCatImages, fetchCatFacts);

  if (toSearch?.toLowerCase()?.includes("morefacts")) {
    createSkeletons(9, skeletons);
    await fetchAndRenderCatFacts(skeletons);
  } else if (toSearch?.toLowerCase()?.includes("facts")) {
    getFacts.innerHTML = renderImg;
  } else {
    getImage.innerHTML = renderDynamicCat(fetchCatImages);
  }
}
window.onload = function exampleFunction() {
  renderEntireHtml();
};
