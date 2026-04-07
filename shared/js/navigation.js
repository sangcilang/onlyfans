// Navigation module for Fan Shop

/**
 * Get base path for navigation
 */
function getBasePath() {
    // Detect if we're in a page folder
    const path = window.location.pathname;
    
    // If in admin subfolder (dashboard, orders, etc.)
    if (path.includes('/pages/admin/') && !path.endsWith('/pages/admin/index.html')) {
        return '../../';
    }
    
    // If in any page folder
    if (path.includes('/pages/')) {
        return '../';
    }
    
    return './pages/';
}

/**
 * Render header HTML
 * @returns {string} - HTML string
 */
function renderHeader() {
    const basePath = getBasePath();
    return `
        <header class="shopee-header">
            <div class="header-content">
                <a href="${basePath}home/index.html" style="text-decoration: none;">
                    <div class="logo">Fan Shop</div>
                </a>
                <div class="search-container">
                    <input type="text" id="searchInput" placeholder="Săn Deal Quạt Mát Chào Hè...">
                    <button onclick="searchProduct ? searchProduct() : void(0)">🔍</button>
                </div>
                <div class="cart-icon">
                    <a href="${basePath}cart/index.html">🛒 Giỏ hàng (<span id="cart-count">0</span>)</a>
                </div>
                <div class="auth-links" id="auth-links">
                    <!-- Will be populated by updateAuthUI() -->
                </div>
            </div>
            <nav class="sub-nav">
                <ul class="menu">
                    <li><a href="${basePath}home/index.html">Trang chủ</a></li>
                    <li><a href="${basePath}about/index.html">Giới thiệu</a></li>
                    <li><a href="${basePath}blog/index.html">Tin tức</a></li>
                    <li><a href="${basePath}policy/index.html">Chính sách</a></li>
                    <li><a href="${basePath}contact/index.html">Liên hệ</a></li>
                    <li id="admin-menu-item" style="display: none;"><a href="${basePath}admin/index.html">⚙️ Quản trị</a></li>
                </ul>
            </nav>
        </header>
    `;
}

/**
 * Render footer HTML
 * @returns {string} - HTML string
 */
function renderFooter() {
    return `
        <footer>
            <p>&copy; 2026 Fan Shop - Đồ án Web đầu tay</p>
        </footer>
    `;
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && (user.username === 'admin' || user.email.includes('admin'));
}

/**
 * Cập nhật header dựa trên auth status
 */
function updateAuthUI() {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;
    
    const basePath = getBasePath();
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            authLinksContainer.innerHTML = `
                <span class="user-info">Xin chào, ${sanitizeInput(user.username)}</span>
                <button onclick="handleLogout()">Đăng xuất</button>
            `;
            
            // Show admin menu if user is admin
            const adminMenuItem = document.getElementById('admin-menu-item');
            if (adminMenuItem && isAdmin()) {
                adminMenuItem.style.display = 'block';
            }
        }
    } else {
        authLinksContainer.innerHTML = `
            <a href="${basePath}login/index.html">Đăng nhập</a>
            <a href="${basePath}register/index.html">Đăng ký</a>
        `;
        
        // Hide admin menu if not logged in
        const adminMenuItem = document.getElementById('admin-menu-item');
        if (adminMenuItem) {
            adminMenuItem.style.display = 'none';
        }
    }
}

/**
 * Handle logout action
 */
function handleLogout() {
    logout();
    updateAuthUI();
    updateCartCountUI();
    alert('Đã đăng xuất thành công');
    window.location.href = getBasePath() + 'home/index.html';
}

/**
 * Khởi tạo navigation (gọi khi page load)
 */
function initNavigation() {
    // Inject header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = renderHeader();
    } else {
        // If no placeholder, insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', renderHeader());
    }
    
    // Inject footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = renderFooter();
    } else {
        // If no placeholder, append to body
        document.body.insertAdjacentHTML('beforeend', renderFooter());
    }
    
    // Update auth UI
    updateAuthUI();
    
    // Update cart count
    updateCartCountUI();
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
