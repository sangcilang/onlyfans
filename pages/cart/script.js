// Cart page script

/**
 * Render giỏ hàng
 */
function renderCart() {
    const tableBody = document.getElementById('cart-table-body');
    const totalDisplay = document.getElementById('total-price-display');
    const userInfoDisplay = document.getElementById('user-info-display');
    
    // Display user info if logged in
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            userInfoDisplay.innerHTML = `Đang mua hàng với tài khoản: ${sanitizeInput(user.username)}`;
            
            // Pre-fill form with user info
            const nameInput = document.getElementById('cusName');
            if (nameInput && !nameInput.value) {
                nameInput.value = user.username;
            }
        }
    } else {
        userInfoDisplay.innerHTML = '';
    }
    
    const cart = getCart();
    tableBody.innerHTML = '';
    
    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="empty-msg">Giỏ hàng đang trống. Hãy quay lại trang chủ chọn quạt nhé!</td></tr>';
        totalDisplay.innerText = "Tổng tiền: 0đ";
        return;
    }
    
    cart.forEach((item, index) => {
        let row = `
            <tr>
                <td>${sanitizeInput(item.name)}</td>
                <td>${formatCurrency(item.price)}</td>
                <td><button onclick="handleRemoveItem(${index})" class="remove-btn">Xóa</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    
    totalDisplay.innerText = `Tổng tiền: ${formatCurrency(getCartTotal())}`;
}

/**
 * Handle xóa item
 * @param {number} index - Index của item cần xóa
 */
function handleRemoveItem(index) {
    removeFromCart(index);
    renderCart();
}

/**
 * Handle checkout
 */
function handleCheckout() {
    const name = document.getElementById('cusName').value;
    const phone = document.getElementById('cusPhone').value;
    const address = document.getElementById('cusAddress').value;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Giỏ hàng trống, không thể thanh toán!');
        return;
    }
    
    if (!name || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
        return;
    }
    
    // Giả lập thanh toán thành công
    let message = `Cảm ơn bạn ${name}!\nĐơn hàng đã được ghi nhận. Chúng tôi sẽ giao quạt đến địa chỉ: ${address} sớm nhất!`;
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            message += `\n\nĐơn hàng được lưu vào tài khoản: ${user.username}`;
        }
    }
    
    alert(message);
    
    // Xóa sạch giỏ hàng sau khi mua xong
    clearCart();
    window.location.href = '../home/index.html';
}

// Render cart khi page load
renderCart();
