document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Cart HTML Modal into the page
    const cartHTML = `
        <div id="cart-overlay" class="fixed inset-0 bg-surface/40 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity duration-300"></div>
        <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface-container-lowest/80 backdrop-blur-2xl border-l border-white/30 shadow-2xl z-[70] transform translate-x-full transition-transform duration-500 flex flex-col">
            
            <div class="flex items-center justify-between p-6 border-b border-outline-variant/30">
                <h2 class="font-headline-lg text-headline-lg-mobile text-primary">Your Cart</h2>
                <button id="close-cart" class="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant/50 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6" id="cart-items-container">
                <!-- Empty Cart State by Default -->
                <div id="empty-cart-msg" class="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
                    <span class="material-symbols-outlined text-6xl mb-4">shopping_bag</span>
                    <p class="font-body-md text-body-md">Your memory collection is empty.</p>
                </div>
            </div>

            <div class="p-6 border-t border-outline-variant/30 bg-surface/50">
                <div class="flex justify-between items-center mb-4 font-headline-lg text-headline-lg-mobile text-on-surface">
                    <span>Total</span>
                    <span id="cart-total">$0.00</span>
                </div>
                <button id="checkout-btn" class="w-full py-4 rounded-full bg-primary text-white font-bold tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all opacity-50 cursor-not-allowed">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);

    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cartData = [];

    // 2. Open / Close Logic
    const openCart = () => {
        cartOverlay.classList.remove('hidden');
        // Small delay to allow display block to apply before changing opacity
        setTimeout(() => {
            cartOverlay.classList.remove('opacity-0');
            cartDrawer.classList.remove('translate-x-full');
        }, 10);
        renderCart();
    };

    const closeCart = () => {
        cartOverlay.classList.add('opacity-0');
        cartDrawer.classList.add('translate-x-full');
        setTimeout(() => {
            cartOverlay.classList.add('hidden');
        }, 300);
    };

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Bind to all existing cart icons on the page
    const bindCartIcons = () => {
        // Find any buttons containing the shopping_cart icon
        const icons = document.querySelectorAll('.material-symbols-outlined');
        icons.forEach(icon => {
            if (icon.textContent.includes('shopping_cart') || icon.textContent.includes('shopping_bag')) {
                const btn = icon.closest('button') || icon.closest('a');
                if (btn && !btn.id.includes('add-to-cart')) { 
                    // Prevent triggering open if it's an 'add to cart' button 
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openCart();
                    });
                }
            }
        });
    };
    bindCartIcons();

    // 3. Cart Logic implementation (Add, Remove, Render)
    const renderCart = () => {
        if (cartData.length === 0) {
            emptyCartMsg.style.display = 'flex';
            const items = cartItemsContainer.querySelectorAll('.cart-item');
            items.forEach(item => item.remove());
            cartTotal.textContent = '$0.00';
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            return;
        }

        emptyCartMsg.style.display = 'none';
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Remove existing items before re-rendering
        const items = cartItemsContainer.querySelectorAll('.cart-item');
        items.forEach(item => item.remove());

        let total = 0;
        
        cartData.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item flex gap-4 items-center bg-surface-container-low p-3 rounded-xl border border-white/40 shadow-sm transition-all">
                    <div class="w-16 h-16 rounded-md bg-secondary-container/30 overflow-hidden flex-shrink-0">
                        <!-- Mock Thumbnail -->
                        <div class="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-container"></div>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-label-sm text-on-surface line-clamp-1">${item.name}</h4>
                        <p class="text-sm text-primary font-semibold">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <button class="remove-item text-error hover:text-error-container p-1" data-index="${index}">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                        <div class="text-xs text-on-surface-variant bg-surface-variant px-2 rounded-full">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotal.textContent = '$' + total.toFixed(2);

        // Bind remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cartData.splice(idx, 1);
                renderCart();
            });
        });
    };

    // Global Add to Cart Function to be called from other files (like productdetail.js)
    window.addToCartGlobal = (productName, price, quantity = 1) => {
        cartData.push({ name: productName, price: price, quantity: quantity });
        openCart();
    };

    // Override the previous mock "Add to Cart" interactions to actually add to the drawer if applicable
    const addBtns = document.querySelectorAll('button:contains("Add to Cart")');
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (btn.textContent.includes('Add to Cart') || btn.textContent.includes('Buy Now')) {
            // Remove old mock event if possible or just prepend new action
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Extract price from the page if possible, otherwise mock it
                const priceEl = document.querySelector('.font-display-lg.text-primary');
                let price = 24.99;
                if (priceEl) price = parseFloat(priceEl.textContent.replace('$', ''));
                
                const titleEl = document.querySelector('h1.font-headline-lg');
                const name = titleEl ? titleEl.textContent : 'Custom Acrylic Keychain';
                
                setTimeout(() => {
                    window.addToCartGlobal(name, price, 1);
                }, 500); // Wait for the checkmark animation from productdetail.js to finish
            });
        }
    });
});
