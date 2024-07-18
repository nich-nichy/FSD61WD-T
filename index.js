const restContriesApi = "https://restcountries.com/v3.1/all";
const weatherApi = "a5836c42e23e52f33a6c78adf8c3b13b";
const regex = /\s+/g;

const fetchCountries = () => {
  fetch(restContriesApi)
    .then((response) => response.json())
    .then((data) => {
      renderCountries(data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const fetchWeather = (lat, lon, countryName) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApi}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderInPopup(data, countryName);
    })
    .catch((error) => {
      console.error(error);
    });
};

const renderCountries = (countries) => {
  const container = document.getElementById("countries-container");
  container.innerHTML = "";
  countries.forEach((country) => {
    const { common: name } = country.name;
    const [lat, lon] = country.latlng;
    const card = document.createElement("div");
    card.className = "col-lg-4 col-sm-12 mb-3";
    card.innerHTML = `
      <div class="card text-bg-dark">
        <div class="card-body">
          <h5 class="card-header text-center mb-2">${name}</h5>
          <img src=${
            country.flags.png
          } class="img-fluid w-100" style="height: 200px" />
          <div class="mt-3 mb-3 d-grid justify-items-center justify-content-center" style="justify-items: center !important">
            <p>Capital: ${country.capital}</p>
            <p>Region: ${country.region}</p>
            <p>Country Code:  ${country.cca3}</p>
            <p>Latitude : ${lat.toFixed(2)}</p>
            <p>Longitude: ${lon.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="fetchWeather(${lat}, ${lon}, '${name}')">Click for Weather</button>
          </div>
              <div
            class="modal fade"
            id="weatherModal"
            tabindex="-1"
            aria-labelledby="weatherModalLabel"
            aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="weatherModalLabel">
              Weather Information
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

          </div>
          <div class="modal-body" id="weatherModalBody"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
};

const renderInPopup = (data, countryName) => {
  console.log(data);
  const weatherModalBody = document.getElementById("weatherModalBody");
  const weather = data?.weather[0]?.main;
  const weatherDescription = data.weather[0].description;
  weatherModalBody.innerHTML = `
    <p style="font-weight: bold; color: #0f172a !important">Country: <span style="font-weight: lighter">${countryName}</span></p>
    <p style="font-weight: bold; color: #0f172a !important">Weather: <span style="font-weight: lighter">${weather} (${weatherDescription})</span></p>
  `;
  const weatherModal = new bootstrap.Modal(
    document.getElementById("weatherModal")
  );
  weatherModal.show();
};

document.addEventListener("DOMContentLoaded", fetchCountries);
