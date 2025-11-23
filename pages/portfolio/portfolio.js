document.addEventListener('DOMContentLoaded', function() {
    const projets = [
        {
            titre: "Créacouture",
            image: "https://unpixelpres.fr/images/portfolio/portfolio-creacouture.png",
            description: "Site web vitrine de vente de cours de couture factice. Ce site me permet de vous présenter mes compétences en web design.",
            lien: "https://vortalitylbg.github.io/CreaCouture",
        },
        {
            titre: "Un Pixel Près",
            image: "https://unpixelpres.fr/images/portfolio/portfolio-UPP.png",
            description: "Ceci est la description du site sur lequel vous vous trouvez actuellement et dont vous pouvez totalement vous inspirer afin de créer votre propre site grâce à mes services",
            lien: "https://unpixelpres.fr",
        },
        {
            titre: "Un Pixel Près (ancienne version)",
            image: "https://unpixelpres.fr/images/portfolio/portfolio-UPP-last.png",
            description: "Ceci est la description de l’ancienne version du site sur lequel vous vous trouvez actuellement et dont vous pouvez totalement vous inspirer afin de créer votre propre site grâce à mes services",
            lien: "https://vortalitylbg.github.io/UPP-Tests",
        },
        {
            titre: "Bac à Marée",
            image: "https://unpixelpres.fr/images/portfolio/portfolio-BAM.png",
            description: "Ceci est la description de l’ancienne version du site sur lequel vous vous trouvez actuellement et dont vous pouvez totalement vous inspirer afin de créer votre propre site grâce à mes services",
            lien: "https://vortalitylbg.github.io/Projet_bac_a_maree",
        }
    ];

    function tronquerTexte(text, maxLength) {
        if (text.length <= maxLength) return text;

        let truncated = text.slice(0, maxLength);
        if (text[maxLength] !== ' ') {
            truncated = truncated.slice(0, truncated.lastIndexOf(' '));
        }

        return truncated + '...';
    }

    const container = document.getElementById('portfolio-container');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    // Vérification que les éléments existent
    if (!container || !modalOverlay || !modalClose) {
        console.error("Éléments introuvables dans le DOM");
        return;
    }

    // Création des cartes de projet
    projets.forEach((projet) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const descriptionTronquee = tronquerTexte(projet.description, 130);

        card.innerHTML = `
            <div class="project-image">
                <img src="${projet.image}" alt="${projet.titre}">
            </div>
            <div class="project-content">
                <h3 class="project-title">${projet.titre}</h3>
                <p class="project-description">${descriptionTronquee}</p>
                <a href="#" class="see-more">
                    <div class="see-more-button">Voir plus</div>
                </a>
            </div>
        `;

        card.querySelector('.see-more').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modal-title').textContent = projet.titre;
            document.getElementById('modal-image').src = projet.image;
            document.getElementById('modal-description').textContent = projet.description;
            document.getElementById('modal-link').href = 'https://unpixelpres.fr';
            modalOverlay.classList.remove('modal-hidden');
        });

        container.appendChild(card);
    });

    // Gestionnaires d'événements pour fermer le modal
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.add('modal-hidden');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('modal-hidden');
        }
    });

    // Empêcher la fermeture quand on clique dans le modal
    document.getElementById('modal').addEventListener('click', (e) => {
        e.stopPropagation();
    });
});