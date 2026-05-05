// Cart module for Fan Shop

/**
 * Lấy cart key dựa trên user session
 * @returns {string} - 'cart' hoặc 'cart_username'
 */
function _getCartKey() {
    if (isLoggedIn()) {
        const user = getCurrentUser();
        return user ? `cart_${user.username}` : 'cart';
    }
    return 'cart';
}

/**
 * Load cart từ localStorage
 * @returns {Array} - Mảng cart items
 */
function _loadCart() {
    try {
        const cartKey = _getCartKey();
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

/**
 * Save cart vào localStorage
 * @param {Array} cart - Mảng cart items
 */
function _saveCart(cart) {
    try {
        const cartKey = _getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        throw new Error('Không thể lưu giỏ hàng');
    }
}

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} productName - Tên sản phẩm
 * @param {number} price - Giá sản phẩm
 * @returns {Object} - {success: boolean, message: string}
 */
function addToCart(productName, price) {
    try {
        const cart = _loadCart();
        
        const cartItem = {
            id: generateId(),
            name: productName,
            price: price,
            quantity: 1,
            addedAt: new Date().toISOString()
        };
        
        cart.push(cartItem);
        _saveCart(cart);
        
        updateCartCountUI();
        
        return {
            success: true,
            message: `Đã thêm "${productName}" vào giỏ hàng!`
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Không thể thêm sản phẩm vào giỏ hàng'
        };
    }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {number} index - Index của item cần xóa
 */
function removeFromCart(index) {
    try {
        const cart = _loadCart();
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            _saveCart(cart);
            updateCartCountUI();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

/**
 * Lấy giỏ hàng hiện tại
 * @returns {Array} - Mảng cart items
 */
function getCart() {
    return _loadCart();
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function clearCart() {
    try {
        const cartKey = _getCartKey();
        localStorage.removeItem(cartKey);
        updateCartCountUI();
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

/**
 * Tính tổng tiền
 * @returns {number} - Tổng tiền
 */
function getCartTotal() {
    const cart = _loadCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Lấy số lượng items trong giỏ
 * @returns {number} - Số lượng items
 */
function getCartCount() {
    const cart = _loadCart();
    return cart.length;
}

/**
 * Cập nhật UI hiển thị số lượng giỏ hàng
 */
function updateCartCountUI() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = getCartCount();
    }
}

/**
 * Cập nhật số lượng của một Cart Item theo delta (+1 hoặc -1).
 * Nếu quantity sau khi giảm <= 0, item sẽ bị xóa khỏi giỏ hàng.
 *
 * @param {number} index - Vị trí của item trong mảng cart (0-based)
 * @param {number} delta - Thay đổi số lượng: +1 để tăng, -1 để giảm
 * @returns {Object} - { success: boolean, removed: boolean, message?: string }
 */
function updateCartItemQuantity(index, delta) {
    try {
        const cart = _loadCart();

        if (index < 0 || index >= cart.length) {
            return { success: false, message: 'Index không hợp lệ' };
        }

        const item = cart[index];
        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            removeFromCart(index);
            return { success: true, removed: true };
        }

        item.quantity = newQuantity;
        _saveCart(cart);
        updateCartCountUI();
        return { success: true, removed: false };
    } catch (error) {
        return { success: false };
    }
}

// ============================================
// ALIAS TIENG VIET - Vietnamese Aliases
// ============================================

/**
 * Them san pham vao gio hang
 */
const themVaoGioHang = addToCart;

/**
 * Xoa san pham khoi gio hang
 */
const xoaKhoiGioHang = removeFromCart;

/**
 * Lay gio hang hien tai
 */
const layGioHang = getCart;

/**
 * Xoa toan bo gio hang
 */
const xoaToanBoGioHang = clearCart;

/**
 * Tinh tong tien
 */
const tinhTongTien = getCartTotal;

/**
 * Lay so luong items trong gio
 */
const laySoLuongGioHang = getCartCount;

/**
 * Cap nhat UI hien thi so luong gio hang
 */
const capNhatGioHangUI = updateCartCountUI;

/**
 * Cap nhat so luong gio hang
 */
const capNhatSoLuongGioHang = updateCartItemQuantity;
