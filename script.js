// Add smooth scrolling and active nav highlighting
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Animate elements on scroll
    observeElements();
});

// Intersection Observer for scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe featured cards and stat items
    document.querySelectorAll('.featured-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const elements = document.querySelectorAll('.bg-elements > div');
    
    elements.forEach((el, index) => {
        el.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px)`;
    });
});

// Add CSS class for animation
const style = document.createElement('style');
style.textContent = `
    .featured-card, .stat-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .featured-card.visible, .stat-item.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-links a.active {
        color: var(--primary);
    }
`;
document.head.appendChild(style);
