"use strict";

// selecting elements
const countriesCardContainer = document.querySelector(".countries__container");
const searchFilterWrapper = document.querySelector("#search-filter");
const countriesDetailsContainer = document.querySelector(
  ".countries__details--container"
);
const countriesDetailsNavigationWrapper = document.querySelector(
  ".countries__details--navigation"
);
const messageElem = document.querySelector(".message");
const searchInputElem = document.querySelector(".search__control");
const backBtnElem = document.querySelector(
  ".countries__details--navigation__Back"
);

// Internal State
const countriesData = [];
let searchString = "";

// Functions
const toggleMessageState = function (
  shouldOpen,
  message = "Loading...",
  hasError = false
) {
  if (shouldOpen) {
    messageElem.classList.remove("error");
    if (hasError) {
      messageElem.classList.add("error");
    }
    messageElem.classList.remove("d-none");
    messageElem.textContent = message;
  } else {
    messageElem.classList.add("d-none");
  }
};

const filterCountry = function (countries = [], filterBy = "all") {
  let filteredCountryData = [];

  // Perform filtration below
  if (filterBy.toLowerCase() === "all") {
    filteredCountryData = countries;
  } else {
    filteredCountryData = countries.filter(
      (country) => country?.region?.toLowerCase() === filterBy?.toLowerCase()
    );
  }

  if (searchString) {
    filteredCountryData = filteredCountryData.filter((country) =>
      country?.name?.toLowerCase().includes(searchString?.toLowerCase())
    );
  }

  // Set the CountriesCardContainer content to empty
  countriesCardContainer.innerHTML = "";

  if (filteredCountryData.length) {
    toggleMessageState(false);
    // render filtered data
    filteredCountryData.forEach((country) =>
      countriesCardContainer.insertAdjacentHTML(
        "beforeend",
        renderCard(country)
      )
    );
  } else {
    toggleMessageState(true, "😉 No Result!");
  }
};

const renderCard = function (country) {
  const html = `
    <article class="countries__card" data-country-name="${country.name}">
        <header class="countries__card--header">
            <img src="${country.flags.svg || country.flags.png}" alt="${
    country.name
  }" />
        </header>
        <div class="countries__card--main">
            <h2 class="country-name">${country.name}</h2>
            <h3>Population: <span class="population">${new Intl.NumberFormat(
              "en-US"
            ).format(country.population)}</span></h3>
            <h3>Region: <span class="region">${country.region}</span></h3>
            <h3>Capital: <span class="capital">${country.capital}</span></h3>
        </div>
    </article>
    `;

  return html;
};

const fetchCountries = async function () {
  try {
    toggleMessageState(true);
    const response = await fetch("https://restcountries.com/v2/all");
    if (response.ok) {
      const data = await response.json();
      toggleMessageState(false);
      return data;
    } else {
      toggleMessageState(false);
    }
  } catch (_) {
    toggleMessageState(
      true,
      "👋 Could not fetch countries. Please make sure you are connected to a network",
      true
    );
  }
};

const renderCountriesCard = async function () {
  countriesData.push(...((await fetchCountries()) || []));
  countriesData.forEach((country) =>
    countriesCardContainer.insertAdjacentHTML("beforeend", renderCard(country))
  );
};

const renderDetails = function (country, countriesData) {
  const html = `
      <aside class="countries__details--left">
        <img src="${country.flags.svg || country.flags.png}" alt="${
    country.name
  }" />
      </aside>
      <aside class="countries__details--right">
        <h2>${country.name}</h2>
        <div class="countries__details--right__details">
          <aside class="countries__details--right__details--left">
            <h3>Native Name: <span>${country.nativeName}</span></h3>
            <h3>Population: <span>${new Intl.NumberFormat("en-US").format(
              country.population
            )}</span></h3>
            <h3>Region: <span>${country.region}</span></h3>
            <h3>Sub Region: <span>${country.subregion}</span></h3>
            <h3>Capital: <span>${country.capital}</span></h3>
          </aside>
          <aside class="countries__details--right__details--right">
            <h3>Top Level Domain: <span>${country.topLevelDomain.join(
              ", "
            )}</span></h3>
            <h3>Currencies: <span>${country.currencies
              .map((currency) => currency.code)
              .join(", ")}</span></h3>
            <h3>Languages: <span>${country.languages
              .map((language) => language.name)
              .join(", ")}</span></h3>
          </aside>
          ${
            country.borders?.length
              ? `
            <footer>
              <h3>Border Countries:</h3>
              <div class="countries__details--footer__borders">
                ${countriesData
                  .filter((countryData) => {
                    return countryData.borders?.includes(country.alpha3Code);
                  })
                  .map((country) => {
                    return `<button on class="btn">${country.name}</button>`;
                  })
                  .join("")}
              </div>
            </footer>
          `
              : ""
          }
        </div>
      </aside>
  `;
  return html;
};

const toggleSeachAndCountriesContainer = function (status = "open") {
  // when the status is open then remove the d-none class, else add the d-none class
  if (status === "open") {
    searchFilterWrapper.classList.remove("d-none");
    countriesCardContainer.classList.remove("d-none");
  } else {
    searchFilterWrapper.classList.add("d-none");
    countriesCardContainer.classList.add("d-none");
  }
};

const toggleCountriesDetailsNavigationWithContainer = function (
  status = "open"
) {
  // when the status is open then remove the d-none class, else add the d-none class
  if (status === "open") {
    countriesDetailsContainer.classList.remove("d-none");
    countriesDetailsNavigationWrapper.classList.remove("d-none");
  } else {
    countriesDetailsContainer.classList.add("d-none");
    countriesDetailsNavigationWrapper.classList.add("d-none");
  }
};

const getCountryDetails = function (countriesData) {
  return function (e) {
    const selectedCountry =
      e.target.closest(".countries__card")?.dataset.countryName;

    if (selectedCountry) {
      // scroll the window to the top
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });

      // search countriesData for the selectedCountry
      const foundCountry = countriesData.find(
        (country) =>
          country?.name?.toLowerCase() === selectedCountry.toLowerCase()
      );

      // when the foundCountry is not undefined render the details component
      if (foundCountry) {
        toggleSeachAndCountriesContainer("close");
        toggleCountriesDetailsNavigationWithContainer("open");
        countriesDetailsContainer.innerHTML = renderDetails(
          foundCountry,
          countriesData
        );
      }
    }
  };
};

const goBack = function () {
  // when the back button is clicked then close the details component and open the countries data component
  toggleCountriesDetailsNavigationWithContainer("close");
  toggleSeachAndCountriesContainer("open");
};

// Event Listeners
window.addEventListener("DOMContentLoaded", function () {
  renderCountriesCard();
});

searchInputElem.addEventListener("input", function (e) {
  e.preventDefault();
  searchString = e.target.value;
  filterCountry(countriesData, selectedOption);
});

countriesCardContainer.addEventListener(
  "click",
  getCountryDetails(countriesData)
);

backBtnElem.addEventListener("click", goBack);
