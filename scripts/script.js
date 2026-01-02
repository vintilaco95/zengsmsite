// Modern Interactive Website Script - 2025

// ===============================
// Navigation Scroll Effect
// ===============================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===============================
// Mobile Menu Toggle
// ===============================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

function toggleMenu() {
    const isActive = navMenu.classList.contains('active');
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (!isActive) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
}

function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.style.overflow = '';
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside (on overlay/background)
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize if it exceeds breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ===============================
// Smooth Scroll for Navigation Links
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===============================
// Active Navigation Link on Scroll
// ===============================
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===============================
// Animated Counter for Statistics
// ===============================
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Intersection Observer for Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

statNumbers.forEach(stat => statObserver.observe(stat));

// ===============================
// Parallax Effect for 3D Phone
// ===============================
const phoneModel = document.querySelector('.phone-model');

if (phoneModel) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        phoneModel.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateY(-20px)`;
    });
}

// ===============================
// Scroll Reveal Animation
// ===============================
const revealElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .feature-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

// ===============================
// Service Cards 3D Tilt Effect
// ===============================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===============================
// Gallery Image Modal Effect
// ===============================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        item.style.transition = 'transform 0.3s ease';
        item.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 300);
    });
});

// ===============================
// Contact Form Handling
// ===============================
// NOTĂ: Handler-ul pentru submit a fost mutat în contact-form.js (EmailJS integration)
// Păstrăm doar animațiile pentru UX

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    // Form Input Animation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateX(5px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateX(0)';
        });
    });
}

// ===============================
// Cursor Trail Effect (Desktop Only)
// ===============================
if (window.innerWidth > 768) {
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease;
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    `;
    document.body.appendChild(cursorDot);
    
    const cursorRing = document.createElement('div');
    cursorRing.style.cssText = `
        position: fixed;
        width: 32px;
        height: 32px;
        border: 2px solid rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease;
    `;
    document.body.appendChild(cursorRing);
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        cursorRing.style.left = (ringX - 16) + 'px';
        cursorRing.style.top = (ringY - 16) + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interaction with clickable elements
    const clickableElements = document.querySelectorAll('a, button, .service-card, .gallery-item');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(1.5)';
            cursorRing.style.width = '48px';
            cursorRing.style.height = '48px';
            cursorRing.style.left = (ringX - 24) + 'px';
            cursorRing.style.top = (ringY - 24) + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorRing.style.width = '32px';
            cursorRing.style.height = '32px';
        });
    });
}

// ===============================
// Gradient Orbs Random Movement
// ===============================
const orbs = document.querySelectorAll('.gradient-orb');

orbs.forEach((orb, index) => {
    setInterval(() => {
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        const randomScale = 0.8 + Math.random() * 0.4;
        
        orb.style.transition = 'transform 10s ease-in-out';
        orb.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
    }, 10000 + index * 3000);
});

// ===============================
// Typing Effect for Hero Title
// ===============================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===============================
// Performance Optimization - Lazy Loading
// ===============================
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.src = element.dataset.lazy;
                element.removeAttribute('data-lazy');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(element => lazyObserver.observe(element));
}

// ===============================
// Initialize on Page Load
// ===============================
window.addEventListener('load', () => {
    // Remove any loading screens
    document.body.style.overflow = 'visible';
    
    // Trigger initial animations
    activateNavLink();
    
    console.log('%c🚀 Website Loaded Successfully! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;');
    console.log('%cDesigned with 💜 by AJUTOR TECHNOLOGIA - 2025', 'color: #667eea; font-size: 14px;');
});

// ===============================
// Page Visibility API - Pause Animations
// ===============================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when tab is not visible
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab is visible
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }
});
