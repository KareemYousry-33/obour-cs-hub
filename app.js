/**
 * ObourCS Hub Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elegant glow effect following mouse cursor over glass cards
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // This can be used in CSS via background radial-gradient for a glowing spot effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log("Welcome to ObourCS Hub! Crafted for CS Students.");

    // Generate floating space icons
    const iconsContainer = document.querySelector('.background-elements');
    const spaceIcons = ['🚀', '🛸', '⭐', '🌌', '🪐', '💻', '👨‍💻', '✨', '⚡', '🌙'];
    const numIcons = 25;

    for (let i = 0; i < numIcons; i++) {
        const icon = document.createElement('div');
        icon.classList.add('space-icon');
        icon.innerText = spaceIcons[Math.floor(Math.random() * spaceIcons.length)];

        // Randomize position, size, and animation
        const leftPos = Math.random() * 100;
        const size = Math.random() * 20 + 10; // 10px to 30px
        const duration = Math.random() * 25 + 15; // 15s to 40s
        const delay = Math.random() * 20;

        icon.style.left = `${leftPos}vw`;
        icon.style.fontSize = `${size}px`;
        icon.style.animationDuration = `${duration}s`;
        icon.style.animationDelay = `-${delay}s`;

        iconsContainer.appendChild(icon);
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});
