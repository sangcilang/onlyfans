// Orders page script

function isAdmin() {
    const user = getCurrentUser();
    return user && (user.username === 'admin' || user.email.includes('admin'));
}

function checkAdminAccess() {
    if (!isLoggedIn()) {
        alert('Vui lòng đăng nhập để truy cập trang quản trị');
        window.location.href = '../../login/index.html';
        return false;
    }
    
    if (!isAdmin()) {
        const mainContent = document.querySelector('.admin-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="access-denied">
                    <h2>🚫</h2>
                    <h2>Truy Cập Bị Từ Chối</h2>
                    <p>Bạn không có quyền truy cập trang quản trị</p>
                    <button class="btn" onclick="window.location.href='../../home/index.html'">Về Trang Chủ</button>
                </div>
            `;
        }
        return false;
    }
    return true;
}

function getStatusClass(status) {
    const statusMap = {
        'Đang xử lý': 'status-processing',
        'Đã xác nhận': 'status-confirmed',
        'Đang giao': 'status-shipping',
        'Đã giao': 'status-delivered',
        'Đã hủy': 'status-cancelled'
    };
    return statusMap[status] || '';
}

function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('orders-table');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    tbody.innerHTML = orders.map((order, index) => {
        const itemsText = order.items.length === 1 
            ? order.items[0].name 
            : `${order.items.length} sản phẩm`;
        
        const statusClass = getStatusClass(order.status);
        
        return `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${sanitizeInput(order.username || order.email)}</td>
                <td>${sanitizeInput(itemsText)}</td>
                <td><strong>${formatCurrency(order.total)}</strong></td>
                <td>
                    <select class="status-select ${statusClass}" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Đang xử lý" ${order.status === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="Đã xác nhận" ${order.status === 'Đã xác nhận' ? 'selected' : ''}>Đã xác nhận</option>
                        <option value="Đang giao" ${order.status === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
                        <option value="Đã giao" ${order.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
                        <option value="Đã hủy" ${order.status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewOrderDetails('${order.id}')" title="Xem chi tiết">👁️</button>
                    <button class="action-btn btn-delete" onclick="deleteOrder('${order.id}')">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    orders[orderIndex].status = newStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrdersTable();
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    const itemsList = order.items.map(item => 
        `- ${item.name}: ${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');
    
    const details = `
📦 CHI TIẾT ĐƠN HÀNG

👤 Khách hàng: ${order.username || 'N/A'}
📧 Email: ${order.email}
📅 Ngày đặt: ${new Date(order.createdAt).toLocaleString('vi-VN')}
📊 Trạng thái: ${order.status}

🛒 SẢN PHẨM:
${itemsList}

💰 TỔNG TIỀN: ${formatCurrency(order.total)}
    `.trim();
    
    alert(details);
}

function deleteOrder(orderId) {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    loadOrdersTable();
}

if (checkAdminAccess()) {
    loadOrdersTable();
}
