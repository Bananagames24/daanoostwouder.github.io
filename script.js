// Initialize AOS Animation Library
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
});

// Click Animation Effect
window.addEventListener('click', (e) => {
    const anim = document.createElement('div');
    anim.classList.add('click-anim');
    anim.style.left = `${e.clientX}px`;
    anim.style.top = `${e.clientY}px`;
    document.body.appendChild(anim);

    // Remove element after animation ends
    anim.addEventListener('animationend', () => {
        anim.remove();
    });
});

// Hover effect for links to grow cursor
const links = document.querySelectorAll('a, button, .project-card, .btn');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorDot.style.width = '30px';
        cursorDot.style.height = '30px';
    });
    link.addEventListener('mouseleave', () => {
        cursorDot.style.width = '10px';
        cursorDot.style.height = '10px';
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(3, 3, 3, 0.95)';
        navbar.style.borderBottom = '1px solid var(--border-color)';
    } else {
        navbar.style.background = 'rgba(3, 3, 3, 0.8)';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        }
    });
});

// Secret Easter Egg Trigger
let logoClicks = 0;
let lastClickTime = 0;
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastClickTime < 600) {
            logoClicks++;
        } else {
            logoClicks = 1;
        }
        lastClickTime = now;

        if (logoClicks >= 5) {
            window.location.href = 'secret.html';
        }
    });
}
