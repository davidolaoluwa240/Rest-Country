"use strict";

// Selecting elements
const customSelectElem = document.querySelector(".custom-select");
const customSelectSelectedNameElem = document.querySelector(
  ".custom-select__selected > p"
);
const customSelectSelectedIconElem = document.querySelector(
  ".custom-select__selected > span"
);
const customSelectDropdownElem = document.querySelector(
  ".custom-select__dropdown"
);
const customSelectDropdownItemElems = document.querySelectorAll(
  ".custom-select__dropdown--item"
);

// Internal States
let isCustomSelectOpen = false;
let selectedOption = "all";

// Functions
const toggleCustomSelectVisibility = function (state) {
  // when state is a truthy value then open the custom select dropdown, else close the dropdown select
  if (state) {
    customSelectDropdownElem.classList.add("open");
    customSelectSelectedIconElem.textContent = "expand_more";
  } else {
    customSelectDropdownElem.classList.remove("open");
    customSelectSelectedIconElem.textContent = "expand_less";
  }
};

const onOptionSelected = function (value, el) {
  // when value is not empty, then update the custom select selection and filter country base on region
  if (value) {
    customSelectDropdownItemElems.forEach((node) =>
      node.classList.remove("custom-select__active")
    );
    selectedOption = value;
    customSelectSelectedNameElem.textContent = value;
    el.classList.add("custom-select__active");
    filterCountry(countriesData, value);
  }
};

// Event Listeners
customSelectElem.addEventListener("click", function (e) {
  e.stopPropagation();
  isCustomSelectOpen = !isCustomSelectOpen;
  toggleCustomSelectVisibility(isCustomSelectOpen);

  const selectedOptionElem = e.target.closest(".custom-select__dropdown--item");
  onOptionSelected(selectedOptionElem?.dataset.value, selectedOptionElem);
});

document.body.addEventListener("click", function () {
  if (isCustomSelectOpen) {
    isCustomSelectOpen = false;
    toggleCustomSelectVisibility(isCustomSelectOpen);
  }
});
