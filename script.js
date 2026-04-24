// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));

// ── Inject prices from prices.js config ──────────────────────────────
function injectPrices() {
    if (typeof PRICES === 'undefined') return;

    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('.product-name')?.textContent?.trim();
        const config = PRICES[name];
        if (!config) return;

        const defaultSize = config.default || 'A4';

        // Stamp data-price on every size button & set active
        card.querySelectorAll('.size-btn').forEach(btn => {
            const size = btn.textContent.trim();
            if (config[size] !== undefined) {
                btn.dataset.price = config[size];
            }
            btn.classList.toggle('active', size === defaultSize);
        });

        // Set the initially displayed price
        const priceEl = card.querySelector('.product-price');
        if (priceEl && config[defaultSize] !== undefined) {
            const originalEl = priceEl.querySelector('.original');
            if (originalEl) {
                priceEl.innerHTML = `<span class="original">${originalEl.textContent}</span>₹${config[defaultSize]}`;
            } else {
                priceEl.textContent = `₹${config[defaultSize]}`;
            }
        }
    });
}
injectPrices();

// ── Inject images from images.js config ──────────────────────────────
function injectImages() {
    if (typeof IMAGES === 'undefined') return;

    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('.product-name')?.textContent?.trim();
        const config = IMAGES[name];
        if (!config || !config.src) return;

        // Find the SVG placeholder inside the image wrapper
        const wrap = card.querySelector('.product-img-wrap');
        const svg = wrap?.querySelector('svg:not(.product-hover-overlay svg)');
        if (!svg) return;

        // Build <img> and swap in
        const img = document.createElement('img');
        img.src = config.src;
        img.alt = config.alt || name;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        svg.replaceWith(img);
    });
}
injectImages();

// Toast
let toastTimer;
window.showToast = function(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Cart state — each item: { name, price, emoji, size }
let cartItems = [];

function parsePrice(card) {
    const priceEl = card.querySelector('.product-price');
    if (!priceEl) return 0;
    // Get the last text node (actual price, not the 'original' struck-through one)
    const text = priceEl.innerText.replace(/₹/g, '').trim().split('\n').pop().trim();
    return parseInt(text.replace(/[^0-9]/g, '')) || 0;
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const empty = document.getElementById('cartEmpty');
    const footer = document.getElementById('cartFooter');

    if (!list || !empty || !footer) return;

    list.innerHTML = '';

    if (cartItems.length === 0) {
        empty.style.display = 'flex';
        footer.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    footer.style.display = 'block';

    let total = 0;
    cartItems.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div class="cart-item-thumb">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.size} &nbsp;·&nbsp; ₹${item.price}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove">✕</button>
        `;
        list.appendChild(li);
    });

    const totalEls = document.querySelectorAll('#cartTotal');
    totalEls.forEach(el => el.textContent = `₹${total}`);
}

function updateCartBadge() {
    const count = cartItems.length;
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        if (count === 0) badge.style.display = 'none';
        else badge.style.display = 'flex';
    } else {
        const navBtn = document.getElementById('navCartBtn');
        if (navBtn) navBtn.textContent = `Bag (${count})`;
    }
}

window.selectSize = function(btn) {
    const picker = btn.closest('.size-picker');
    picker.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const newPrice = btn.dataset.price;
    if (newPrice) {
        const card = btn.closest('.product-card');
        const priceEl = card?.querySelector('.product-price');
        if (priceEl) {
            const originalEl = priceEl.querySelector('.original');
            if (originalEl) {
                priceEl.innerHTML = `<span class="original">${originalEl.textContent}</span>₹${newPrice}`;
            } else {
                priceEl.textContent = `₹${newPrice}`;
            }
        }
    }
}

window.addToCart = function(btn) {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.product-name')?.textContent?.trim() || 'Poster';
    const price = parsePrice(card);

    const activeSize = card?.querySelector('.size-btn.active')?.textContent?.trim() || 'A4';

    const emojis = { 'Orbital Serenity': '🌀', 'Grand Prix 2025': '🏎️', 'Botanical Flora': '🌿', 'Marvel Universe': '⚡' };
    const emoji = emojis[name] || '🖼️';

    cartItems.push({ name, size: activeSize, price, emoji });
    updateCartBadge();
    renderCart();

    btn.textContent = 'Added ✧';
    setTimeout(() => btn.textContent = 'Add to Bag', 1500);
    showToast(`"${name}" (${activeSize}) added to bag!`);
}

window.removeFromCart = function(index) {
    cartItems.splice(index, 1);
    updateCartBadge();
    renderCart();
}

window.openCart = function() {
    renderCart();
    if (window.cancelCheckout) cancelCheckout(); 
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

window.closeCart = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ── Checkout Navigation ────────────────────────────────────────────────────────────
window.showCheckout = function() {
    document.getElementById('cartView').style.display = 'none';
    document.getElementById('checkoutView').style.display = 'block';
    document.getElementById('proceedBtn').style.display = 'none';
    document.getElementById('confirmBtn').style.display = 'block';
}

window.cancelCheckout = function() {
    const cartView = document.getElementById('cartView');
    const checkoutView = document.getElementById('checkoutView');
    const proceedBtn = document.getElementById('proceedBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (cartView) cartView.style.display = 'block';
    if (checkoutView) checkoutView.style.display = 'none';
    if (proceedBtn) proceedBtn.style.display = 'block';
    if (confirmBtn) confirmBtn.style.display = 'none';
}

window.completeOrder = function() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!name || !phone || !address) {
        showToast('Please fill all shipping details! 📦');
        return;
    }

    if (phone.length < 10) {
        showToast('Please enter a valid phone number!');
        return;
    }

    let total = 0;
    let itemsText = cartItems.map(item => {
        total += item.price;
        return `• ${item.name} (${item.size}) - ₹${item.price}`;
    }).join('\n');

    const storeNumber = PRICES.WHATSAPP_NUMBER || "919000000000";
    const message = `*NEW ORDER FROM FRAMD*\n\n` +
        `*Customer Details:*\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Address: ${address}\n\n` +
        `*Order Summary:*\n${itemsText}\n\n` +
        `*Total Amount: ₹${total}*\n\n` +
        `Please confirm my order! ✧`;

    const whatsappUrl = `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;

    showToast('Redirecting to WhatsApp... 🚀');
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        cartItems = [];
        updateCartBadge();
        renderCart();
        closeCart();
        
        document.getElementById('custName').value = '';
        document.getElementById('custPhone').value = '';
        document.getElementById('custAddress').value = '';
        
        showToast('Order details sent! Confirm on WhatsApp. ✧');
    }, 1000);
}

// Close on Escape key
document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') {
        closeCart(); 
        closeSearch();
    }
});

// Parallax hero
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.style.transform = `translateY(${scrollY * 0.08}px)`;
});

// ── Mega Menu & Navigation Logic ────────────────────────────────────────────────────────────
(function () {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const btn = item.querySelector('.menu-btn');
        const menu = item.querySelector('.mega-menu, .dropdown-menu');

        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            menuItems.forEach(otherItem => {
                const otherMenu = otherItem.querySelector('.mega-menu, .dropdown-menu');
                if (otherMenu && otherMenu !== menu) {
                    otherMenu.classList.remove('active');
                }
            });

            menu.classList.toggle('active');
        });
        
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', (e) => {
        menuItems.forEach(item => {
            const menu = item.querySelector('.mega-menu, .dropdown-menu');
            const btn = item.querySelector('.menu-btn');
            if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.mega-menu.active, .dropdown-menu.active').forEach(m => {
                m.classList.remove('active');
            });
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"], button[data-target^="#"]').forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href') || item.getAttribute('data-target');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navUl = document.querySelector('nav ul');
    
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navUl.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
            
            if (navUl.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (navUl.classList.contains('mobile-active') && !navUl.contains(e.target) && !menuToggle.contains(e.target)) {
                navUl.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
})();

// ── Search Logic ──────────────────────────────
window.openSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('searchInput').focus(), 100);
    }
}

window.closeSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Global search function
function handleSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = '<div class="search-placeholder"><p>Start typing to search our collection...</p></div>';
        return;
    }

    const q = query.toLowerCase().trim();
    const matches = [];

    // Search through PRICES or IMAGES (using PRICES as source of names)
    if (typeof PRICES !== 'undefined') {
        for (const name in PRICES) {
            if (name.toLowerCase().includes(q) && name !== 'WHATSAPP_NUMBER') {
                matches.push({
                    name: name,
                    price: PRICES[name].A4 || PRICES[name].A3 || 0,
                    image: (typeof IMAGES !== 'undefined' && IMAGES[name]) ? IMAGES[name].src : ''
                });
            }
        }
    }

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="search-placeholder"><p>No posters found matching "' + query + '"</p></div>';
        return;
    }

    resultsContainer.innerHTML = matches.map(item => `
        <a href="index.html#products" class="search-result-item" onclick="closeSearch()">
            <div class="search-result-thumb">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '🖼️'}
            </div>
            <div class="search-result-info">
                <h4>${item.name}</h4>
                <span>Starting from ₹${item.price}</span>
            </div>
        </a>
    `).join('');
}

// Attach search listener
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }
});

// ── Custom Cursor Glow Logic ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        });
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = 0;
        });
        
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = 1;
        });

        const clickables = document.querySelectorAll('a, button, .product-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)');
            el.addEventListener('mouseleave', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }
});


