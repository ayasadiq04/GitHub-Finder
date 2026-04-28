//STATE – données de l'application
const state = {
  currentUser: null,
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
  isViewingBookmarks: false,
};

//  SÉLECTEURS DOM
const searchInput     = document.getElementById("search-input");
const searchBtn       = document.getElementById("search-btn");
const btnBookmarks    = document.getElementById("btn-view-bookmarks");
const bookmarkCount   = document.getElementById("bookmark-count");

// Messages
const msgWelcome      = document.getElementById("msg-welcome");
const msgLoading      = document.getElementById("msg-loading");
const msgError        = document.getElementById("msg-error");
const errorText       = document.getElementById("error-text");

// Profile card
const profileSection  = document.getElementById("profile-section");
const profileAvatar   = document.getElementById("profile-avatar");
const profileName     = document.getElementById("profile-name");
const profileLogin    = document.getElementById("profile-login");
const profileBio      = document.getElementById("profile-bio");
const profileFollowers= document.getElementById("profile-followers");
const profileRepos    = document.getElementById("profile-repos");
const profileLink     = document.getElementById("profile-link");
const btnBookmark     = document.getElementById("btn-bookmark");

// Bookmarks section
const bookmarksSection= document.getElementById("bookmarks-section");
const bookmarksList   = document.getElementById("bookmarks-list");

//  UI STATES – afficher un seul état
function showWelcome() {
  msgWelcome.classList.remove("hidden");
  msgLoading.classList.add("hidden");
  msgError.classList.add("hidden");
  profileSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}

function showLoading() {
  msgLoading.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgError.classList.add("hidden");
  profileSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}

function showError(message) {
  errorText.textContent = "❌ " + message;
  msgError.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgLoading.classList.add("hidden");
  profileSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}

function showProfile() {
  profileSection.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgLoading.classList.add("hidden");
  msgError.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}

function showBookmarks() {
  bookmarksSection.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgLoading.classList.add("hidden");
  msgError.classList.add("hidden");
  profileSection.classList.add("hidden");
}

