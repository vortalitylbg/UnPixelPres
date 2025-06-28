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
