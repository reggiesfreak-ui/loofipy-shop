document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Navigation (Tabs Logic)
    const sidebarLinks = document.querySelectorAll('aside nav a');
    
    // We assume the dashboard sections might be handled by hiding/showing or just visual active states for prototype
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes from all links
            sidebarLinks.forEach(l => {
                l.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
                l.classList.add('text-on-surface-variant');
            });
            
            // Add active class to clicked link
            link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
            link.classList.remove('text-on-surface-variant');
            
            // In a real app, this would also show/hide corresponding sections in the main content area
            // For prototype, we just give visual feedback
            const sectionName = link.querySelector('span:last-child')?.textContent || 'Section';
            console.log(`Switched to ${sectionName}`);
        });
    });

    // 2. Order "Track Package" Button Animation
    const trackButtons = document.querySelectorAll('button');
    trackButtons.forEach(btn => {
        if (btn.textContent.includes('Track Package') || btn.textContent.includes('View Details')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.style.transform = 'scale(0.95)';
                const originalText = btn.textContent;
                
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.textContent = 'Loading Tracking...';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        alert('Your package is currently Out for Delivery! (Mock Tracking Info)');
                    }, 1000);
                }, 150);
            });
        }
    });

    // 3. Edit Profile / Form Submit Simulation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
            
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.classList.add('opacity-70', 'cursor-wait');
                submitBtn.textContent = 'Saving Changes...';
                
                setTimeout(() => {
                    submitBtn.classList.remove('opacity-70', 'cursor-wait');
                    submitBtn.textContent = 'Saved Successfully ✓';
                    submitBtn.classList.add('bg-secondary', 'text-on-secondary');
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove('bg-secondary', 'text-on-secondary');
                    }, 2500);
                }, 1000);
            }
        });
    });

    // 4. Fade-in Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, { threshold: 0.1 });

    // Animate cards or sections within the main dashboard area
    const cards = document.querySelectorAll('.glass-card, .bg-surface-container-low, section > div');
    cards.forEach((card, index) => {
        // Prevent animating tiny utility divs, just target larger blocks
        if (card.clientHeight > 50) {
            card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            card.style.transitionDelay = `${(index % 5) * 100}ms`;
            observer.observe(card);
        }
    });
});
