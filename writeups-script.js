document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const writeupCards = document.querySelectorAll('.writeup-card');
    const noResults = document.getElementById('noResults');

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            filterCards(filter);
        });
    });

    // Search functionality
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCards('all', searchTerm);
    });

    function filterCards(category, searchTerm = '') {
        let visibleCount = 0;

        writeupCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category').split(' ');
            const cardText = card.textContent.toLowerCase();

            let matches = category === 'all' || cardCategories.includes(category);
            matches = matches && (searchTerm === '' || cardText.includes(searchTerm));

            if (matches) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hexElements = document.querySelectorAll('.hex');
        
        hexElements.forEach((el, index) => {
            el.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px)`;
        });
    });

    // Add scroll animations
    observeCards();
});

function observeCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
    });

    document.querySelectorAll('.writeup-card:not(.coming-soon)').forEach(card => {
        observer.observe(card);
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .writeup-card {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);
