document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md', 'bg-surface/90');
            navbar.classList.remove('bg-surface/70');
        } else {
            navbar.classList.remove('shadow-md', 'bg-surface/90');
            navbar.classList.add('bg-surface/70');
        }
    });

    // 2. Intersection Observer for Fade-in Animations
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

    // Apply animation classes to sections and observe them
    const sections = document.querySelectorAll('section, footer');
    sections.forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });

    // 3. Interactive Buttons Example (Cart & Account)
    const cartButtons = document.querySelectorAll('button:has(span:contains("shopping_cart"))');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Simple animation on click
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
                alert('Shopping cart opened!');
            }, 150);
        });
    });

    // Helper for :contains selector replacement since CSS doesn't support it natively
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
            btn.addEventListener('click', () => {
                if (icon.textContent.includes('shopping_cart')) {
                    alert('Shopping cart opened!');
                } else if (icon.textContent.includes('person')) {
                    alert('Account page opened!');
                } else if (icon.textContent.includes('send')) {
                    alert('Thank you for subscribing to our newsletter!');
                }
            });
        }
    });
});
