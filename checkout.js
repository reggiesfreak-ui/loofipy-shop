document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Checkout Modal HTML into the page
    const checkoutHTML = `
        <div id="checkout-overlay" class="fixed inset-0 bg-surface/60 backdrop-blur-md z-[80] hidden opacity-0 transition-opacity duration-500 flex items-center justify-center p-4 sm:p-6">
            <div id="checkout-modal" class="w-full max-w-4xl bg-surface-container-lowest/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden transform scale-95 transition-transform duration-500 flex flex-col md:flex-row max-h-[90vh]">
                
                <!-- Left: Order Summary (Simplified) -->
                <div class="hidden md:block w-1/3 bg-primary-container/20 p-8 border-r border-white/20">
                    <h2 class="font-headline-lg text-headline-lg-mobile text-primary mb-6">Checkout</h2>
                    <p class="font-body-md text-on-surface-variant mb-8">Complete your order and we'll start crafting your memories.</p>
                    
                    <div class="flex flex-col gap-4">
                        <div class="flex justify-between items-center text-sm font-bold text-on-surface">
                            <span>Subtotal</span>
                            <span id="checkout-subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between items-center text-sm text-on-surface-variant">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div class="h-px w-full bg-outline-variant/30 my-2"></div>
                        <div class="flex justify-between items-center font-headline-lg text-headline-lg-mobile text-primary">
                            <span>Total</span>
                            <span id="checkout-total">$0.00</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Checkout Form -->
                <div class="flex-1 flex flex-col h-full overflow-y-auto relative">
                    <div class="p-6 md:p-8 flex-1">
                        <div class="flex justify-between items-center mb-8 md:hidden">
                            <h2 class="font-headline-lg text-headline-lg-mobile text-primary">Checkout</h2>
                            <button id="close-checkout" class="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant/50 transition-colors">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <button id="close-checkout-desktop" class="hidden md:block absolute top-6 right-6 p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant/50 transition-colors z-10">
                            <span class="material-symbols-outlined">close</span>
                        </button>

                        <form id="checkout-form" class="space-y-8 relative z-0">
                            <!-- Shipping Details -->
                            <section>
                                <h3 class="font-label-sm text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">local_shipping</span> Shipping Information
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                    <input type="text" placeholder="Last Name" class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                    <input type="email" placeholder="Email Address" class="w-full sm:col-span-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                    <input type="text" placeholder="Street Address" class="w-full sm:col-span-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                </div>
                            </section>

                            <!-- Payment Details -->
                            <section>
                                <h3 class="font-label-sm text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">credit_card</span> Payment Method
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3 p-4 border-2 border-primary rounded-xl bg-primary-container/10">
                                        <input type="radio" name="payment" id="card" checked class="text-primary focus:ring-primary">
                                        <label for="card" class="font-bold flex-1">Credit Card</label>
                                        <span class="material-symbols-outlined">payments</span>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 mt-4">
                                        <input type="text" placeholder="Card Number" class="w-full col-span-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                        <input type="text" placeholder="MM/YY" class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                        <input type="text" placeholder="CVC" class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all" required>
                                    </div>
                                </div>
                            </section>
                            
                            <button type="submit" id="pay-btn" class="w-full py-4 rounded-full bg-gradient-to-r from-primary to-[#9b6a80] text-white font-bold tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 mt-8">
                                <span class="material-symbols-outlined" id="pay-icon">lock</span>
                                <span id="pay-text">Pay Now</span>
                            </button>
                        </form>

                        <!-- Success State (Hidden by default) -->
                        <div id="checkout-success" class="hidden flex-col items-center justify-center h-full text-center py-12">
                            <div class="w-24 h-24 bg-tertiary-container rounded-full flex items-center justify-center text-on-tertiary-container mb-6 scale-0 transition-transform duration-700 delay-300" id="success-icon-container">
                                <span class="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                            <h2 class="font-headline-lg text-headline-lg-mobile text-primary mb-2 opacity-0 transition-opacity duration-700 delay-500" id="success-title">Payment Successful!</h2>
                            <p class="font-body-md text-on-surface-variant max-w-sm mx-auto opacity-0 transition-opacity duration-700 delay-700" id="success-desc">Thank you for your order. We will send a confirmation email shortly with your tracking details.</p>
                            <button id="continue-shopping" class="mt-8 px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary-container/20 transition-all opacity-0 transition-opacity duration-700 delay-1000" id="success-btn">
                                Continue Shopping
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', checkoutHTML);

    const checkoutOverlay = document.getElementById('checkout-overlay');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtns = [document.getElementById('close-checkout'), document.getElementById('close-checkout-desktop')];
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutSuccess = document.getElementById('checkout-success');
    const payBtn = document.getElementById('pay-btn');
    const payText = document.getElementById('pay-text');
    const payIcon = document.getElementById('pay-icon');
    const continueShoppingBtn = document.getElementById('continue-shopping');

    // 2. Open / Close Logic
    const openCheckout = () => {
        // Sync total from cart
        const cartTotalEl = document.getElementById('cart-total');
        if (cartTotalEl) {
            const total = cartTotalEl.textContent;
            document.getElementById('checkout-subtotal').textContent = total;
            document.getElementById('checkout-total').textContent = total;
        }

        checkoutOverlay.classList.remove('hidden');
        // Small delay to allow display block to apply before changing opacity/transform
        setTimeout(() => {
            checkoutOverlay.classList.remove('opacity-0');
            checkoutModal.classList.remove('scale-95');
            checkoutModal.classList.add('scale-100');
        }, 10);
    };

    const closeCheckout = () => {
        checkoutOverlay.classList.add('opacity-0');
        checkoutModal.classList.remove('scale-100');
        checkoutModal.classList.add('scale-95');
        setTimeout(() => {
            checkoutOverlay.classList.add('hidden');
            // Reset form and success state on close
            resetCheckoutState();
        }, 500);
    };

    closeCheckoutBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', closeCheckout);
    });

    // Also close on overlay click (if clicking outside the modal)
    checkoutOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutOverlay) {
            closeCheckout();
        }
    });

    // 3. Intercept Proceed to Checkout button from cart.js
    // We need to use a MutationObserver or polling to wait until the cart button is available
    const bindCheckoutButton = () => {
        const cartCheckoutBtn = document.getElementById('checkout-btn');
        if (cartCheckoutBtn) {
            cartCheckoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Ensure cart isn't empty (handled by cart logic disabled class, but just to be safe)
                if (!cartCheckoutBtn.classList.contains('cursor-not-allowed')) {
                    // Hide the cart drawer first
                    const cartOverlay = document.getElementById('cart-overlay');
                    const cartDrawer = document.getElementById('cart-drawer');
                    if (cartOverlay) cartOverlay.classList.add('opacity-0');
                    if (cartDrawer) cartDrawer.classList.add('translate-x-full');
                    setTimeout(() => {
                        if (cartOverlay) cartOverlay.classList.add('hidden');
                        openCheckout();
                    }, 300);
                }
            });
        }
    };
    
    // Attempt binding, or wait slightly if DOM wasn't fully ready
    setTimeout(bindCheckoutButton, 500);

    // 4. Handle Payment Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Loading state
        payBtn.classList.add('cursor-wait', 'opacity-80');
        payIcon.textContent = 'hourglass_empty';
        payIcon.classList.add('animate-spin');
        payText.textContent = 'Processing...';
        
        // Simulate network request
        setTimeout(() => {
            // Success state
            checkoutForm.classList.add('hidden');
            checkoutSuccess.classList.remove('hidden');
            checkoutSuccess.classList.add('flex');
            
            // Trigger staggered animations
            setTimeout(() => {
                document.getElementById('success-icon-container').classList.remove('scale-0');
                document.getElementById('success-icon-container').classList.add('scale-100');
                document.getElementById('success-title').classList.remove('opacity-0');
                document.getElementById('success-desc').classList.remove('opacity-0');
                continueShoppingBtn.classList.remove('opacity-0');
            }, 100);

            // Empty the global cart if possible
            if (window.cartData) {
                window.cartData = [];
                // Re-render empty cart
                const cartTotal = document.getElementById('cart-total');
                if (cartTotal) cartTotal.textContent = '$0.00';
            }
        }, 2000);
    });

    continueShoppingBtn.addEventListener('click', closeCheckout);

    const resetCheckoutState = () => {
        checkoutForm.reset();
        checkoutForm.classList.remove('hidden');
        checkoutSuccess.classList.add('hidden');
        checkoutSuccess.classList.remove('flex');
        
        payBtn.classList.remove('cursor-wait', 'opacity-80');
        payIcon.textContent = 'lock';
        payIcon.classList.remove('animate-spin');
        payText.textContent = 'Pay Now';
        
        document.getElementById('success-icon-container').classList.add('scale-0');
        document.getElementById('success-icon-container').classList.remove('scale-100');
        document.getElementById('success-title').classList.add('opacity-0');
        document.getElementById('success-desc').classList.add('opacity-0');
        continueShoppingBtn.classList.add('opacity-0');
    };
});
