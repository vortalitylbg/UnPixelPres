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
