import './style.css'


const baseUrl = "https://api.github.com/users";


const themeToggle = document.querySelector("#theme-toggle");
const input = document.querySelector("input");
const searchButton = document.querySelector("#search-button");
const userFullname = document.querySelector("#user-fullname");
const userName = document.querySelector("#username");
const userAvatar = document.querySelector("#user-img");
const repositories = document.querySelector("#repositories");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const pageLink = document.querySelector("#github-url");
const errorMessage = document.querySelector("#error-message");
const userCard = document.querySelector("#user-card");
const userLocation = document.querySelector("#location")
const bio = document.querySelector("#caption") 
const reposList = document.querySelector("#repos-list")
const repository = document.querySelector("#repos")

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
  themeToggle.textContent = "☀️";
}


const getAndShowUserData = async () => {
  const username = input.value.trim();

  errorMessage.classList.add("hidden");

  if (!username) {
    errorMessage.textContent = "Please enter username";
    errorMessage.classList.remove("hidden");
    return;
  }

  try {
    searchButton.disabled = true
    searchButton.textContent = "Loading"
    const response = await fetch(`${baseUrl}/${username}`);

    if (response.status === 404) {
      errorMessage.textContent = "User not found";
      errorMessage.classList.remove("hidden");
      userCard.classList.add("hidden")
      searchButton.disabled = false
      searchButton.textContent = "Search"

      return;
    }

    if (response.status === 403) {
      errorMessage.textContent = "GitHub API limit exceeded";
      errorMessage.classList.remove("hidden");
      userCard.classList.add("hidden")
      searchButton.disabled = false
      searchButton.textContent = "Search"

      return;
    }

    const data = await response.json();
    userCard.classList.remove("hidden")
    searchButton.disabled = false
    searchButton.textContent = "Search"



    userAvatar.src = data.avatar_url;
    userFullname.textContent = data.name || "No name";
    userName.textContent = data.login;
    repositories.textContent = data.public_repos;
    followers.textContent = data.followers;
    following.textContent = data.following;
    pageLink.href = data.html_url;
    bio.textContent = data.bio || ""
    userLocation.textContent = data.location || ""

    getAndShowRepos(username)


  } catch (error) {
    errorMessage.textContent = "Something went wrong";
    errorMessage.classList.remove("hidden");
    userCard.classList.add("hidden")
    searchButton.disabled = false
    searchButton.textContent = "Search"
  }
};

const getAndShowRepos = async(username) => {
  try{
    const response = await fetch(`${baseUrl}/${username}/repos?sort=updated`)
    const repos = await response.json()

    repository.innerHTML = ""
    reposList.innerHTML = ""

    if(repos.length === 0){
      reposList.innerHTML = "<li>No public repositories found.</li>"
    }

    repos.slice(0.5).forEach(repo => {
      repository.innerHTML = "repository:"
      const li = document.createElement("li")
      li.innerHTML = 
      `
       <div class="repo-item">
          <strong>${repo.name}</strong><br>
          <span>Language: ${repo.language || "N/A"}</span> | 
          <span>⭐ ${repo.stargazers_count}</span> | 
          <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        </div>
        <hr>
      `;
      reposList.appendChild(li)
    })
  }catch(error){
   reposList.innerHTML = "<li>Error fetching repos</li>"
  }
}

searchButton.addEventListener("click", getAndShowUserData);
input.addEventListener("keydown",(e) =>{
  if(e.key === "Enter"){
    getAndShowUserData()
  }
})



themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});
