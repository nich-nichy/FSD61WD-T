document.addEventListener("DOMContentLoaded", async () => {
  const characterContainer = document.getElementById("character-container");
  const paginationInfoElement = document.getElementById("pagination-info");
  let currentPage = 1;
  let itemsPerPage = 9;

  async function getDisneyCharacters(page = currentPage) {
    let url = `https://api.disneyapi.dev/character?page=${page}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      //   console.log(json, "json");
      return json?.data || [];
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  function renderCharacterCards(characters) {
    characterContainer.innerHTML = characters
      .slice(0, itemsPerPage)
      .map(
        (character) => `
        <div class="col-md-4 mb-4">
          <div class="card bg-dark text-white">
            <img src="${character.imageUrl}" class="card-img-top" alt="${
          character.name
        }">
            <div class="card-body">
              <h5 class="card-title">${character.name}</h5>
              <p class="card-text">
                <strong>Films:</strong> ${character.films.join(", ")}<br>
                <strong>TV Shows:</strong> ${character.tvShows.join(", ")}<br>
                <strong>Video Games:</strong> ${character.videoGames.join(", ")}
              </p>
              <button type="button" class="mt-auto btn btn-lg btn-block btn-outline-primary " onclick="window.location.href='${
                character.sourceUrl
              }'">Explore <i class="fa-solid fa-arrow-right"></i></button>

            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  async function loadAndRenderCharacters() {
    const characters = await getDisneyCharacters();
    renderCharacterCards(characters);
  }

  loadAndRenderCharacters();

  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");

  nextButton.addEventListener("click", async () => {
    currentPage++;
    const characters = await getDisneyCharacters(currentPage);
    renderCharacterCards(characters);
  });

  prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      const characters = await getDisneyCharacters(currentPage);
      renderCharacterCards(characters);
    }
  });
});
