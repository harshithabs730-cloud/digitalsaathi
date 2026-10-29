// DigitalSaathi - Step 1: English / Kannada switch
// Every element with data-en and data-kn changes text when a language button is pressed.

const btnEn = document.getElementById("btn-en");
const btnKn = document.getElementById("btn-kn");

function setLanguage(lang) {
  // Change all text that has data-en / data-kn
  document.querySelectorAll("[data-en]").forEach(function (el) {
    el.textContent = el.getAttribute("data-" + lang);
  });

  // Update button highlight and the page language
  btnEn.classList.toggle("active", lang === "en");
  btnKn.classList.toggle("active", lang === "kn");
  document.documentElement.lang = lang;

  // Remember the choice for next visit
  try { localStorage.setItem("saathiLang", lang); } catch (e) {}
}

btnEn.addEventListener("click", function () { setLanguage("en"); });
btnKn.addEventListener("click", function () { setLanguage("kn"); });

// On page load, use the saved language (if any)
let saved = "en";
try { saved = localStorage.getItem("saathiLang") || "en"; } catch (e) {}
setLanguage(saved);