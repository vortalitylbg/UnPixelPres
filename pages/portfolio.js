const projects = [
  {
    title: "Bac Marée | St Aubin La salle",
    image: "https://github.com/vortalitylbg/WebSurMesure/blob/main/images/sites_portfolio/bac_a_maree.png?raw=true",
    description: "Prototype d'un site web pour une micro-entreprise lycéenne engagée dans la collecte et la valorisation des déchets plastiques sauvages, dans le cadre d’un projet Bac en section euro plastique & composite.",
    link: "https://vortalitylbg.github.io/Projet_bac_a_maree/"
  },
  {
    title: "Exemple Site 1",
    image: "https://github.com/vortalitylbg/WebSurMesure/blob/main/images/sites_portfolio/temp.png?raw=true",
    description: "Pas encore de site pour cet emplacement.",
    link: "#"
  },
  {
    title: "Exemple Site 2",
    image: "https://github.com/vortalitylbg/WebSurMesure/blob/main/images/sites_portfolio/temp.png?raw=true",
    description: "Pas encore de site pour cet emplacement.",
    link: "#"
  },
  {
    title: "Exemple Site 3",
    image: "https://github.com/vortalitylbg/WebSurMesure/blob/main/images/sites_portfolio/temp.png?raw=true",
    description: "Pas encore de site pour cet emplacement.",
    link: "#"
  },
  {
    title: "Exemple Site 4",
    image: "https://github.com/vortalitylbg/WebSurMesure/blob/main/images/sites_portfolio/temp.png?raw=true",
    description: "Pas encore de site pour cet emplacement.",
    link: "#"
  }

];

function truncateDescription(text, maxLength = 90) {
  if (text.length <= maxLength) return text;

  // Coupe au dernier espace avant la limite
  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.slice(0, lastSpace) + ' <span class="see-more">Voir plus</span>';
}


function openModal(index) {
  const modal = document.getElementById("modal");
  document.getElementById("modal-img").src = projects[index].image;
  document.getElementById("modal-title").textContent = projects[index].title;
  document.getElementById("modal-description").textContent = projects[index].description;
  document.getElementById("modal-link").href = projects[index].link;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal();
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".project-card p").forEach((p) => {
    const fullText = p.textContent.trim();
    if (fullText.length > 90) {
      const short = fullText.slice(0, 90);
      const lastSpace = short.lastIndexOf(" ");
      const finalText = fullText.slice(0, lastSpace) + ' <span class="see-more">Voir plus</span>';
      p.innerHTML = finalText;
    }
  });
});

function generatePortfolioCards(containerSelector, modalEnabled = true) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(projects)) return;

  projects.forEach((project, index) => {
    const p = truncateDescription(project.description);
    const card = document.createElement("div");
    card.className = "project-card";
    if (modalEnabled) card.setAttribute("onclick", `openModal(${index})`);

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}">
      <h3>${project.title}</h3>
      <p>${p}</p>
    `;
    container.appendChild(card);
  });
}


function generatePortfolioCards(containerSelector, modalEnabled = true, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(projects)) return;

  const slice = limit ? projects.slice(0, limit) : projects;

  slice.forEach((project, index) => {
    const p = truncateDescription(project.description);
    const card = document.createElement("div");
    card.className = "project-card";
    if (modalEnabled) card.setAttribute("onclick", `openModal(${index})`);

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}">
      <h3>${project.title}</h3>
      <p>${p}</p>
    `;
    container.appendChild(card);
  });
}
