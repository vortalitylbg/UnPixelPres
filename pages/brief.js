const steps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.next-btn');
const form = document.getElementById('form');
const confirmation = document.getElementById('confirmation');
const progressCount = document.getElementById('progress-count');

let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  progressCount.textContent = index + 1;
}

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = new FormData(form);
  fetch(form.action, {
    method: "POST",
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      form.style.display = "none";
      confirmation.style.display = "block";
    } else {
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  });
});

showStep(currentStep);
