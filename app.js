//  STATE 
const state = {
    currentUser: null,
    bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
    isViewingBookmarks: false,
};
// DOM ELEMENTS 
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const btnBookmarks = document.getElementById("btn-bookmarks");
const bookmarkCount = document.getElementById("bookmark-count");
const msgWelcome = document.getElementById("msg-welcome");
const msgLoading = document.getElementById("msg-loading");
const msgError = document.getElementById("msg-error");
const errorText = document.getElementById("error-text");
const profileSection = document.getElementById("profile-section");
const profileAvatar = document.getElementById("profile-avatar");
const profileName = document.getElementById("profile-name");
const profileLogin = document.getElementById("profile-login");
const profileBio = document.getElementById("profile-bio");
const profileLocation = document.getElementById("profile-location");
const profileFollowers = document.getElementById("profile-followers");
const profileFollowing = document.getElementById("profile-following");
const profileRepos = document.getElementById("profile-repos");
const profileLink = document.getElementById("profile-link");
const btnBookmarkAdd = document.getElementById("btn-bookmark-add");
const reposSection = document.getElementById("repos-section");
const reposList = document.getElementById("repos-list");
const bookmarksSection = document.getElementById("bookmarks-section");
const bookmarksList = document.getElementById("bookmarks-list");
// UI STATE FUNCTIONS 
// Montre seulement l'écran de bienvenue
function showWelcome() {
    msgWelcome.classList.remove("hidden");
    msgLoading.classList.add("hidden");
    msgError.classList.add("hidden");
    profileSection.classList.add("hidden");
    reposSection.classList.add("hidden");
    bookmarksSection.classList.add("hidden");
}
// Montre le spinner pendant la requête
function showLoading() {
    msgLoading.classList.remove("hidden");
    msgWelcome.classList.add("hidden");
    msgError.classList.add("hidden");
    profileSection.classList.add("hidden");
    reposSection.classList.add("hidden");
    bookmarksSection.classList.add("hidden");
}
// Montre un message d'erreur
function showError(message) {
    errorText.textContent = message;
    msgError.classList.remove("hidden");
    msgWelcome.classList.add("hidden");
    msgLoading.classList.add("hidden");
    profileSection.classList.add("hidden");
    reposSection.classList.add("hidden");
    bookmarksSection.classList.add("hidden");
}
// Montre le profil + repos
function showProfile() {
    profileSection.classList.remove("hidden");
    reposSection.classList.remove("hidden");
    msgWelcome.classList.add("hidden");
    msgLoading.classList.add("hidden");
    msgError.classList.add("hidden");
    bookmarksSection.classList.add("hidden");
}
// Montre la liste de favoris
function showBookmarks() {
    bookmarksSection.classList.remove("hidden");
    msgWelcome.classList.add("hidden");
    msgLoading.classList.add("hidden");
    msgError.classList.add("hidden");
    profileSection.classList.add("hidden");
    reposSection.classList.add("hidden");
}
//  DISPLAY FUNCTIONS
// Remplit la carte profil avec les données de l'utilisateur
function displayProfile(user) {
    profileAvatar.src = user.avatar_url;
    profileAvatar.alt = user.login;
    profileName.textContent = user.name || user.login;
    profileLogin.textContent = "@" + user.login;
    profileBio.textContent = user.bio || "";
    profileLocation.textContent = user.location || "";
    profileFollowers.textContent = formatNumber(user.followers);
    profileFollowing.textContent = formatNumber(user.following);
    profileRepos.textContent = formatNumber(user.public_repos);
    profileLink.href = user.html_url;
    updateBookmarkBtn(user.login);
    showProfile();
}
// Crée une carte pour chaque repo dans la liste
function displayRepositories(repos) {
    reposList.innerHTML = "";
    if (!repos || repos.length === 0) {
        reposList.innerHTML = '<li style="color:var(--text-dim);padding:0.5rem 0;">Aucun repo public.</li>';
        return;
    }
    repos.forEach(function (repo) {
        const li = document.createElement("li");
        li.className = "repo-card";
        li.innerHTML =
            '<div class="repo-card__info">' +
            '<a href="' + repo.html_url + '" target="_blank" class="repo-card__name">' + repo.name + '</a>' +
            '<p class="repo-card__desc">' + (repo.description || "—") + '</p>' +
            '</div>' +
            '<div class="repo-card__meta">' +
            (repo.language ? '<span class="repo-card__lang">' + repo.language + '</span>' : '') +
            '<span>★ ' + formatNumber(repo.stargazers_count) + '</span>' +
            '</div>';
        reposList.appendChild(li);
    });
}
//  API FUNCTIONS 
// Récupère les infos d'un utilisateur GitHub
async function fetchUser(username) {
    const response = await fetch("https://api.github.com/users/" + username, {
        headers: {
            'Authorization': `token ${env.Token}`
        }
    }  );
  
    if (response.status === 404) {
        throw new Error('Utilisateur "' + username + '" introuvable.');
    }
    if (response.status === 403) {
        throw new Error("Limite API atteinte. Réessaye dans quelques minutes.");
    }
    if (!response.ok) {
        throw new Error("Erreur serveur. Réessaye plus tard.");
    }
    const user = await response.json();
    return user;
}
// Récupère les 5 repos les plus populaires de l'utilisateur
async function fetchUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`);
    if (response.status === 403) {
        throw new Error("Limite API atteinte.");
    }
    if (!response.ok) {
        throw new Error("Impossible de charger les repos.");
    }
    const repos = await response.json();
    return repos;
}
// Fonction principale de recherche
async function handleSearch() {
    const username = searchInput.value.trim();
    // Vérifier que l'input n'est pas vide
    if (!username) {
        showError("Entre un nom d'utilisateur.");
        return;
    }
    showLoading();
    try {
        // Les 2 requêtes en parallèle pour gagner du temps
        const [user, repos] = await Promise.all([
            fetchUser(username),
            fetchUserRepos(username),
        ]);
        state.currentUser = user;
        displayProfile(user);
        displayRepositories(repos);
    } catch (error) {
        // Si erreur réseau (pas de connexion internet)
        if (error instanceof TypeError) {
            showError("Problème de connexion. Vérifie internet.");
        } else {
            showError(error.message);
        }
        console.error(error);
    }
}
// BOOKMARK FUNCTIONS 
// Met à jour le texte du bouton selon si l'utilisateur est déjà en favoris
function updateBookmarkBtn(login) {
    const alreadySaved = state.bookmarks.find(function (b) { return b.login === login; });

    if (alreadySaved) {
        btnBookmarkAdd.textContent = "✓ Déjà en favoris";
        btnBookmarkAdd.disabled = true;
    } else {
        btnBookmarkAdd.textContent = "⊕ Ajouter aux favoris";
        btnBookmarkAdd.disabled = false;
    }
}
// Ajoute l'utilisateur actuel aux favoris
function addBookmark() {
    if (!state.currentUser) return;
    const user = state.currentUser;
    // Éviter les doublons
    const exists = state.bookmarks.find(function (b) { return b.login === user.login; });
    if (exists) return;
    // Ajouter au tableau
    state.bookmarks.push({
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
    });
    // Sauvegarder dans localStorage pour persister
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
    updateBookmarkBtn(user.login);
    updateBookmarkCount();
}
// Supprime un favori par son login
function removeBookmark(login) {
    state.bookmarks = state.bookmarks.filter(function (b) { return b.login !== login; });
    // Re-sauvegarder après suppression
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
    updateBookmarkCount();
    renderBookmarksList();
    // Si le profil affiché = celui supprimé → mettre à jour le bouton
    if (state.currentUser && state.currentUser.login === login) {
        updateBookmarkBtn(login);
    }
}
// Met à jour le chiffre dans le badge favoris
function updateBookmarkCount() {
    bookmarkCount.textContent = state.bookmarks.length;
}
// Affiche la liste des favoris
function renderBookmarksList() {
    bookmarksList.innerHTML = "";
    if (state.bookmarks.length === 0) {
        bookmarksList.innerHTML = '<li style="color:var(--text-dim);padding:0.5rem 0;font-size:0.85rem;">Aucun favori pour l\'instant.</li>';
        return;
    }
    state.bookmarks.forEach(function (user) {
        const li = document.createElement("li");
        li.className = "bookmark-item";
        li.innerHTML =
            '<div class="bookmark-item__user">' +
            '<img src="' + user.avatar_url + '" alt="' + user.login + '" class="bookmark-item__avatar" />' +
            '<div>' +
            '<p class="bookmark-item__login">' + user.login + '</p>' +
            '<p class="bookmark-item__name">' + user.name + '</p>' +
            '</div>' +
            '</div>' +
            '<button class="bookmark-item__remove" title="Supprimer">✕</button>';
        // Clic sur l'utilisateur → recharger son profil
        li.querySelector(".bookmark-item__user").addEventListener("click", function () {
            searchInput.value = user.login;
            state.isViewingBookmarks = false;
            btnBookmarks.classList.remove("active");
            handleSearch();
        });
        // Clic sur le bouton supprimer
        li.querySelector(".bookmark-item__remove").addEventListener("click", function (e) {
            e.stopPropagation();
            removeBookmark(user.login);
        });
        bookmarksList.appendChild(li);
    });
}
//  UTILITY
// Formate les grands nombres : 1200 → 1.2k
function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n;
}
// EVENT LISTENERS 
// Bouton Chercher
searchBtn.addEventListener("click", handleSearch);
// Touche Entrée dans l'input
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleSearch();
});
// Bouton Ajouter aux favoris
btnBookmarkAdd.addEventListener("click", addBookmark);
// Bouton Favoris (toggle)
btnBookmarks.addEventListener("click", function () {
    state.isViewingBookmarks = !state.isViewingBookmarks;
    if (state.isViewingBookmarks) {
        renderBookmarksList();
        showBookmarks();
        btnBookmarks.classList.add("active");
    } else {
        showWelcome();
        btnBookmarks.classList.remove("active");
    }
});
//  INITIALIZE
(function init() {
    updateBookmarkCount();
    showWelcome();
})();