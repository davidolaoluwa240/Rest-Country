"use strict";

// Selecting Element
const colorSwitcherElem = document.querySelector(".header__nav--colorMode");
const colorSwitcherIconElem = document.querySelector(
  ".header__nav--colorMode > span"
);
const colorCssLinkElem = document.head.querySelectorAll("[type*=css]")[1];

// Internal State
let currentColorMode = localStorage.getItem("colorMode") || "light";

// Function
// togglePageColor is a function that change the page color from the light mode to dark mode and vice versal
const togglePageColor = function (mode) {
  if (mode === "light") {
    colorCssLinkElem.setAttribute("href", "./assets/css/light.css");
    colorSwitcherIconElem.className = "material-icons-outlined";
  } else {
    colorCssLinkElem.setAttribute("href", "./assets/css/dark.css");
    colorSwitcherIconElem.className = "material-icons";
  }
};

// Event Listener
colorSwitcherElem.addEventListener("click", function () {
  currentColorMode === "light"
    ? (currentColorMode = "dark")
    : (currentColorMode = "light");
  // store the users preferred page color to the localstorage
  localStorage.setItem("colorMode", currentColorMode);
  togglePageColor(currentColorMode);
});

window.addEventListener("DOMContentLoaded", function () {
  // when the page load call the togglePageColor and pass the last currentColorMode value as argument
  togglePageColor(currentColorMode);
});
