// Users page script

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
                <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function deleteUser(userId) {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) {
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    
    loadUsersTable();
}

if (checkAdminAccess()) {
    loadUsersTable();
}
