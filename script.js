const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible'); // ← permet de re-cacher si on remonte
    }
  });
}


window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


const hamburger = document.querySelector('.hamburger');
const hamburgerIcon = hamburger.querySelector('i');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');

  // Toggle icône Font Awesome
  if (nav.classList.contains('open')) {
    hamburgerIcon.classList.remove('fa-bars');
    hamburgerIcon.classList.add('fa-xmark');
  } else {
    hamburgerIcon.classList.remove('fa-xmark');
    hamburgerIcon.classList.add('fa-bars');
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburgerIcon.classList.remove('fa-xmark');
    hamburgerIcon.classList.add('fa-bars');
  });
});
