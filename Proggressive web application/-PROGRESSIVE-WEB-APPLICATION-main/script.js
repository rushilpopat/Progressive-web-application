// Basic script file
console.log("Script loaded!");

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Cart functionality
let cart = [];
let wishlist = [];
let reviews = {
    'Premium Headphones': [
        { author: 'John D.', rating: 5, date: '2024-02-15', content: 'Amazing sound quality and very comfortable!' },
        { author: 'Sarah M.', rating: 4, date: '2024-02-10', content: 'Great headphones, but a bit pricey.' }
    ],
    'Smart Watch': [
        { author: 'Mike R.', rating: 5, date: '2024-02-14', content: 'Best smartwatch I\'ve ever owned!' },
        { author: 'Lisa K.', rating: 5, date: '2024-02-12', content: 'Battery life is impressive.' }
    ],
    'Ultrabook Pro': [
        { author: 'Alex T.', rating: 5, date: '2024-02-16', content: 'Lightning fast and super portable!' },
        { author: 'Emma W.', rating: 4, date: '2024-02-13', content: 'Great laptop, wish it had more ports.' }
    ],
    'Gaming Laptop': [
        { author: 'Chris P.', rating: 5, date: '2024-02-15', content: 'Handles all my games perfectly!' },
        { author: 'David L.', rating: 4, date: '2024-02-11', content: 'Good performance, but gets hot during gaming.' }
    ],
    'Professional DSLR': [
        { author: 'Maria S.', rating: 5, date: '2024-02-14', content: 'Professional quality photos!' },
        { author: 'Tom B.', rating: 5, date: '2024-02-12', content: 'Worth every penny for the image quality.' }
    ],
    'Mirrorless Camera': [
        { author: 'Sophie K.', rating: 4, date: '2024-02-13', content: 'Great for travel photography!' },
        { author: 'James M.', rating: 5, date: '2024-02-10', content: 'Compact and powerful.' }
    ],
    'Pro Tablet': [
        { author: 'Rachel G.', rating: 5, date: '2024-02-15', content: 'Perfect for digital art!' },
        { author: 'Kevin H.', rating: 4, date: '2024-02-12', content: 'Great display and performance.' }
    ],
    'Mini Tablet': [
        { author: 'Laura P.', rating: 4, date: '2024-02-14', content: 'Perfect size for reading!' },
        { author: 'Mark T.', rating: 4, date: '2024-02-11', content: 'Good value for money.' }
    ],
    'Smart Light Bulb Set': [
        { author: 'Anna W.', rating: 5, date: '2024-02-13', content: 'Love the color options!' },
        { author: 'Peter R.', rating: 4, date: '2024-02-10', content: 'Easy to set up and control.' }
    ],
    'Smart Thermostat': [
        { author: 'Daniel K.', rating: 5, date: '2024-02-15', content: 'Saves energy and money!' },
        { author: 'Sarah L.', rating: 4, date: '2024-02-12', content: 'Great app integration.' }
    ]
};

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const totalElement = document.querySelector('.total-amount');

    // Clear cart items
    cartItems.innerHTML = '';

    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.price.replace('$', ''));
        
        // Create cart item element
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="remove-item" data-name="${item.name}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Update totals
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemName = e.target.closest('.remove-item').dataset.name;
            removeFromCart(itemName);
        });
    });
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.price').textContent,
            quantity: 1
        };
        
        cart.push(product);
        updateCartCount();
        updateCartUI();
        showNotification('Product added to cart!');
    });
});

// Remove from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartCount();
    updateCartUI();
    showNotification('Product removed from cart!');
}

// Quick view functionality
const modal = document.getElementById('quick-view-modal');
const modalContent = modal.querySelector('.modal-body');
const closeModal = modal.querySelector('.close-modal');

document.querySelectorAll('.quick-view').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.price').textContent,
            image: productCard.querySelector('img').src,
            rating: productCard.querySelector('.rating').innerHTML
        };

        modalContent.innerHTML = `
            <div class="quick-view-content">
                <img src="${product.image}" alt="${product.name}">
                <div class="quick-view-info">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <div class="rating">${product.rating}</div>
                    <p class="description">Experience premium quality with our ${product.name.toLowerCase()}. 
                    Perfect for everyday use with exceptional features and comfort.</p>
                    <button class="add-to-cart">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Show notification
function showNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('ShopPWA', {
                    body: message,
                    icon: '/icons/favicon.svg'
                });
            }
        });
    }
}

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
    
    // Initialize cart UI
    updateCartCount();
    updateCartUI();
});

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.querySelector('.search-button');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('.description')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Filter functionality
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');

function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedSort = sortFilter.value;
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    // Filter by category and price
    productCards.forEach(card => {
        const category = card.dataset.category;
        const price = parseFloat(card.dataset.price);
        let showCard = true;

        // Category filter
        if (selectedCategory !== 'all' && category !== selectedCategory) {
            showCard = false;
        }

        // Price filter
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(val => 
                val === '+' ? Infinity : parseFloat(val)
            );
            if (price < min || price > max) {
                showCard = false;
            }
        }

        card.style.display = showCard ? '' : 'none';
    });

    // Sort products
    const productGrid = document.querySelector('.product-grid');
    const visibleProducts = productCards.filter(card => card.style.display !== 'none');

    visibleProducts.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const ratingA = a.querySelector('.rating').querySelectorAll('.fas.fa-star').length;
        const ratingB = b.querySelector('.rating').querySelectorAll('.fas.fa-star').length;

        switch (selectedSort) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'rating':
                return ratingB - ratingA;
            default:
                return 0;
        }
    });

    // Reorder products in the DOM
    visibleProducts.forEach(product => {
        productGrid.appendChild(product);
    });
}

categoryFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('change', applyFilters);
sortFilter.addEventListener('change', applyFilters);

// Wishlist functionality
function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    wishlistCount.textContent = wishlist.length;
}

function updateWishlistUI() {
    const wishlistItems = document.querySelector('.wishlist-items');
    wishlistItems.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <p>Your wishlist is empty</p>
                <a href="#products" class="cta-button">Browse Products</a>
            </div>
        `;
        return;
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <p class="price">${item.price}</p>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart" data-name="${item.name}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="remove-from-wishlist" data-name="${item.name}">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
        wishlistItems.appendChild(wishlistItem);
    });

    // Add event listeners to wishlist item buttons
    document.querySelectorAll('.wishlist-item .add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemName = e.target.closest('.add-to-cart').dataset.name;
            const item = wishlist.find(item => item.name === itemName);
            if (item) {
                cart.push(item);
                updateCartCount();
                updateCartUI();
                showNotification('Product added to cart!');
            }
        });
    });

    document.querySelectorAll('.wishlist-item .remove-from-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemName = e.target.closest('.remove-from-wishlist').dataset.name;
            removeFromWishlist(itemName);
        });
    });
}

function addToWishlist(product) {
    if (!wishlist.some(item => item.name === product.name)) {
        wishlist.push(product);
        updateWishlistCount();
        updateWishlistUI();
        showNotification('Product added to wishlist!');
        
        // Update the wishlist button state
        const wishlistButton = document.querySelector(`.product-card:has(h3:contains('${product.name}')) .add-to-wishlist`);
        if (wishlistButton) {
            wishlistButton.classList.add('active');
            wishlistButton.querySelector('i').classList.replace('far', 'fas');
        }
    }
}

function removeFromWishlist(itemName) {
    wishlist = wishlist.filter(item => item.name !== itemName);
    updateWishlistCount();
    updateWishlistUI();
    showNotification('Product removed from wishlist!');
    
    // Update the wishlist button state
    const wishlistButton = document.querySelector(`.product-card:has(h3:contains('${itemName}')) .add-to-wishlist`);
    if (wishlistButton) {
        wishlistButton.classList.remove('active');
        wishlistButton.querySelector('i').classList.replace('fas', 'far');
    }
}

// Reviews functionality
function showReviews(productName) {
    const reviewsModal = document.getElementById('reviews-modal');
    const reviewsList = reviewsModal.querySelector('.reviews-list');
    const productReviews = reviews[productName] || [];

    reviewsList.innerHTML = productReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <div class="review-content">${review.content}</div>
        </div>
    `).join('');

    reviewsModal.style.display = 'block';
}

function submitReview(productName, rating, content) {
    if (!reviews[productName]) {
        reviews[productName] = [];
    }

    reviews[productName].push({
        author: 'You',
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        content: content
    });

    showReviews(productName);
    showNotification('Review submitted successfully!');
}

// Wishlist button click handlers
document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.price').textContent,
            image: productCard.querySelector('img').src
        };
        
        if (button.classList.contains('active')) {
            removeFromWishlist(product.name);
        } else {
            addToWishlist(product);
        }
    });
});

// Reviews button click handlers
document.querySelectorAll('.view-reviews').forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.closest('.product-card').querySelector('h3').textContent;
        showReviews(productName);
    });
});

// Review submission
const reviewsModal = document.getElementById('reviews-modal');
const ratingInputs = reviewsModal.querySelectorAll('.rating-input i');
const reviewTextarea = reviewsModal.querySelector('textarea');
const submitReviewButton = reviewsModal.querySelector('.submit-review');

let selectedRating = 0;

ratingInputs.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        ratingInputs.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.rating) <= selectedRating);
            s.classList.toggle('fas', parseInt(s.dataset.rating) <= selectedRating);
            s.classList.toggle('far', parseInt(s.dataset.rating) > selectedRating);
        });
    });
});

submitReviewButton.addEventListener('click', () => {
    const productName = reviewsModal.dataset.productName;
    const content = reviewTextarea.value.trim();
    
    if (selectedRating > 0 && content) {
        submitReview(productName, selectedRating, content);
        reviewTextarea.value = '';
        selectedRating = 0;
        ratingInputs.forEach(star => {
            star.classList.remove('active', 'fas');
            star.classList.add('far');
        });
    } else {
        showNotification('Please provide both a rating and review text.');
    }
});

// Initialize wishlist state from localStorage
function initializeWishlist() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistCount();
        updateWishlistUI();
        
        // Update wishlist button states
        wishlist.forEach(item => {
            const wishlistButton = document.querySelector(`.product-card:has(h3:contains('${item.name}')) .add-to-wishlist`);
            if (wishlistButton) {
                wishlistButton.classList.add('active');
                wishlistButton.querySelector('i').classList.replace('far', 'fas');
            }
        });
    }
}

// Save wishlist to localStorage when it changes
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update the addToWishlist and removeFromWishlist functions to save to localStorage
const originalAddToWishlist = addToWishlist;
addToWishlist = function(product) {
    originalAddToWishlist(product);
    saveWishlist();
};

const originalRemoveFromWishlist = removeFromWishlist;
removeFromWishlist = function(itemName) {
    originalRemoveFromWishlist(itemName);
    saveWishlist();
};

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeWishlist();
});

// Update the price filter options
priceFilter.innerHTML = `
    <option value="all">All Prices</option>
    <option value="0-100">$0 - $100</option>
    <option value="100-500">$100 - $500</option>
    <option value="500-1000">$500 - $1,000</option>
    <option value="1000+">$1,000+</option>
`;

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
}); 