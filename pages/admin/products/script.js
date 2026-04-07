// Products page script

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

function loadProductsTable() {
    const products = getAllProducts();
    const tbody = document.getElementById('products-table');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map((product, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${sanitizeInput(product.name)}</strong></td>
            <td>${formatCurrency(product.price)}</td>
            <td><span class="blog-category">${sanitizeInput(product.badge || '-')}</span></td>
            <td>${sanitizeInput(product.sold || '0')}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">Sửa</button>
                <button class="action-btn btn-delete" onclick="deleteProductConfirm('${product.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('product-form-title').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-badge').value = '';
    document.getElementById('product-sold').value = '';
    document.getElementById('product-stock').value = '100';
    document.getElementById('add-product-form').style.display = 'block';
}

function hideProductForm() {
    document.getElementById('add-product-form').style.display = 'none';
}

function editProduct(productId) {
    const product = getProductById(productId);
    if (!product) {
        alert('Không tìm thấy sản phẩm');
        return;
    }
    
    document.getElementById('product-form-title').textContent = 'Sửa Sản Phẩm';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-sold').value = product.sold || '';
    document.getElementById('product-stock').value = product.stock || 100;
    document.getElementById('add-product-form').style.display = 'block';
    
    document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' });
}

function saveProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const badge = document.getElementById('product-badge').value.trim();
    const sold = document.getElementById('product-sold').value.trim();
    const stock = document.getElementById('product-stock').value.trim();
    
    if (!name || !price) {
        alert('Vui lòng nhập đầy đủ tên và giá sản phẩm');
        return;
    }
    
    if (isNaN(price) || parseInt(price) <= 0) {
        alert('Giá sản phẩm không hợp lệ');
        return;
    }
    
    const productData = {
        name: name,
        price: price,
        image: image,
        badge: badge,
        sold: sold,
        stock: stock ? parseInt(stock) : 100
    };
    
    if (id) {
        updateProduct(id, productData);
        alert('Đã cập nhật sản phẩm thành công!');
    } else {
        addProduct(productData);
        alert('Đã thêm sản phẩm thành công!');
    }
    
    hideProductForm();
    loadProductsTable();
}

function deleteProductConfirm(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    deleteProduct(productId);
    loadProductsTable();
    alert('Đã xóa sản phẩm thành công!');
}

if (checkAdminAccess()) {
    loadProductsTable();
}
