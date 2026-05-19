document.addEventListener('DOMContentLoaded', () => {
    // 1. Quantity Selector Logic
    const quantityContainer = document.querySelector('.flex.items-center.gap-4 .bg-surface-container-low');
    if (quantityContainer) {
        const minusBtn = quantityContainer.querySelector('button:first-child');
        const plusBtn = quantityContainer.querySelector('button:last-child');
        const quantityText = quantityContainer.querySelector('span');

        if (minusBtn && plusBtn && quantityText) {
            let quantity = 1;
            minusBtn.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantityText.textContent = quantity;
                }
            });
            plusBtn.addEventListener('click', () => {
                quantity++;
                quantityText.textContent = quantity;
            });
        }
    }

    // 2. Option/Variant Selection (Colors/Shapes)
    // Finding all option button groups (assuming they use a similar structure like rings or borders for selection)
    const optionGroups = document.querySelectorAll('.space-y-4 .flex.flex-wrap.gap-3');
    optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected state from all in this group
                buttons.forEach(b => {
                    b.classList.remove('ring-2', 'ring-primary', 'border-primary');
                    b.classList.add('border-outline-variant');
                });
                // Add selected state to clicked
                btn.classList.add('ring-2', 'ring-primary', 'border-primary');
                btn.classList.remove('border-outline-variant');
            });
        });
    });

    // 3. Image Gallery Switching
    const mainImageContainer = document.querySelector('.glass-card.ambient-glow img');
    const thumbnails = document.querySelectorAll('.grid.grid-cols-4.gap-4 img');
    
    if (mainImageContainer && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            // Make thumbnails clickable and give visual feedback
            thumb.parentElement.classList.add('cursor-pointer');
            
            thumb.parentElement.addEventListener('click', () => {
                // Update main image source
                // In a real app, you might swap high-res versions, here we just swap what we have
                const newSrc = thumb.src;
                
                // Add a small fade effect
                mainImageContainer.style.opacity = '0.5';
                setTimeout(() => {
                    mainImageContainer.src = newSrc;
                    mainImageContainer.style.opacity = '1';
                }, 150);

                // Update active state on thumbnails
                thumbnails.forEach(t => t.parentElement.classList.remove('ring-2', 'ring-primary'));
                thumb.parentElement.classList.add('ring-2', 'ring-primary');
            });
        });
    }

    // 4. Add to Cart Animation
    const addToCartBtns = document.querySelectorAll('button:contains("Add to Cart"), button:contains("Customize")');
    // Helper to find specific buttons since :contains isn't standard CSS
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (btn.textContent.includes('Add to Cart') || btn.textContent.includes('Buy Now')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.style.transform = 'scale(0.95)';
                const originalText = btn.textContent;
                
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.textContent = 'Added to Cart ✓';
                    btn.classList.add('bg-secondary', 'text-on-secondary', 'border-transparent');
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('bg-secondary', 'text-on-secondary', 'border-transparent');
                    }, 2000);
                }, 200);
            });
        }
    });

    // 5. Fade-in Animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, { threshold: 0.1 });

    const reviewCards = document.querySelectorAll('.grid.gap-6 > div');
    reviewCards.forEach((card, index) => {
        card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });
});
