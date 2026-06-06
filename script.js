// ============================================================================
// --- ENGINE 1: GLOBAL AMBIENT BACKDROP PARTICLES & SHOCKWAVES ---
// ============================================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let dustParticles = [];
let flashExplosions = [];

function resizeBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBackground);
resizeBackground();

class DustParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * bgCanvas.width;
        this.y = Math.random() * bgCanvas.height;
        this.size = Math.random() * 1.2 + 0.4;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y += this.speedY;
        if (this.y < 0) this.reset();
    }
    draw() {
        bgCtx.fillStyle = `rgba(255, 183, 0, ${this.alpha})`;
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fill();
    }
}

class ShockwaveSpark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 5 + 3;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.12;
        this.alpha -= this.decay;
    }
    draw() {
        bgCtx.fillStyle = `rgba(255, 210, 80, ${this.alpha})`;
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        bgCtx.fill();
    }
}

for (let i = 0; i < 60; i++) dustParticles.push(new DustParticle());

function runBackgroundLoop() {
    bgCtx.fillStyle = '#060502';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    const gradient = bgCtx.createRadialGradient(
        bgCanvas.width / 2, bgCanvas.height / 2, 100,
        bgCanvas.width / 2, bgCanvas.height / 2, bgCanvas.width
    );
    gradient.addColorStop(0, '#151005');
    gradient.addColorStop(1, '#060502');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    dustParticles.forEach(p => { p.update(); p.draw(); });

    for (let i = flashExplosions.length - 1; i >= 0; i--) {
        flashExplosions[i].update();
        if (flashExplosions[i].alpha <= 0) {
            flashExplosions.splice(i, 1);
        } else {
            flashExplosions[i].draw();
        }
    }
    requestAnimationFrame(runBackgroundLoop);
}
runBackgroundLoop();


// ============================================================================
// --- ENGINE 2: HERO BANNER AMBIENT LIGHTNING COILS ---
// ============================================================================
const hCanvas = document.getElementById('hero-lightning-canvas');
const hCtx = hCanvas.getContext('2d');

function syncHeroCanvasSize() {
    if (!hCanvas) return;
    hCanvas.width = hCanvas.offsetWidth;
    hCanvas.height = hCanvas.offsetHeight;
}
window.addEventListener('load', syncHeroCanvasSize);
window.addEventListener('resize', syncHeroCanvasSize);

function createLightningPath(x1, y1, x2, y2) {
    hCtx.strokeStyle = 'rgba(255, 240, 180, 0.9)';
    hCtx.shadowColor = '#ffb700';
    hCtx.shadowBlur = 10;
    hCtx.lineWidth = Math.random() * 1.5 + 1;
    const segments = 4;
    hCtx.beginPath();
    hCtx.moveTo(x1, y1);
    for (let i = 1; i <= segments; i++) {
        const ratio = i / segments;
        const tx = x1 + (x2 - x1) * ratio;
        const ty = y1 + (y2 - y1) * ratio;
        const dx = (Math.random() - 0.5) * 15;
        const dy = (Math.random() - 0.5) * 15;
        hCtx.lineTo(i === segments ? x2 : tx + dx, i === segments ? y2 : ty + dy);
    }
    hCtx.stroke();
}

function runHeroLightningEngine() {
    if (!hCanvas) return;
    hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
    hCtx.shadowBlur = 0;
    if (Math.random() < 0.05) {
        const rx = Math.random() * hCanvas.width;
        createLightningPath(rx, 0, rx + (Math.random() - 0.5) * 60, hCanvas.height);
    }
    requestAnimationFrame(runHeroLightningEngine);
}
if (hCanvas) runHeroLightningEngine();


// ============================================================================
// --- ENGINE 3: PROFILE MODAL FIRESTONE PARTICLES ---
// ============================================================================
const fCanvas = document.getElementById('firestone-canvas');
const fCtx = fCanvas.getContext('2d');
let firestones = [];

function resizeFirestoneCanvas() {
    if (!fCanvas) return;
    fCanvas.width = window.innerWidth;
    fCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeFirestoneCanvas);
resizeFirestoneCanvas();

class FirestoneParticle {
    constructor(x, y, speedMod = 1) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 5 + 4) * speedMod;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 4 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = Math.random() > 0.35 ? '255, 174, 0' : '255, 230, 100';
    }
    update(isExplosion = false) {
        this.x += this.vx;
        this.y += this.vy;
        if (!isExplosion) {
            // Profile card upward ambient float behavior
            this.vx = (Math.random() - 0.5) * 3.5;
            this.vy = -(Math.random() * 3.5 + 2);
        } else {
            // Outward shockwave atmospheric drag behavior
            this.vx *= 0.95;
            this.vy *= 0.95;
        }
        this.alpha -= this.decay;
    }
    draw(ctxTarget) {
        ctxTarget.save();
        ctxTarget.globalCompositeOperation = 'screen';
        ctxTarget.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctxTarget.shadowBlur = 12;
        ctxTarget.shadowColor = `rgba(${this.color}, 1)`;
        ctxTarget.beginPath();
        ctxTarget.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxTarget.fill();
        ctxTarget.restore();
    }
}

function runFirestoneLoop() {
    if (!fCanvas) return;
    fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

    const profileModal = document.getElementById('profile-modal');
    const isModalVisible = profileModal && profileModal.classList.contains('active');

    if (isModalVisible) {
        const modalBox = document.querySelector('.profile-central-card').getBoundingClientRect();
        if (Math.random() < 0.65) {
            firestones.push(new FirestoneParticle(modalBox.left + Math.random() * modalBox.width, modalBox.top + modalBox.height - 5));
        }
        if (Math.random() < 0.3) {
            firestones.push(new FirestoneParticle(modalBox.left + (Math.random() > 0.5 ? 0 : modalBox.width), modalBox.top + Math.random() * modalBox.height));
        }
    }

    for (let i = firestones.length - 1; i >= 0; i--) {
        firestones[i].update(false);
        if (firestones[i].alpha <= 0) {
            firestones.splice(i, 1);
        } else {
            firestones[i].draw(fCtx);
        }
    }
    requestAnimationFrame(runFirestoneLoop);
}
if (fCanvas) runFirestoneLoop();


// ============================================================================
// --- ENGINE 4: EDUCATION/CAREER PATH FIREFLASH SYSTEM ---
// ============================================================================
const eduCanvas = document.getElementById('edu-fireflash-canvas');
const eduCtx = eduCanvas.getContext('2d');
let eduFlakes = [];

function syncEduCanvas() {
    if (!eduCanvas) return;
    eduCanvas.width = window.innerWidth;
    eduCanvas.height = window.innerHeight;
}
window.addEventListener('resize', syncEduCanvas);
syncEduCanvas();

function runEduCanvasLoop() {
    if (!eduCanvas) return;
    eduCtx.clearRect(0, 0, eduCanvas.width, eduCanvas.height);
    for (let i = eduFlakes.length - 1; i >= 0; i--) {
        eduFlakes[i].update(true); // uses the shockwave movement profile
        if (eduFlakes[i].alpha <= 0) {
            eduFlakes.splice(i, 1);
        } else {
            eduFlakes[i].draw(eduCtx);
        }
    }
    requestAnimationFrame(runEduCanvasLoop);
}
if (eduCanvas) runEduCanvasLoop();


// ============================================================================
// --- ENGINE 5: UNIFIED INTERACTIVITY & ROUTING CONTROLLER ---
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Welcome Screen Mechanics
    const welcomeScreen = document.getElementById("welcome-screen");
    const welcomeBtn = document.getElementById("welcome-btn");
    const flashOverlay = document.getElementById("flash-overlay");
    const structuralSections = document.querySelectorAll("section");

    // Profile Modal elements
    const heroBanner = document.getElementById("hero-trigger-box");
    const profileModal = document.getElementById("profile-modal");
    const closeModal = document.getElementById("close-modal");

    // Education System elements
    const eduCards = document.querySelectorAll('.edu-card');
    const eduOverlay = document.getElementById('edu-details-overlay');
    const eduModalCards = document.querySelectorAll('.edu-details-card');
    const closeEduBtns = document.querySelectorAll('.close-edu-modal');

    // Skills Node elements
    const skillsZone = document.getElementById("skills-unlock-zone");
    const statusTip = document.querySelector(".skills-hint");
    const darkCover = document.createElement("div");
    darkCover.className = "skills-dark-backdrop";
    document.body.appendChild(darkCover);

    // Dynamic Viewport Reveal Logic
    const revealSettings = { root: null, threshold: 0.12 };
    const intersectionHandler = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    };
    const sectionObserver = new IntersectionObserver(intersectionHandler, revealSettings);

    // Initial Splash Interaction
    if (welcomeBtn) {
        welcomeBtn.addEventListener("click", () => {
            if (flashOverlay) flashOverlay.classList.add("flash-bang");
            const cX = window.innerWidth / 2;
            const cY = window.innerHeight / 2;
            for (let i = 0; i < 60; i++) {
                flashExplosions.push(new ShockwaveSpark(cX, cY));
            }
            welcomeBtn.style.opacity = "0";

            setTimeout(() => {
                if (welcomeScreen) {
                    welcomeScreen.style.opacity = "0";
                    welcomeScreen.style.visibility = "hidden";
                }
                document.body.classList.add("ready");
                setTimeout(() => {
                    structuralSections.forEach(sec => sectionObserver.observe(sec));
                }, 200);
            }, 450);
        });
    }

    // Profile Popup Logic
    if (heroBanner && profileModal) {
        heroBanner.addEventListener("click", () => {
            profileModal.classList.add("active");
            document.body.classList.add("page-blur-active");
        });
    }

    function dismissProfileModal() {
        if (profileModal) profileModal.classList.remove("active");
        document.body.classList.remove("page-blur-active");
        firestones = [];
    }

    if (closeModal) closeModal.addEventListener("click", (e) => { e.stopPropagation(); dismissProfileModal(); });
    if (profileModal) profileModal.addEventListener("click", (e) => { if (e.target === profileModal) dismissProfileModal(); });


    // --- CRITICAL ROUTING FOR EDUCATION MODALS ---
    eduCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const targetId = card.getAttribute('data-edu-target');
            const targetedModal = document.getElementById(targetId);

            if (targetedModal && eduOverlay) {
                // Ensure other active career windows are closed first
                eduModalCards.forEach(box => box.classList.remove('card-visible'));

                // Open overlay and toggle correct data card (NO BLUR EFFECT applied)
                eduOverlay.classList.add('edu-active');
                targetedModal.classList.add('card-visible');

                // Trigger Yellow Firestone Shockwave behind the display box
                const originX = e.clientX;
                const originY = e.clientY;
                for (let i = 0; i < 60; i++) {
                    eduFlakes.push(new FirestoneParticle(originX, originY, 1));
                }
                for(let j = 0; j < 30; j++) {
                    eduFlakes.push(new FirestoneParticle(originX, originY, 1.4));
                }
            }
        });
    });

    function dismissEduModals() {
        if (eduOverlay) eduOverlay.classList.remove('edu-active');
        eduModalCards.forEach(box => box.classList.remove('card-visible'));
        eduFlakes = [];
    }

    closeEduBtns.forEach(btn => btn.addEventListener('click', dismissEduModals));
    if (eduOverlay) {
        eduOverlay.addEventListener('click', (e) => { if (e.target === eduOverlay) dismissEduModals(); });
    }


    // Interactive Skills Matrix Engine
    if (skillsZone) {
        skillsZone.addEventListener("click", () => {
            const upcomingNode = skillsZone.querySelector(".skill-node.hidden-node");
            if (upcomingNode) {
                const targetCoordinates = upcomingNode.getBoundingClientRect();
                const dynamicClone = document.createElement("div");
                dynamicClone.className = "flying-skill-card";
                dynamicClone.textContent = upcomingNode.textContent;

                dynamicClone.style.left = `${targetCoordinates.left}px`;
                dynamicClone.style.top = `${targetCoordinates.top}px`;
                dynamicClone.style.width = `${targetCoordinates.width}px`;
                dynamicClone.style.height = `${targetCoordinates.height}px`;

                document.body.appendChild(dynamicClone);
                upcomingNode.classList.remove("hidden-node");
                upcomingNode.classList.add("ghost-state");

                requestAnimationFrame(() => {
                    darkCover.classList.add("active");
                    const innerWidthCenter = window.innerWidth / 2;
                    const innerHeightCenter = window.innerHeight / 2;
                    dynamicClone.style.left = `${innerWidthCenter - 110}px`;
                    dynamicClone.style.top = `${innerHeightCenter - 30}px`;
                    dynamicClone.style.width = "220px";
                    dynamicClone.style.height = "60px";
                    dynamicClone.style.transform = "scale(1.4)";
                });

                setTimeout(() => {
                    darkCover.classList.remove("active");
                    const renewedCoordinates = upcomingNode.getBoundingClientRect();
                    dynamicClone.style.transform = "scale(1)";
                    dynamicClone.style.left = `${renewedCoordinates.left}px`;
                    dynamicClone.style.top = `${renewedCoordinates.top}px`;
                    dynamicClone.style.width = `${renewedCoordinates.width}px`;
                    dynamicClone.style.height = `${renewedCoordinates.height}px`;

                    setTimeout(() => {
                        upcomingNode.classList.remove("ghost-state");
                        upcomingNode.classList.add("unlocked-node");
                        dynamicClone.remove();
                    }, 600);
                }, 1300);
            }
            const remainingHiddenNodes = skillsZone.querySelectorAll(".skill-node.hidden-node").length;
            if (remainingHiddenNodes === 0 && statusTip) {
                statusTip.textContent = "All capabilities initialized successfully.";
            }
        });
    }
});