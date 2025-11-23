// Brief Form Navigation & Animations
const sections = document.querySelectorAll('.form-section');
const nextBtn = document.getElementById('next-button');
const prevBtn = document.getElementById('prev-button');
const submitBtn = document.getElementById('submit-button');
const form = document.getElementById('brief-form');
const confirmation = document.getElementById('confirmation-message');
const progressFill = document.getElementById('progress-fill');
const progressSteps = document.querySelectorAll('.progress-step');

let currentSection = 0;
const totalSections = sections.length;

// Initialize
updateProgress();

// Next button
nextBtn.addEventListener('click', () => {
  if (validateCurrentSection()) {
    goToSection(currentSection + 1);
  }
});

// Previous button
prevBtn.addEventListener('click', () => {
  if (currentSection > 0) {
    goToSection(currentSection - 1);
  }
});

// Navigate to specific section
function goToSection(index) {
  // Remove active class from current section
  sections[currentSection].classList.remove('active');
  sections[currentSection].classList.add('fade-out');
  
  setTimeout(() => {
    sections[currentSection].classList.remove('fade-out');
    currentSection = index;
    
    // Add active class to new section
    sections[currentSection].classList.add('active');
    sections[currentSection].classList.add('fade-in');
    
    setTimeout(() => {
      sections[currentSection].classList.remove('fade-in');
    }, 500);
    
    updateProgress();
    updateButtons();
    
    // Scroll to top of form smoothly
    document.querySelector('.form-container').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 300);
}

// Validate current section
function validateCurrentSection() {
  const currentInputs = sections[currentSection].querySelectorAll('input, textarea, select');
  let isValid = true;
  
  currentInputs.forEach(input => {
    if (!input.checkValidity()) {
      input.reportValidity();
      isValid = false;
      
      // Add error animation
      input.classList.add('error-shake');
      setTimeout(() => {
        input.classList.remove('error-shake');
      }, 500);
      
      return false;
    }
  });
  
  return isValid;
}

// Update progress bar and steps
function updateProgress() {
  const progress = ((currentSection + 1) / totalSections) * 100;
  progressFill.style.width = `${progress}%`;
  
  // Update step indicators
  progressSteps.forEach((step, index) => {
    if (index < currentSection) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (index === currentSection) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
}

// Update navigation buttons
function updateButtons() {
  // Previous button
  if (currentSection === 0) {
    prevBtn.disabled = true;
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove('disabled');
  }
  
  // Next/Submit buttons
  if (currentSection === totalSections - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'flex';
  } else {
    nextBtn.style.display = 'flex';
    submitBtn.style.display = 'none';
  }
}

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateCurrentSection()) {
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Envoi en cours...</span><span class="btn-icon spinner"><i class="fas fa-spinner"></i></span>';
  
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      // Hide form and show confirmation
      form.style.display = 'none';
      document.querySelector('.progress-container').style.display = 'none';
      confirmation.style.display = 'block';
      confirmation.classList.add('fade-in');
      
      // Scroll to confirmation
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      throw new Error('Erreur lors de l\'envoi');
    }
  })
  .catch(error => {
    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Envoyer ma demande</span><span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
  });
});

// Add visual feedback for radio cards
document.querySelectorAll('.radio-card input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    // Remove selected class from siblings
    const siblings = this.closest('.radio-group').querySelectorAll('.radio-card');
    siblings.forEach(card => card.classList.remove('selected'));
    
    // Add selected class to parent
    if (this.checked) {
      this.closest('.radio-card').classList.add('selected');
    }
  });
});

// Add visual feedback for checkboxes
document.querySelectorAll('.checkbox-card input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    // Toggle selected class on parent
    if (this.checked) {
      this.closest('.checkbox-card').classList.add('selected');
    } else {
      this.closest('.checkbox-card').classList.remove('selected');
    }
  });
});

// Add visual feedback for inline radio buttons
document.querySelectorAll('.radio-inline input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    // Remove selected class from siblings
    const siblings = this.closest('.radio-group-inline').querySelectorAll('.radio-inline');
    siblings.forEach(label => label.classList.remove('selected'));
    
    // Add selected class to parent
    if (this.checked) {
      this.closest('.radio-inline').classList.add('selected');
    }
  });
});

// Add focus animations to inputs
document.querySelectorAll('input, textarea, select').forEach(input => {
  input.addEventListener('focus', function() {
    this.closest('.form-group')?.classList.add('focused');
  });
  
  input.addEventListener('blur', function() {
    this.closest('.form-group')?.classList.remove('focused');
    
    // Add filled class if has value
    if (this.value) {
      this.classList.add('filled');
    } else {
      this.classList.remove('filled');
    }
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Don't interfere when typing in inputs
  if (document.activeElement.tagName === 'INPUT' || 
      document.activeElement.tagName === 'TEXTAREA' || 
      document.activeElement.tagName === 'SELECT') {
    return;
  }
  
  // Arrow right or Enter: next
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    if (currentSection < totalSections - 1 && !nextBtn.disabled) {
      nextBtn.click();
    }
  }
  
  // Arrow left: previous
  if (e.key === 'ArrowLeft') {
    if (currentSection > 0) {
      prevBtn.click();
    }
  }
});

// Allow clicking on progress steps to navigate (only to completed steps)
progressSteps.forEach((step, index) => {
  step.addEventListener('click', () => {
    if (index < currentSection || step.classList.contains('completed')) {
      goToSection(index);
    }
  });
});

// Add entrance animation on page load
window.addEventListener('load', () => {
  document.querySelector('.brief-hero').classList.add('animate-in');
  document.querySelector('.progress-container').classList.add('animate-in');
  document.querySelector('.form-container').classList.add('animate-in');
});