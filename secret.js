// Custom Cursor Logic copied from main script so it handles the Crosshair over canvas nicely
const cursorDot = document.querySelector('.cursor-dot');
window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
});
document.addEventListener('mousedown', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
});
document.addEventListener('mouseup', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
});

const returnBtn = document.querySelector('.return-btn');
returnBtn.addEventListener('mouseenter', () => {
    cursorDot.style.width = '30px';
    cursorDot.style.height = '30px';
});
returnBtn.addEventListener('mouseleave', () => {
    cursorDot.style.width = '10px';
    cursorDot.style.height = '10px';
});

// Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

// Pre-render the banana emoji as an image to drastically improve canvas rendering performance
const preRenderedBanana = document.createElement('canvas');
preRenderedBanana.width = 120;
preRenderedBanana.height = 120;
const pctx = preRenderedBanana.getContext('2d');
pctx.font = '100px Arial';
pctx.textAlign = 'center';
pctx.textBaseline = 'middle';
pctx.fillText('🍌', 60, 60);

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

let score = 0;
const bananas = [];
const particles = [];
const MAX_BANANAS = 25; 

class Banana {
    constructor() {
        this.size = Math.random() * 30 + 40; 
        this.radius = this.size * 0.4; // Slightly smaller than half for tight hitbox
        this.mass = this.size;
        
        // Ensure they spawn randomly across the screen
        this.x = Math.random() * (width - this.size * 2) + this.size;
        this.y = Math.random() * (height - this.size * 2) + this.size; 
        
        // Zero gravity, constant bouncing speed in a random direction
        const speed = (Math.random() * 4 + 3) * 0.65;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed; 
        this.vy = Math.sin(angle) * speed; 
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;

        // Perfect elastic reflection on window borders
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > width - this.radius) {
            this.x = width - this.radius;
            this.vx *= -1;
        }
        
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > height - this.radius) {
            this.y = height - this.radius;
            this.vy *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        // Draw the pre-rendered image instead of slow native text-rendering
        ctx.drawImage(preRenderedBanana, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.05 + 0.02;
        this.size = Math.random() * 6 + 2;
        this.color = Math.random() > 0.5 ? '#FFEB3B' : '#FFF59D'; // Yellows
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vy += 0.2; // keep slight gravity on the particles!
    }

    draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function resolveCollision(b1, b2) {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = b1.radius + b2.radius;
    
    // Check if the bananas are colliding
    if (distance < minDistance) {
        // Resolve overlap so they don't stick to each other
        const overlap = minDistance - distance;
        const distToUse = distance === 0 ? 0.01 : distance;
        const nx = dx / distToUse;
        const ny = dy / distToUse;
        
        b1.x -= nx * (overlap / 2);
        b1.y -= ny * (overlap / 2);
        b2.x += nx * (overlap / 2);
        b2.y += ny * (overlap / 2);
        
        // Elastic collision math to transfer momentum
        const kx = b1.vx - b2.vx;
        const ky = b1.vy - b2.vy;
        
        const p = 2.0 * (nx * kx + ny * ky) / (b1.mass + b2.mass);
        
        b1.vx = b1.vx - p * b2.mass * nx;
        b1.vy = b1.vy - p * b2.mass * ny;
        b2.vx = b2.vx + p * b1.mass * nx;
        b2.vy = b2.vy + p * b1.mass * ny;
    }
}

function spawnBanana() {
    if (bananas.length < MAX_BANANAS) {
        bananas.push(new Banana());
    }
    // Random spawn rate between 300ms and 1200ms
    setTimeout(spawnBanana, Math.random() * 900 + 300);
}

// Removed expensive DOM click-ring layout thrashing to keep spam-clicking performant

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hit = false;
    for (let i = bananas.length - 1; i >= 0; i--) {
        const b = bananas[i];
        const dist = Math.hypot(mouseX - b.x, mouseY - b.y);
        
        if (dist < b.radius * 1.5) { // generous hit box
            bananas.splice(i, 1);
            score += 15;
            scoreDisplay.innerText = score.toString().padStart(4, '0');

            // Spawn explosive particles
            for(let p = 0; p < 25; p++) {
                particles.push(new Particle(b.x, b.y));
            }
            hit = true;
            break; // Destroy only one per click
        }
    }
});

function loop() {
    ctx.clearRect(0, 0, width, height);
    
    // Calculate Multi-Body Collisions
    for (let i = 0; i < bananas.length; i++) {
        for (let j = i + 1; j < bananas.length; j++) {
            resolveCollision(bananas[i], bananas[j]);
        }
    }

    for (let i = bananas.length - 1; i >= 0; i--) {
        bananas[i].update();
        bananas[i].draw();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(loop);
}

// Initialize
spawnBanana();
loop();
