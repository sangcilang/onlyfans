// Inventory page script

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

function loadInventoryTable() {
    const products = getAllProducts();
    const tbody = document.getElementById('inventory-table');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    const lowStockProducts = products.filter(p => (p.stock || 0) < 10);
    const alertDiv = document.getElementById('low-stock-alert');
    const alertMsg = document.getElementById('low-stock-message');
    
    if (lowStockProducts.length > 0) {
        alertDiv.style.display = 'flex';
        alertMsg.textContent = `⚠️ Có ${lowStockProducts.length} sản phẩm sắp hết hàng (< 10 sản phẩm)`;
    } else {
        alertDiv.style.display = 'none';
    }
    
    tbody.innerHTML = products.map((product, index) => {
        const stock = product.stock || 0;
        const stockStatus = stock === 0 ? 'Hết hàng' : stock < 10 ? 'Sắp hết' : 'Còn hàng';
        const stockClass = stock === 0 ? 'stock-out' : stock < 10 ? 'stock-low' : 'stock-ok';
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${sanitizeInput(product.name)}</strong></td>
                <td>${formatCurrency(product.price)}</td>
                <td>
                    <input type="number" 
                           class="stock-input" 
                           value="${stock}" 
                           min="0" 
                           onchange="updateStock('${product.id}', this.value)"
                           style="width: 80px;">
                </td>
                <td>${sanitizeInput(product.sold || '0')}</td>
                <td><span class="stock-badge ${stockClass}">${stockStatus}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="quickAddStock('${product.id}', 10)">+10</button>
                    <button class="action-btn btn-edit" onclick="quickAddStock('${product.id}', 50)">+50</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStock(productId, newStock) {
    const stock = parseInt(newStock);
    
    if (isNaN(stock) || stock < 0) {
        alert('Số lượng tồn kho không hợp lệ');
        loadInventoryTable();
        return;
    }
    
    const product = getProductById(productId);
    if (!product) {
        alert('Không tìm thấy sản phẩm');
        return;
    }
    
    updateProduct(productId, { stock: stock });
    loadInventoryTable();
}

function quickAddStock(productId, amount) {
    const product = getProductById(productId);
    if (!product) {
        alert('Không tìm thấy sản phẩm');
        return;
    }
    
    const currentStock = product.stock || 0;
    const newStock = currentStock + amount;
    
    updateProduct(productId, { stock: newStock });
    loadInventoryTable();
}

if (checkAdminAccess()) {
    loadInventoryTable();
}
