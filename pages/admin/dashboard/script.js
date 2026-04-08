// Dashboard page script

// Global state for time filter
let currentTimePeriod = 'week';
let revenueChart, orderStatusChart, topProductsChart, newUsersChart;

/**
 * Calculate start date based on time period
 * @param {string} period - 'week' | 'month' | 'year'
 * @returns {Date} Start date for filtering
 */
function getStartDate(period) {
    const now = new Date();
    const startDate = new Date(now);
    
    switch(period) {
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setDate(now.getDate() - 30);
            break;
        case 'year':
            startDate.setDate(now.getDate() - 365);
            break;
    }
    
    startDate.setHours(0, 0, 0, 0);
    return startDate;
}

/**
 * Filter data by date range
 * @param {Array} data - Array of objects with createdAt property
 * @param {Date} startDate - Start date for filtering
 * @returns {Array} Filtered data
 */
function filterByDateRange(data, startDate) {
    if (!data || !Array.isArray(data)) {
        console.warn('Invalid data provided to filterByDateRange');
        return [];
    }
    
    const startTime = startDate.getTime();
    
    return data.filter(item => {
        if (!item.createdAt) {
            console.warn('Item missing createdAt:', item);
            return false;
        }
        
        const itemDate = new Date(item.createdAt);
        if (isNaN(itemDate.getTime())) {
            console.warn('Invalid date format:', item.createdAt);
            return false;
        }
        
        return itemDate.getTime() >= startTime;
    });
}

/**
 * Aggregate orders by day
 * @param {Array} orders - Filtered orders
 * @param {string} period - 'week' or 'month'
 * @returns {Object} { labels: string[], data: number[] }
 */
function aggregateByDay(orders, period) {
    const days = period === 'week' ? 7 : 30;
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit' 
        });
        labels.push(dateStr);
        
        const dayRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.toDateString() === date.toDateString() 
                    && order.status !== 'Đã hủy';
            })
            .reduce((sum, order) => sum + (order.total || 0), 0);
        
        data.push(dayRevenue);
    }
    
    return { labels, data };
}

/**
 * Aggregate orders by month
 * @param {Array} orders - Filtered orders
 * @returns {Object} { labels: string[], data: number[] }
 */
function aggregateByMonth(orders) {
    const labels = [];
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('vi-VN', { 
            month: '2-digit', 
            year: 'numeric' 
        });
        labels.push(monthStr);
        
        const monthRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === date.getMonth() 
                    && orderDate.getFullYear() === date.getFullYear()
                    && order.status !== 'Đã hủy';
            })
            .reduce((sum, order) => sum + (order.total || 0), 0);
        
        data.push(monthRevenue);
    }
    
    return { labels, data };
}

/**
 * Aggregate users by day
 * @param {Array} users - Filtered users
 * @param {string} period - 'week' or 'month'
 * @returns {Object} { labels: string[], data: number[] }
 */
function aggregateUsersByDay(users, period) {
    const days = period === 'week' ? 7 : 30;
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit' 
        });
        labels.push(dateStr);
        
        const dayUsers = users.filter(user => {
            const userDate = new Date(user.createdAt);
            return userDate.toDateString() === date.toDateString();
        }).length;
        
        data.push(dayUsers);
    }
    
    return { labels, data };
}

/**
 * Aggregate users by month
 * @param {Array} users - Filtered users
 * @returns {Object} { labels: string[], data: number[] }
 */
function aggregateUsersByMonth(users) {
    const labels = [];
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('vi-VN', { 
            month: '2-digit', 
            year: 'numeric' 
        });
        labels.push(monthStr);
        
        const monthUsers = users.filter(user => {
            const userDate = new Date(user.createdAt);
            return userDate.getMonth() === date.getMonth() 
                && userDate.getFullYear() === date.getFullYear();
        }).length;
        
        data.push(monthUsers);
    }
    
    return { labels, data };
}

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
function updateRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const startDate = getStartDate(currentTimePeriod);
    const filteredOrders = filterByDateRange(orders, startDate);
    
    let labels, data;
    
    if (currentTimePeriod === 'year') {
        ({ labels, data } = aggregateByMonth(filteredOrders));
    } else {
        ({ labels, data } = aggregateByDay(filteredOrders, currentTimePeriod));
    }
    
    if (revenueChart) revenueChart.destroy();
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: data,
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
function updateOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const startDate = getStartDate(currentTimePeriod);
    const filteredOrders = filterByDateRange(orders, startDate);
    
    const statusCount = {
        'Đang xử lý': 0,
        'Đã xác nhận': 0,
        'Đang giao': 0,
        'Đã giao': 0,
        'Đã hủy': 0
    };
    
    filteredOrders.forEach(order => {
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
function updateTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const startDate = getStartDate(currentTimePeriod);
    const filteredOrders = filterByDateRange(orders, startDate);
    
    // Count products from filtered orders
    const productCount = {};
    filteredOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                productCount[item.name] = (productCount[item.name] || 0) + (item.quantity || 1);
            });
        }
    });
    
    // Sort and get top 5
    const sortedProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sortedProducts.map(p => p[0].substring(0, 20) + '...');
    const data = sortedProducts.map(p => p[1]);
    
    if (topProductsChart) topProductsChart.destroy();
    
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Đã bán',
                data: data,
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
function updateNewUsersChart() {
    const ctx = document.getElementById('newUsersChart');
    if (!ctx) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const startDate = getStartDate(currentTimePeriod);
    const filteredUsers = filterByDateRange(users, startDate);
    
    let labels, data;
    
    if (currentTimePeriod === 'year') {
        ({ labels, data } = aggregateUsersByMonth(filteredUsers));
    } else {
        ({ labels, data } = aggregateUsersByDay(filteredUsers, currentTimePeriod));
    }
    
    if (newUsersChart) newUsersChart.destroy();
    
    newUsersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Người dùng mới',
                data: data,
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

/**
 * Refresh all charts with current time period
 */
function refreshAllCharts() {
    updateRevenueChart();
    updateOrderStatusChart();
    updateTopProductsChart();
    updateNewUsersChart();
}

/**
 * Initialize time filter component
 */
function initTimeFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

/**
 * Handle filter button click
 * @param {Event} event - Click event
 */
function handleFilterChange(event) {
    const period = event.target.dataset.period;
    
    if (!['week', 'month', 'year'].includes(period)) {
        console.error('Invalid time period:', period);
        return;
    }
    
    currentTimePeriod = period;
    
    // Update UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Refresh all charts
    refreshAllCharts();
}

// Initialize dashboard
if (checkAdminAccess()) {
    loadStatistics();
    initTimeFilter();
    updateRevenueChart();
    updateOrderStatusChart();
    updateTopProductsChart();
    updateNewUsersChart();
}
