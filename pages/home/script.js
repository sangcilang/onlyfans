// Home page script

// Store current promotion for viewing details
let currentPromotion = null;
let popupShownThisSession = false; // Prevent multiple popup shows in same session
let allPromotions = []; // Store all promotions
let currentPromotionIndex = 0; // Current promotion index
let currentTimeFilter = 'day'; // Current time filter for top products

/**
 * Load products dynamically
 */
function loadProducts() {
    const products = getAllProducts();
    const productGrid = document.getElementById('productGrid');
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">Chưa có sản phẩm nào</p>';
        return;
    }
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-name="${sanitizeInput(product.name)}" data-product-id="${product.id}" style="cursor: pointer;">
            ${product.badge ? `<div class="badge">${sanitizeInput(product.badge)}</div>` : ''}
            <img src="${product.image}" alt="${sanitizeInput(product.name)}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <div class="info">
                <h3>${sanitizeInput(product.name)}</h3>
                <p class="price">${formatCurrency(product.price)}</p>
                <p class="sold">Đã bán ${sanitizeInput(product.sold || '0')}</p>
                <button onclick="event.stopPropagation(); addToCart('${sanitizeInput(product.name)}', ${product.price})">Thêm vào giỏ</button>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            // Don't navigate if clicking on the button
            if (event.target.tagName === 'BUTTON') {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `../product-detail/index.html?productId=${productId}`;
            }
        });
    });
}

/**
 * Load top selling products
 */
function loadTopProducts(filter = 'day') {
    const products = getAllProducts();
    
    if (products.length === 0) {
        document.getElementById('top-products-list').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary); font-size: 13px;">Chưa có dữ liệu</p>';
        return;
    }
    
    // Parse sold numbers and sort
    const productsWithSales = products.map(product => {
        let soldNumber = 0;
        const soldText = product.sold || '0';
        
        if (soldText.includes('k')) {
            soldNumber = parseFloat(soldText.replace('k', '')) * 1000;
        } else {
            soldNumber = parseInt(soldText.replace(/[^0-9]/g, '')) || 0;
        }
        
        return {
            ...product,
            soldNumber: soldNumber
        };
    });
    
    // Sort by sales (highest first)
    productsWithSales.sort((a, b) => b.soldNumber - a.soldNumber);
    
    // Get top 10
    const top10 = productsWithSales.slice(0, 10);
    
    // Render top products
    const listHtml = top10.map((product, index) => {
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        return `
            <div class="top-product-item" onclick="scrollToProduct('${sanitizeInput(product.name)}')">
                <div class="top-rank ${rankClass}">${index + 1}</div>
                <img src="${product.image}" alt="${sanitizeInput(product.name)}" class="top-product-img" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
                <div class="top-product-info">
                    <div class="top-product-name" title="${sanitizeInput(product.name)}">${sanitizeInput(product.name)}</div>
                    <div class="top-product-price">${formatCurrency(product.price)}</div>
                    <div class="top-product-sold">Đã bán ${sanitizeInput(product.sold)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('top-products-list').innerHTML = listHtml;
}

/**
 * Filter top products by time
 */
function filterTopProducts(filter) {
    currentTimeFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload top products (in real app, this would filter by actual date)
    loadTopProducts(filter);
}

/**
 * Scroll to product in main grid
 */
function scrollToProduct(productName) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (card.getAttribute('data-name') === productName) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight effect
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'highlight 1s ease';
            }, 10);
        }
    });
}

/**
 * Check and show promotion popup
 */
function checkPromotionPopup() {
    console.log('🔍 Checking for promotion popup...');
    
    // Prevent showing popup multiple times in same session
    if (popupShownThisSession) {
        console.log('❌ Popup already shown this session');
        return;
    }
    
    // Check if user chose "don't show again today"
    const dontShowDate = localStorage.getItem('promotion_dont_show_date');
    const today = new Date().toDateString();
    
    console.log('📅 Today:', today);
    console.log('📅 Don\'t show date:', dontShowDate);
    
    if (dontShowDate === today) {
        console.log('❌ User chose not to see promotions today');
        return;
    }
    
    // Get all blog posts
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    console.log('📰 Total blog posts:', blogPosts.length);
    
    // Filter promotion posts (category = "Khuyến mãi")
    const promotions = blogPosts.filter(post => post.category === 'Khuyến mãi');
    console.log('🎉 Promotion posts found:', promotions.length);
    
    if (promotions.length === 0) {
        console.log('❌ No promotions available');
        return;
    }
    
    // Sort by date (newest first)
    promotions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Store all promotions
    allPromotions = promotions;
    currentPromotionIndex = 0;
    
    console.log('✅ Found', promotions.length, 'promotion(s)');
    
    // Mark as shown for this session
    popupShownThisSession = true;
    
    // Show the promotion popup
    showPromotionPopup(0);
}

/**
 * Show promotion popup
 */
function showPromotionPopup(index) {
    if (index < 0 || index >= allPromotions.length) return;
    
    currentPromotionIndex = index;
    currentPromotion = allPromotions[index];
    
    // Update content with slide animation
    const popupContent = document.querySelector('.popup-content');
    popupContent.style.animation = 'slideIn 0.3s ease';
    
    document.getElementById('popup-title').textContent = currentPromotion.title;
    document.getElementById('popup-excerpt').textContent = currentPromotion.excerpt;
    document.getElementById('promotion-popup').style.display = 'flex';
    
    // Show/hide navigation if multiple promotions
    const navElement = document.getElementById('promotion-nav');
    if (allPromotions.length > 1) {
        navElement.style.display = 'flex';
        updateNavigationDots();
        updateNavigationButtons();
    } else {
        navElement.style.display = 'none';
    }
    
    console.log('Showing promotion', index + 1, 'of', allPromotions.length, ':', currentPromotion.title);
}

/**
 * Update navigation dots
 */
function updateNavigationDots() {
    const dotsContainer = document.getElementById('promotion-dots');
    dotsContainer.innerHTML = allPromotions.map((_, index) => 
        `<span class="dot ${index === currentPromotionIndex ? 'active' : ''}" onclick="showPromotionPopup(${index})"></span>`
    ).join('');
}

/**
 * Update navigation buttons
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentPromotionIndex === 0;
    nextBtn.disabled = currentPromotionIndex === allPromotions.length - 1;
    
    prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
}

/**
 * Next promotion
 */
function nextPromotion() {
    if (currentPromotionIndex < allPromotions.length - 1) {
        showPromotionPopup(currentPromotionIndex + 1);
    }
}

/**
 * Previous promotion
 */
function previousPromotion() {
    if (currentPromotionIndex > 0) {
        showPromotionPopup(currentPromotionIndex - 1);
    }
}

/**
 * Close promotion popup
 */
function closePromotionPopup() {
    document.getElementById('promotion-popup').style.display = 'none';
    document.getElementById('dont-show-again').checked = false;
}

/**
 * View promotion details
 */
function viewPromotionDetails() {
    if (currentPromotion) {
        // Redirect to blog page
        window.location.href = '../blog/index.html';
    }
}

/**
 * Handle "don't show again" checkbox
 */
function handleDontShowAgain() {
    const checkbox = document.getElementById('dont-show-again');
    
    if (checkbox.checked) {
        const today = new Date().toDateString();
        localStorage.setItem('promotion_dont_show_date', today);
        console.log('User chose not to see promotions today');
    } else {
        localStorage.removeItem('promotion_dont_show_date');
    }
}

/**
 * Load news sidebar
 */
function loadNewsSidebar() {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    if (blogPosts.length === 0) {
        document.getElementById('news-list').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary); font-size: 13px;">Chưa có tin tức</p>';
        return;
    }
    
    // Sort by date (newest first) and get top 10
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    
    const newsHtml = sortedPosts.map(post => {
        let categoryClass = '';
        if (post.category === 'Khuyến mãi') categoryClass = 'promotion';
        else if (post.category === 'Sản phẩm') categoryClass = 'product';
        else if (post.category === 'Hướng dẫn') categoryClass = 'guide';
        else if (post.category === 'Công nghệ') categoryClass = 'tech';
        
        const postDate = new Date(post.date);
        const dateStr = postDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        return `
            <div class="news-item" onclick="window.location.href='../blog/index.html'">
                <span class="news-category ${categoryClass}">${sanitizeInput(post.category)}</span>
                <div class="news-title">${sanitizeInput(post.title)}</div>
                <div class="news-date">${dateStr}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('news-list').innerHTML = newsHtml;
}

/**
 * Tìm kiếm sản phẩm
 */
function searchProduct() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.getAttribute('data-name').toLowerCase();
        card.style.display = productName.includes(input) ? "block" : "none";
    });
}

// Load products when page loads
loadProducts();
loadTopProducts('day');
loadNewsSidebar();

// Check for promotion popup after a short delay (to let page load first)
setTimeout(() => {
    checkPromotionPopup();
}, 1500);

