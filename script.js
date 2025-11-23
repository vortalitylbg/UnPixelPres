// ==================== LOADING SCREEN - REMOVED ====================

// ==================== SMOOTH SCROLL WITH LENIS ====================
// This will be initialized in lenis.js

// ==================== BURGER MENU ====================
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.querySelector('.overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    // Gestion du clic sur le burger
    burger.addEventListener('click', function(e) {
        e.stopPropagation();
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



// ==================== PORTFOLIO MODAL ====================
document.addEventListener('DOMContentLoaded', function() {
    // Portfolio modal functionality
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modalClose = document.getElementById('custom-modal-close');
    const seeMoreButtons = document.querySelectorAll('#portfolio .see-more-button');
    
    // Check if modal elements exist
    if (!modalOverlay || !modalClose) {
        console.warn("Modal elements not found in DOM");
        return;
    }

    // Open modal when clicking "Voir plus" buttons
    seeMoreButtons.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.project-card');
            if (!card) return;

            const title = card.querySelector('.project-title')?.textContent || '';
            const description = card.querySelector('.project-description')?.textContent || '';
            const image = card.querySelector('img')?.src || '';
            const projectLink = card.querySelector('a')?.href || '#';

            const modalTitle = document.getElementById('custom-modal-title');
            const modalDescription = document.getElementById('custom-modal-description');
            const modalImage = document.getElementById('custom-modal-image');
            const modalLink = document.getElementById('custom-modal-link');

            if (modalTitle) modalTitle.textContent = title;
            if (modalDescription) modalDescription.textContent = description;
            if (modalImage) modalImage.src = image;
            if (modalLink) {
                modalLink.href = projectLink;
                modalLink.onclick = function(e) {
                    window.open(projectLink, '_blank');
                    return false;
                };
            }

            modalOverlay.classList.remove('modal-hidden');
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking close button
    modalClose.addEventListener('click', () => {
        closeModal();
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'custom-modal-overlay') {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalOverlay.classList.add('modal-hidden');
        }, 300);
    }
});

// ==================== GSAP ANIMATIONS ====================
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Parallax effect on hero image
    const parallaxImage = document.querySelector('.parallax-image');
    if (parallaxImage) {
        gsap.to('.parallax-image', {
            y: 100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // ==================== ANIMATIONS DÉSACTIVÉES ====================
    // Toutes les animations ScrollTrigger des cartes ont été désactivées
    // pour diagnostiquer le problème de disparition des éléments

    // // Animate about cards with stagger
    // const aboutCards = document.querySelectorAll('.about-card');
    // if (aboutCards.length > 0) {
    //     gsap.from('.about-card', {
    //         scrollTrigger: {
    //             trigger: '.about',
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         y: 50,
    //         opacity: 0,
    //         duration: 0.8,
    //         stagger: 0.2,
    //         ease: 'power3.out'
    //     });
    // }

    // // Animate service cards
    // const serviceCards = document.querySelectorAll('.card');
    // if (serviceCards.length > 0) {
    //     gsap.from('.card', {
    //         scrollTrigger: {
    //             trigger: '.services-grid',
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         y: 60,
    //         opacity: 0,
    //         duration: 1,
    //         stagger: 0.15,
    //         ease: 'power3.out'
    //     });
    // }

    // // Animate timeline steps
    // const timelineSteps = document.querySelectorAll('.timeline-step');
    // if (timelineSteps.length > 0) {
    //     gsap.from('.timeline-step', {
    //         scrollTrigger: {
    //             trigger: '.timeline',
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         x: (index) => index % 2 === 0 ? -100 : 100,
    //         opacity: 0,
    //         duration: 0.8,
    //         stagger: 0.2,
    //         ease: 'power3.out'
    //     });
    // }

    // // Animate pricing cards
    // const pricingCards = document.querySelectorAll('.card-tarif');
    // if (pricingCards.length > 0) {
    //     gsap.from('.card-tarif', {
    //         scrollTrigger: {
    //             trigger: '.tarifs-container',
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         y: 80,
    //         opacity: 0,
    //         duration: 1,
    //         stagger: 0.2,
    //         ease: 'power3.out'
    //     });
    // }

    // // Animate portfolio cards
    // const projectCards = document.querySelectorAll('.project-card');
    // if (projectCards.length > 0) {
    //     gsap.from('.project-card', {
    //         scrollTrigger: {
    //             trigger: '.projects-grid',
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         scale: 0.8,
    //         opacity: 0,
    //         duration: 0.8,
    //         stagger: 0.15,
    //         ease: 'back.out(1.4)'
    //     });
    // }

    // // Counter animation for numbers
    // const counters = document.querySelectorAll('.counter');
    // counters.forEach(counter => {
    //     gsap.from(counter, {
    //         scrollTrigger: {
    //             trigger: counter,
    //             start: 'top 70%',
    //             end: 'bottom 20%',
    //             toggleActions: 'play none none reverse'
    //         },
    //         textContent: 0,
    //         duration: 2,
    //         ease: 'power1.out',
    //         snap: { textContent: 1 },
    //         stagger: 1
    //     });
    // });
}

// ==================== MAGNETIC BUTTONS ====================
if (typeof gsap !== 'undefined') {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.08,
                y: y * 0.08,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ==================== CURSOR EFFECT (Optional) ====================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.classList.add('cursor-follower');
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .card, .project-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// ==================== SCROLL PROGRESS INDICATOR ====================
const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ==================== ANIMATED COUNTERS ====================
// Counter animation is now handled by GSAP ScrollTrigger in initAnimations()
// Removed duplicate Intersection Observer implementation to avoid conflicts

// ==================== 3D TILT EFFECT ON CARDS ====================
if (typeof VanillaTilt !== 'undefined') {
    // Apply tilt to service cards - reduced effect
    VanillaTilt.init(document.querySelectorAll('.card'), {
        max: 8,
        speed: 2000,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02,
        transition: false
    });
    
    // Apply tilt to stat items - reduced effect
    VanillaTilt.init(document.querySelectorAll('.stat-item'), {
        max: 5,
        speed: 2000,
        glare: true,
        'max-glare': 0.1,
        transition: false
    });
    
    // Apply tilt to portfolio cards - reduced effect
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 6,
        speed: 2000,
        glare: true,
        'max-glare': 0.12,
        scale: 1.01,
        transition: false
    });
    
    // Apply tilt to pricing cards - very subtle effect for professional look
    VanillaTilt.init(document.querySelectorAll('.card-tarif'), {
        max: 3,
        speed: 2000,
        glare: true,
        'max-glare': 0.08,
        scale: 1.005,
        transition: false
    });
}

// ==================== PARALLAX MOUSE MOVEMENT ====================
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ==================== SMOOTH REVEAL ON SCROLL ====================
const revealElements = document.querySelectorAll('.about-card, .card, .timeline-step, .project-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ==================== BACK TO TOP BUTTON ====================
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== NAVBAR HIDE/SHOW ON SCROLL ====================
const headerElement = document.querySelector('header');

if (headerElement) {
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            headerElement.classList.add('nav-hidden');
        } else {
            // Scrolling up
            headerElement.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

// ==================== SCROLL INDICATOR ====================
const scrollIndicator = document.getElementById('scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ==================== TEXT HIGHLIGHT ANIMATION ====================
const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.highlight-text').forEach(el => {
    highlightObserver.observe(el);
});

// ==================== ENHANCED CARD INTERACTIONS ====================
const cards = document.querySelectorAll('.card, .project-card, .about-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ==================== SMOOTH SCROLL FOR ALL ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or modal triggers
        if (href === '#' || this.classList.contains('modal-trigger')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ENHANCED BUTTON RIPPLE EFFECT ====================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ==================== UTILITY FUNCTIONS ====================

// Add shake animation to element
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Add pulse animation to element
function pulseElement(element) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, 2000);
}

// Add bounce animation to element
function bounceElement(element) {
    element.classList.add('bounce');
    setTimeout(() => {
        element.classList.remove('bounce');
    }, 1000);
}

// Show notification toast
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 16px 24px;
        background: ${type === 'success' ? '#00C48C' : type === 'error' ? '#FF66C4' : '#0077FF'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        font-weight: 600;
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Smooth scroll to element
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== ENHANCED FORM VALIDATION ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            shakeElement(input);
            input.style.borderColor = '#FF66C4';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
        
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            shakeElement(input);
            input.style.borderColor = '#FF66C4';
            isValid = false;
        }
    });
    
    return isValid;
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copié dans le presse-papier!', 'success', 2000);
        }).catch(() => {
            showToast('Erreur lors de la copie', 'error', 2000);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Copié dans le presse-papier!', 'success', 2000);
        } catch (err) {
            showToast('Erreur lors de la copie', 'error', 2000);
        }
        document.body.removeChild(textarea);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search (if exists)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.focus();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show, .modal-visible');
        modals.forEach(modal => {
            modal.classList.remove('show', 'modal-visible');
        });
    }
    
    // Ctrl/Cmd + Home: Scroll to top
    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ==================== PERFORMANCE MONITORING ====================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('📊 Performance Metrics:');
            console.log(`   Page Load Time: ${pageLoadTime}ms`);
            console.log(`   Connect Time: ${connectTime}ms`);
            console.log(`   Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// ==================== INITIALIZE ALL ANIMATIONS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations
    if (typeof gsap !== 'undefined') {
        initAnimations();
    }
    
    console.log('✨ All animations initialized successfully!');
    console.log('🚀 Website ready!');
});
