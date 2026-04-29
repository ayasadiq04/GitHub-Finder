//  TEST DATA 
const testUsers = [
  {
    id: 1,
    login: "torvalds",
    name: "Linus Torvalds",
    avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
    bio: "Linux creator",
    followers: 200000,
    following: 0,
    public_repos: 50,
    html_url: "https://github.com/torvalds",
  },
  {
    id: 2,
    login: "gvanrossum",
    name: "Guido van Rossum",
    avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
    bio: "Python creator",
    followers: 50000,
    following: 50,
    public_repos: 30,
    html_url: "https://github.com/gvanrossum",
  },
];
const testRepos = [
  {
    name: "linux",
    description: "Linux kernel",
    language: "C",
    stargazers_count: 15000,
    forks_count: 2000,
    html_url: "https://github.com/torvalds/linux",
  },
  {
    name: "cpython",
    description: "Python interpreter",
    language: "C",
    stargazers_count: 50000,
    forks_count: 23000,
    html_url: "https://github.com/python/cpython",
  },
];
//  STATE 
const state = {
  currentUser: null,
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
  isViewingBookmarks: false,
};
//  DOM ELEMENTS 
const searchInput      = document.getElementById("search-input");
const searchBtn        = document.getElementById("search-btn");
const btnBookmarks     = document.getElementById("btn-view-bookmarks");
const bookmarkCount    = document.getElementById("bookmark-count");
const msgWelcome       = document.getElementById("msg-welcome");
const msgLoading       = document.getElementById("msg-loading");
const msgError         = document.getElementById("msg-error");
const errorText        = document.getElementById("error-text");
const profileSection   = document.getElementById("profile-section");
const profileAvatar    = document.getElementById("profile-avatar");
const profileName      = document.getElementById("profile-name");
const profileLogin     = document.getElementById("profile-login");
const profileBio       = document.getElementById("profile-bio");
const profileFollowers = document.getElementById("profile-followers");
const profileRepos     = document.getElementById("profile-repos");
const profileLink      = document.getElementById("profile-link");
const btnBookmark      = document.getElementById("btn-bookmark");
const reposSection     = document.getElementById("repos-section");
const reposList        = document.getElementById("repos-list");
const bookmarksSection = document.getElementById("bookmarks-section");
const bookmarksList    = document.getElementById("bookmarks-list");

//  UI STATE FUNCTIONS 
function showWelcome() {
  msgWelcome.classList.remove("hidden");
  msgLoading.classList.add("hidden");
  msgError.classList.add("hidden");
  profileSection.classList.add("hidden");
  reposSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}
function showLoading() {
  msgLoading.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgError.classList.add("hidden");
  profileSection.classList.add("hidden");
  reposSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}
function showError(message) {
  errorText.textContent = "❌ " + message;
  msgError.classList.remove("hidden");
  msgWelcome.classList.add("hidden");
  msgLoading.classList.add("hidden");
  profileSection.classList.add("hidden");
  reposSection.classList.add("hidden");
  bookmarksSection.classList.add("hidden");
}
function showProfile() {
  profileSection.classList.remove("hidden");
  reposSection.classList.remove("hidden");
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
  reposSection.classList.add("hidden");
}