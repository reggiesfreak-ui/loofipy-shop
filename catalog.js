document.addEventListener('DOMContentLoaded', () => {
    // 1. Search Functionality
    const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.grid > .group');
            productCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 2. Category Filters Active State
    const categoryButtons = document.querySelectorAll('aside ul li button');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes from all buttons
            categoryButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
                b.classList.add('text-on-surface-variant');
            });
            // Add active classes to clicked button
            btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
            btn.classList.remove('text-on-surface-variant');
            
            // Dummy filter effect (just visual feedback for prototype)
            const categoryName = btn.querySelector('span:last-child')?.previousSibling?.textContent?.trim() || 'Products';
            // Alert omitted to avoid annoyance, but we could filter DOM elements here
        });
    });

    // 3. Price Range Slider Update
    const priceSlider = document.querySelector('input[type="range"]');
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            // If there's an element showing the current price, update it
            // For now, it just demonstrates the event binding
            const priceDisplays = e.target.parentElement.querySelectorAll('.flex.justify-between span');
            if (priceDisplays.length >= 2) {
                // E.g., showing dynamic max price
                const value = e.target.value;
                priceDisplays[1].textContent = `$${Math.floor(parseInt(value) * 1.5)}`;
            }
        });
    }

    // 4. Sort Dropdown
    const sortSelect = document.querySelector('select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            console.log('Sorting by:', e.target.value);
            // In a real app, this would re-order the grid items
        });
    }

    // 5. Add to Cart / Customize Buttons
    const actionButtons = document.querySelectorAll('.grid .group button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
                const productName = btn.closest('.group').querySelector('h3').textContent;
                alert(`Added ${productName} to your cart!`);
            }, 150);
        });
    });

    // 6. Intersection Observer for Fade-in Animations (similar to home)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const productCards = document.querySelectorAll('.grid > .group');
    productCards.forEach((card, index) => {
        card.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
        // Add staggered delay based on index
        card.style.transitionDelay = `${index * 50}ms`;
        observer.observe(card);
    });
});
