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
        cursorDot.style.width = '60px';
        cursorDot.style.height = '60px';
    });
    link.addEventListener('mouseleave', () => {
        cursorDot.style.width = '20px';
        cursorDot.style.height = '20px';
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
