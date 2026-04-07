// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng nếu chưa có dữ liệu
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Đợi DOM tải xong để cập nhật số lượng hiển thị ban đầu
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price) {
    const product = { name, price };
    
    // Thêm sản phẩm vào mảng
    cart.push(product);
    
    // Lưu mảng giỏ hàng vào localStorage dưới dạng chuỗi JSON
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật con số hiển thị trên Header
    updateCartCount();
    
    alert(`Đã thêm "${name}" vào giỏ hàng!`);
}

// Hàm cập nhật số lượng trên giao diện
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// Hàm tìm kiếm sản phẩm
function searchProduct() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.getAttribute('data-name').toLowerCase();
        card.style.display = productName.includes(input) ? "block" : "none";
    });
}