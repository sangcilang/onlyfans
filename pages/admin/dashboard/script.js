// Dashboard page script

let revenueChart, orderStatusChart, topProductsChart, newUsersChart;

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && (user.username === 'admin' || user.email.includes('admin'));
}

/**
 * Redirect if not admin
 */
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
                    <button class="btn" onclick="window.location.href='../../home/index.html'">
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
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('total-users').textContent = users.length;
    
    const products = getAllProducts();
    document.getElementById('total-products').textContent = products.length;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('total-orders').textContent = orders.length;
    
    let revenue = 0;
    orders.forEach(order => {
        if (order.status !== 'Đã hủy') {
            revenue += order.total || 0;
        }
    });
    document.getElementById('total-revenue').textContent = formatCurrency(revenue);
}

/**
 * Revenue Chart - Line Chart
 */
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const last7Days = [];
    const revenueData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        last7Days.push(dateStr);
        
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
                legend: { display: false },
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
                backgroundColor: ['#fbbf24', '#3b82f6', '#6366f1', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
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
    
    const productsWithSales = products.map(product => {
        let soldNumber = 0;
        const soldText = product.sold || '0';
        
        if (soldText.includes('k')) {
            soldNumber = parseFloat(soldText.replace('k', '')) * 1000;
        } else {
            soldNumber = parseInt(soldText.replace(/[^0-9]/g, '')) || 0;
        }
        
        return { name: product.name, sold: soldNumber };
    });
    
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
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
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
    const monthsData = {};
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        monthsData[monthKey] = 0;
    }
    
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
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Initialize dashboard
if (checkAdminAccess()) {
    loadStatistics();
    initRevenueChart();
    initOrderStatusChart();
    initTopProductsChart();
    initNewUsersChart();
}
