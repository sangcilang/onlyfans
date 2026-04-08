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

// Form Display Functions
function showAddUserForm() {
    // Reset form
    document.getElementById('user-id').value = '';
    document.getElementById('user-username').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    
    // Set title
    document.getElementById('user-form-title').textContent = 'Thêm Người Dùng Mới';
    
    // Clear errors
    clearFormErrors();
    
    // Show modal
    document.getElementById('user-form-modal').style.display = 'flex';
}

function showEditUserForm(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('Không tìm thấy người dùng');
        return;
    }
    
    // Fill form with user data
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-password').value = user.password;
    
    // Set title
    document.getElementById('user-form-title').textContent = 'Chỉnh Sửa Người Dùng';
    
    // Clear errors
    clearFormErrors();
    
    // Show modal
    document.getElementById('user-form-modal').style.display = 'flex';
}

function hideUserForm() {
    // Hide modal
    document.getElementById('user-form-modal').style.display = 'none';
    
    // Reset form
    document.getElementById('user-id').value = '';
    document.getElementById('user-username').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    
    // Clear errors
    clearFormErrors();
}

// Validation Functions
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    const inputElement = document.getElementById(`user-${fieldId}`);
    
    if (message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('input-error');
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('input-error');
    }
}

function clearFormErrors() {
    const errorFields = ['username', 'email', 'password'];
    errorFields.forEach(field => showFieldError(field, ''));
}

function validateUserForm() {
    const username = document.getElementById('user-username').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-password').value;
    const userId = document.getElementById('user-id').value;
    
    let isValid = true;
    
    // Validate username format
    if (username.length < 3 || username.length > 20) {
        showFieldError('username', 'Tên đăng nhập phải có từ 3-20 ký tự');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError('username', 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
        isValid = false;
    } else {
        // Check username uniqueness
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username && u.id !== userId);
        if (existingUser) {
            showFieldError('username', 'Tên đăng nhập đã tồn tại');
            isValid = false;
        } else {
            showFieldError('username', '');
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Email không hợp lệ');
        isValid = false;
    } else {
        showFieldError('email', '');
    }
    
    // Validate password
    if (password.length < 6) {
        showFieldError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    } else {
        showFieldError('password', '');
    }
    
    return isValid;
}

// Save User Function
function saveUser() {
    // Validate form
    if (!validateUserForm()) {
        return;
    }
    
    // Get form data
    const userId = document.getElementById('user-id').value;
    const username = sanitizeInput(document.getElementById('user-username').value.trim());
    const email = sanitizeInput(document.getElementById('user-email').value.trim());
    const password = document.getElementById('user-password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (userId) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                username,
                email,
                password
            };
        }
    } else {
        // Create new user
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username,
            email,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        users.push(newUser);
    }
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Refresh table
    loadUsersTable();
    
    // Show success message
    alert(userId ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng mới thành công!');
    
    // Close modal
    hideUserForm();
}

// Table Rendering
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
                <button class="action-btn btn-edit" onclick="showEditUserForm('${user.id}')">Sửa</button>
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
    
    alert('Xóa người dùng thành công!');
    loadUsersTable();
}

// Real-time Validation
function setupValidationListeners() {
    document.getElementById('user-username').addEventListener('blur', function() {
        const username = this.value.trim();
        const userId = document.getElementById('user-id').value;
        
        if (username.length < 3 || username.length > 20) {
            showFieldError('username', 'Tên đăng nhập phải có từ 3-20 ký tự');
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showFieldError('username', 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.username === username && u.id !== userId);
            if (existingUser) {
                showFieldError('username', 'Tên đăng nhập đã tồn tại');
            } else {
                showFieldError('username', '');
            }
        }
    });
    
    document.getElementById('user-email').addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Email không hợp lệ');
        } else {
            showFieldError('email', '');
        }
    });
    
    document.getElementById('user-password').addEventListener('blur', function() {
        const password = this.value;
        
        if (password.length < 6) {
            showFieldError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
        } else {
            showFieldError('password', '');
        }
    });
}

// Initialize
if (checkAdminAccess()) {
    loadUsersTable();
    setupValidationListeners();
}
