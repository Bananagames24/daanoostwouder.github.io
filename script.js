// Initialize AOS Animation Library
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Animate outline with a slight delay for fluid feel
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
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
const links = document.querySelectorAll('a, button, .project-card');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
    });
    link.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 17, 0.95)';
        navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
    } else {
        navbar.style.background = 'rgba(5, 5, 17, 0.7)';
        navbar.style.boxShadow = 'none';
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

// --- Dynamic Plant Background Generator ---
function generatePlants() {
    const heroBg = document.querySelector('.hero-bg');
    const plantCount = 15; // Number of plants to generate

    // SVG Paths for different plant types
    const plantTypes = [
        // 1. Simple Stem (Original)
        `<path d='M30 60 L 30 10' fill='none' stroke='#39ff14' stroke-width='1.5' stroke-linecap='round'/><path d='M30 50 Q 15 45 15 40 Q 30 35 30 40' fill='none' stroke='#39ff14' stroke-width='1.5'/><path d='M30 30 Q 15 25 15 20 Q 30 15 30 20' fill='none' stroke='#39ff14' stroke-width='1.5'/><path d='M30 40 Q 45 35 45 30 Q 30 25 30 30' fill='none' stroke='#39ff14' stroke-width='1.5'/><path d='M30 20 Q 45 15 45 10 Q 30 5 30 10' fill='none' stroke='#39ff14' stroke-width='1.5'/>`,

        // 2. Fern / Palm
        `<path d="M30 60 Q 30 30 30 10" fill="none" stroke="#39ff14" stroke-width="1.5"/><path d="M30 50 Q 10 40 10 30" fill="none" stroke="#39ff14" stroke-width="1.5"/><path d="M30 50 Q 50 40 50 30" fill="none" stroke="#39ff14" stroke-width="1.5"/><path d="M30 35 Q 15 25 15 15" fill="none" stroke="#39ff14" stroke-width="1.5"/><path d="M30 35 Q 45 25 45 15" fill="none" stroke="#39ff14" stroke-width="1.5"/>`,

        // 3. Monstera Leaf Outline
        `<path d="M30 60 Q30 40 30 25" stroke="#39ff14" stroke-width="1.5" fill="none"/><path d="M30 25 Q10 25 10 40 Q10 55 30 60" stroke="#39ff14" stroke-width="1.5" fill="none"/><path d="M30 25 Q50 25 50 40 Q50 55 30 60" stroke="#39ff14" stroke-width="1.5" fill="none"/><path d="M15 35 Q20 35 20 40" stroke="#39ff14" stroke-width="1.5" fill="none"/><path d="M45 35 Q40 35 40 40" stroke="#39ff14" stroke-width="1.5" fill="none"/>`,

        // 4. Vine / Wavy
        `<path d="M30 60 C 10 50 50 40 30 30 C 10 20 50 10 30 0" stroke="#39ff14" stroke-width="1.5" fill="none"/><circle cx="20" cy="45" r="3" stroke="#39ff14" stroke-width="1.5" fill="none"/><circle cx="40" cy="25" r="3" stroke="#39ff14" stroke-width="1.5" fill="none"/><circle cx="20" cy="10" r="3" stroke="#39ff14" stroke-width="1.5" fill="none"/>`
    ];

    for (let i = 0; i < plantCount; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 60 60");
        svg.classList.add('plant-bg');

        // Randomly select a plant type
        const typeIndex = Math.floor(Math.random() * plantTypes.length);
        svg.innerHTML = plantTypes[typeIndex];

        // Random positioning
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        // Random size
        const size = 50 + Math.random() * 100; // 50px to 150px

        // Random rotation
        const rotation = Math.random() * 360;

        // Apply styles
        svg.style.left = `${left}%`;
        svg.style.top = `${top}%`;
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.transform = `rotate(${rotation}deg)`;

        heroBg.appendChild(svg);
    }
}

// Run plant generation on load
document.addEventListener('DOMContentLoaded', generatePlants);
