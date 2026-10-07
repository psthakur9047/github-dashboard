const USER="psthakur9047";
const $=id=>document.getElementById(id);

function setAvatar(url){
  $("avatar").src=url; $("avatarTop").src=url;
}

async function loadProfile(){
  try{
    const r=await fetch(`https://api.github.com/users/${USER}`);
    if(!r.ok) throw new Error("GitHub API unavailable");
    const u=await r.json();
    $("name").textContent=u.name||USER;
    $("bio").textContent=u.bio||"Software Engineer • AI & Python Developer • Web Developer";
    $("repoCount").textContent=u.public_repos;
    $("followers").textContent=u.followers;
    $("following").textContent=u.following;
    $("mRepos").textContent=u.public_repos;
    $("mFollowers").textContent=u.followers;
    $("mFollowing").textContent=u.following;
    $("mGists").textContent=u.public_gists;
    setAvatar(u.avatar_url);
  }catch(e){
    setAvatar("https://github.com/"+USER+".png");
    ["repoCount","followers","following","mRepos","mFollowers","mFollowing","mGists"].forEach(x=>$(x).textContent="—");
  }
}

async function loadRepos(){
  const grid=$("repoGrid");
  try{
    const r=await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=12`);
    if(!r.ok) throw new Error();
    const repos=await r.json();
    renderRepos(repos);
  }catch(e){
    grid.innerHTML='<div class="loading">Repositories could not be loaded. <a href="https://github.com/psthakur9047?tab=repositories" target="_blank">Open GitHub ↗</a></div>';
  }
}
function renderRepos(repos){
  const grid=$("repoGrid");
  if(!repos.length){grid.innerHTML='<div class="loading">No public repositories found.</div>';return;}
  grid.innerHTML=repos.map(r=>`
    <article class="repo-card card" data-name="${(r.name+" "+(r.description||"")).toLowerCase()}">
      <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name} ↗</a></h3>
      <p>${r.description||"No description added yet."}</p>
      <div class="repo-meta">
        <span><i class="lang-dot"></i>${r.language||"Code"}</span>
        <span>★ ${r.stargazers_count}</span>
        <span>⑂ ${r.forks_count}</span>
      </div>
    </article>`).join("");
}
$("searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  document.querySelectorAll(".repo-card").forEach(c=>c.style.display=c.dataset.name.includes(q)?"block":"none");
});
$("themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  $("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
  localStorage.setItem("dashboard-theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("dashboard-theme")==="dark"){document.body.classList.add("dark");$("themeBtn").textContent="☀";}
$("year").textContent=new Date().getFullYear();
loadProfile(); loadRepos();
