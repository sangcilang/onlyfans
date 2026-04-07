// Admin page script

let revenueChart, orderStatusChart, topProductsChart, newUsersChart;

/**
 * Initialize all charts
 */
function initCharts() {
    initRevenueChart();
    initOrderStatusChart();
    initTopProductsChart();
    initNewUsersChart();
}

/**
 * Revenue Chart - Line Chart
 */
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get last 7 days
    const last7Days = [];
    const revenueData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        last7Days.push(dateStr);
        
        // Calculate revenue for this day
        const dayRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.toDateString() === date.toDateString() && order.status !== 'Đã hủy';
            })
            .reduce((sum, order) => sum + (order.total || 0), 0);
        
        revenueData.push(dayRevenue);
    }
    
    if (revenueChart) revenueChart.destroy();
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: revenueData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Doanh thu: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Order Status Chart - Doughnut Chart
 */
function initOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const statusCount = {
        'Đang xử lý': 0,
        'Đã xác nhận': 0,
        'Đang giao': 0,
        'Đã giao': 0,
        'Đã hủy': 0
    };
    
    orders.forEach(order => {
        if (statusCount[order.status] !== undefined) {
            statusCount[order.status]++;
        }
    });
    
    if (orderStatusChart) orderStatusChart.destroy();
    
    orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#fbbf24',
                    '#3b82f6',
                    '#6366f1',
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Top Products Chart - Bar Chart
 */
function initTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    const products = getAllProducts();
    
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
            name: product.name,
            sold: soldNumber
        };
    });
    
    // Sort and get top 5
    productsWithSales.sort((a, b) => b.sold - a.sold);
    const top5 = productsWithSales.slice(0, 5);
    
    if (topProductsChart) topProductsChart.destroy();
    
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top5.map(p => p.name.substring(0, 20) + '...'),
            datasets: [{
                label: 'Đã bán',
                data: top5.map(p => p.sold),
                backgroundColor: '#10b981',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * New Users Chart - Bar Chart
 */
function initNewUsersChart() {
    const ctx = document.getElementById('newUsersChart');
    if (!ctx) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Get last 6 months
    const monthsData = {};
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        monthsData[monthKey] = 0;
    }
    
    // Count users per month
    users.forEach(user => {
        const userDate = new Date(user.createdAt);
        const monthKey = userDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        if (monthsData[monthKey] !== undefined) {
            monthsData[monthKey]++;
        }
    });
    
    if (newUsersChart) newUsersChart.destroy();
    
    newUsersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthsData),
            datasets: [{
                label: 'Người dùng mới',
                data: Object.values(monthsData),
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

/**
 * Switch between sections
 */
function switchSection(event, sectionId) {
    event.preventDefault();
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active to clicked sidebar item
    event.currentTarget.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    // For demo: admin if username is 'admin' or email contains 'admin'
    return user && (user.username === 'admin' || user.email.includes('admin'));
}

/**
 * Redirect if not admin
 */
function checkAdminAccess() {
    if (!isLoggedIn()) {
        alert('Vui lòng đăng nhập để truy cập trang quản trị');
        window.location.href = '../login/index.html';
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
                    <button class="btn" onclick="window.location.href='../home/index.html'">
                        Về Trang Chủ
                    </button>
                </div>
            `;
        }
        return false;
    }
    
    return true;
}

/**
 * Load admin statistics
 */
function loadStatistics() {
    // Get users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('total-users').textContent = users.length;
    
    // Get products
    const products = getAllProducts();
    document.getElementById('total-products').textContent = products.length;
    
    // Get orders (from localStorage if exists)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('total-orders').textContent = orders.length;
    
    // Calculate revenue (exclude cancelled orders)
    let revenue = 0;
    orders.forEach(order => {
        if (order.status !== 'Đã hủy') {
            revenue += order.total || 0;
        }
    });
    document.getElementById('total-revenue').textContent = formatCurrency(revenue);
}

/**
 * Load orders table
 */
function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('orders-table');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    // Sort by date (newest first)
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
                    <button class="action-btn btn-edit" onclick="viewOrderDetails('${order.id}')" title="Xem chi tiết">
                        👁️
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteOrder('${order.id}')">
                        Xóa
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Get status class for styling
 */
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

/**
 * Update order status
 */
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
    loadStatistics();
    addActivity(`Đã cập nhật trạng thái đơn hàng #${orderIndex + 1} thành "${newStatus}"`);
}

/**
 * View order details
 */
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
📦 CHI TIẾT ĐỐN HÀNG

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

/**
 * Delete order
 */
function deleteOrder(orderId) {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    loadOrdersTable();
    loadStatistics();
    addActivity('Đã xóa một đơn hàng');
}

/**
 * Load inventory table
 */
function loadInventoryTable() {
    const products = getAllProducts();
    const tbody = document.getElementById('inventory-table');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    // Check for low stock
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
                    <button class="action-btn btn-edit" onclick="quickAddStock('${product.id}', 10)">
                        +10
                    </button>
                    <button class="action-btn btn-edit" onclick="quickAddStock('${product.id}', 50)">
                        +50
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update stock
 */
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
    addActivity(`Đã cập nhật tồn kho "${product.name}" thành ${stock}`);
}

/**
 * Quick add stock
 */
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
    addActivity(`Đã thêm ${amount} sản phẩm vào kho "${product.name}"`);
}

/**
 * Load users table
 */
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('users-table');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Chưa có người dùng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map((user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${sanitizeInput(user.username)}</strong></td>
            <td>${sanitizeInput(user.email)}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
            <td>
                <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Load blog posts table
 */
function loadPostsTable() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const tbody = document.getElementById('posts-table');
    
    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Chưa có bài viết nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = posts.map((post, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${sanitizeInput(post.title)}</strong></td>
            <td><span class="blog-category">${sanitizeInput(post.category)}</span></td>
            <td>${new Date(post.date).toLocaleDateString('vi-VN')}</td>
            <td>
                <button class="action-btn btn-delete" onclick="deletePost('${post.id}')">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Load products table
 */
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
                <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">
                    Sửa
                </button>
                <button class="action-btn btn-delete" onclick="deleteProductConfirm('${product.id}')">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Delete user
 */
function deleteUser(userId) {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) {
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    
    loadUsersTable();
    loadStatistics();
    addActivity('Đã xóa một người dùng');
}

/**
 * Show add post form
 */
function showAddPostForm() {
    document.getElementById('add-post-form').style.display = 'block';
}

/**
 * Hide add post form
 */
function hideAddPostForm() {
    document.getElementById('add-post-form').style.display = 'none';
    document.getElementById('post-title').value = '';
    document.getElementById('post-category').value = 'Sản phẩm';
    document.getElementById('post-excerpt').value = '';
    document.getElementById('post-image').value = '';
}

/**
 * Add blog post
 */
function addBlogPost() {
    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const image = document.getElementById('post-image').value.trim();
    
    if (!title || !excerpt) {
        alert('Vui lòng nhập đầy đủ tiêu đề và mô tả');
        return;
    }
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const newPost = {
        id: Date.now().toString(),
        title: title,
        excerpt: excerpt,
        content: excerpt,
        category: category,
        author: getCurrentUser().username,
        date: new Date().toISOString(),
        image: image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
    };
    
    posts.unshift(newPost);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    hideAddPostForm();
    loadPostsTable();
    addActivity(`Đã thêm bài viết: ${title}`);
    alert('Đã thêm bài viết thành công!');
}

/**
 * Delete blog post
 */
function deletePost(postId) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) {
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    loadPostsTable();
    addActivity('Đã xóa một bài viết');
}

/**
 * Show add product form
 */
function showAddProductForm() {
    document.getElementById('product-form-title').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-badge').value = '';
    document.getElementById('product-sold').value = '';
    document.getElementById('add-product-form').style.display = 'block';
}

/**
 * Hide product form
 */
function hideProductForm() {
    document.getElementById('add-product-form').style.display = 'none';
}

/**
 * Edit product
 */
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
    
    // Scroll to form
    document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Save product (add or update)
 */
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
        // Update existing product
        updateProduct(id, productData);
        addActivity(`Đã cập nhật sản phẩm: ${name}`);
        alert('Đã cập nhật sản phẩm thành công!');
    } else {
        // Add new product
        addProduct(productData);
        addActivity(`Đã thêm sản phẩm: ${name}`);
        alert('Đã thêm sản phẩm thành công!');
    }
    
    hideProductForm();
    loadProductsTable();
    loadInventoryTable();
    loadStatistics();
}

/**
 * Delete product with confirmation
 */
function deleteProductConfirm(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    const product = getProductById(productId);
    deleteProduct(productId);
    loadProductsTable();
    loadInventoryTable();
    loadStatistics();
    addActivity(`Đã xóa sản phẩm: ${product ? product.name : 'N/A'}`);
    alert('Đã xóa sản phẩm thành công!');
}

/**
 * Add activity log
 */
function addActivity(message) {
    const activityList = document.getElementById('activity-list');
    const time = new Date().toLocaleTimeString('vi-VN');
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <span class="activity-icon">✅</span>
        <span>${message} - ${time}</span>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 10 activities
    while (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Initialize admin page
if (checkAdminAccess()) {
    loadStatistics();
    loadOrdersTable();
    loadInventoryTable();
    loadProductsTable();
    loadUsersTable();
    loadPostsTable();
    addActivity('Truy cập trang quản trị');
    
    // Initialize charts
    initCharts();
}
