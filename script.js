document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.querySelector('.overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    // Gestion du clic sur le burger
    burger.addEventListener('click', function(e) {
        e.stopPropagation(); // Empêche la fermeture immédiate
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fermer le menu quand on clique sur un lien
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Fermer le menu quand on clique sur l'overlay
    overlay.addEventListener('click', function() {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Empêcher la fermeture quand on clique dans le menu
    navLinks.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Fermer le menu si on redimensionne en desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialisation des éléments
    const modal = document.getElementById('portfolio-modal');
    const seeMoreButtons = document.querySelectorAll('.see-more');
    const closeButton = document.querySelector('.modal-close');
    
    // Vérification que les éléments existent
    if (!modal || seeMoreButtons.length === 0 || !closeButton) {
        console.error("Erreur: Éléments introuvables dans le DOM");
        return;
    }

    // 2. Données des projets (à personnaliser)
    const projectsData = {
        "projet1": {
            title: "Projet Favorite 1",
            image: "chemin/vers/image1.jpg",
            description: "Description détaillée du premier projet...",
            link: "https://lien-projet1.com"
        },
        "projet2": {
            title: "Projet Favorite 2",
            image: "chemin/vers/image2.jpg",
            description: "Description détaillée du deuxième projet...",
            link: "https://lien-projet2.com"
        },
        "projet3": {
            title: "Projet Favorite 3",
            image: "chemin/vers/image3.jpg",
            description: "Description détaillée du troisième projet...",
            link: "https://lien-projet3.com"
        }
    };

    // 3. Gestionnaire d'ouverture du modal
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupère l'ID du projet depuis la carte parente
            const projectId = this.closest('.project-card').dataset.project;
            const project = projectsData[projectId];
            
            if (project) {
                // Remplit le modal avec les données
                document.querySelector('.modal-title').textContent = project.title;
                document.querySelector('.modal-image').src = project.image;
                document.querySelector('.modal-image').alt = project.title;
                document.querySelector('.modal-description').textContent = project.description;
                document.querySelector('.modal-link').href = project.link;
                
                // Affiche le modal (méthode qui a fonctionné pour vous)
                modal.classList.add('modal-visible');
                
                // Empêche le défilement de la page en arrière-plan
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 4. Gestionnaire de fermeture
    closeButton.addEventListener('click', function() {
        modal.classList.remove('modal-visible');
        document.body.style.overflow = ''; // Rétablit le défilement
    });

    // Ferme le modal en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('modal-visible');
            document.body.style.overflow = '';
        }
    });

    // Ferme le modal avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-visible')) {
            modal.classList.remove('modal-visible');
            document.body.style.overflow = '';
        }
    });
});




document.querySelectorAll('#portfolio .see-more-button').forEach((btn, index) => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const card = btn.closest('.project-card');
    const title = card.querySelector('.project-title').textContent;
    const description = card.querySelector('.project-description').textContent;
    const image = card.querySelector('img').src;
    const link = card.querySelector('a').href || '#';

    document.getElementById('custom-modal-title').textContent = title;
    document.getElementById('custom-modal-description').textContent = description;
    document.getElementById('custom-modal-image').src = image;
    document.getElementById('custom-modal-link').href = link;

    const overlay = document.getElementById('custom-modal-overlay');
    overlay.classList.remove('modal-hidden');
    overlay.classList.add('show');
  });
});

document.getElementById('custom-modal-close').addEventListener('click', () => {
  const overlay = document.getElementById('custom-modal-overlay');
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.classList.add('modal-hidden');
  }, 300); // doit correspondre à la durée de la transition CSS
});

document.getElementById('custom-modal-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'custom-modal-overlay') {
    const overlay = document.getElementById('custom-modal-overlay');
    overlay.classList.remove('show');
    setTimeout(() => {
      overlay.classList.add('modal-hidden');
    }, 300);
  }
});
