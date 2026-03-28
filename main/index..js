document.addEventListener('DOMContentLoaded', () => {
    // 1. SETUP ELEMENTS
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const dot = document.createElement('div');
    dot.className = 'custom-dot';
    document.body.appendChild(dot);

    const root = document.documentElement;
    let particles = [];
    const particleCount = 70;

    // 2. TRACK MOUSE (Glow + Custom Dot)
    window.addEventListener('mousemove', (e) => {
        if (dot.style.opacity !== "1") dot.style.opacity = "1";
        
        const posX = e.clientX;
        const posY = e.clientY;

        // Updates the CSS Radial Gradient Glow
        root.style.setProperty('--mouse-x', posX + 'px');
        root.style.setProperty('--mouse-y', posY + 'px');

        // Moves the Custom Dot
        dot.style.left = posX + 'px';
        dot.style.top = posY + 'px';
    });

    // 3. HOVER INTERACTION (Dot grows on links)
    const handleHover = () => {
        const targets = document.querySelectorAll('a, .project-card, .icons i, button, .skill-box, .facts span');
        targets.forEach(item => {
            item.addEventListener('mouseenter', () => dot.classList.add('dot-active'));
            item.addEventListener('mouseleave', () => dot.classList.remove('dot-active'));
        });
    };
    handleHover();

    // 4. SCROLL REVEAL (The part that was missing!)
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            threshold: 0.15 
        });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 5. STAGGERED DELAY FOR CARDS
    const projectCards = document.querySelectorAll('.project-card.reveal');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // 6. PARTICLE SYSTEM LOGIC
    if (canvas) {
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = 0.8 + Math.random() * 1.5;
                this.speedFactor = 0.1 + Math.random() * 0.4;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.baseY += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.baseY < 0) this.baseY = canvas.height;
                if (this.baseY > canvas.height) this.baseY = 0;
            }

            draw() {
                const scrollOffset = window.scrollY * this.speedFactor;
                let currentY = (this.baseY - scrollOffset) % canvas.height;
                if (currentY < 0) currentY += canvas.height;

                ctx.fillStyle = 'rgba(197, 121, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, currentY, this.size, 0, Math.PI * 2);
                ctx.fill();
                this.vY = currentY; 
            }
        }

        function init() {
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const d = Math.hypot(p.x - p2.x, p.vY - p2.vY);
                    if (d < 120) {
                        ctx.strokeStyle = `rgba(171, 146, 221, ${0.2 * (1 - d / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.vY);
                        ctx.lineTo(p2.x, p2.vY);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        init();
        animate();
    }
});