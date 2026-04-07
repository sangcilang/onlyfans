// Authentication module for Fan Shop

/**
 * Validate email format
 * @param {string} email - Email cần validate
 * @returns {boolean} - true nếu email hợp lệ
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password cần validate
 * @returns {Object} - {valid: boolean, message: string}
 */
function validatePassword(password) {
    if (!password || password.length < 6) {
        return {
            valid: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự'
        };
    }
    return {
        valid: true,
        message: ''
    };
}

/**
 * Validate username
 * @param {string} username - Username cần validate
 * @returns {Object} - {valid: boolean, message: string}
 */
function validateUsername(username) {
    if (!username || username.length < 3 || username.length > 20) {
        return {
            valid: false,
            message: 'Tên đăng nhập phải có từ 3-20 ký tự'
        };
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return {
            valid: false,
            message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
        };
    }
    
    return {
        valid: true,
        message: ''
    };
}

// Internal storage functions

/**
 * Lấy danh sách users từ localStorage
 * @returns {Array} - Mảng users
 */
function _getUsers() {
    try {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

/**
 * Lưu danh sách users vào localStorage
 * @param {Array} users - Mảng users cần lưu
 */
function _saveUsers(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
        throw new Error('Không thể lưu dữ liệu người dùng');
    }
}

/**
 * Tìm user theo email
 * @param {string} email - Email cần tìm
 * @returns {Object|undefined} - User object hoặc undefined
 */
function _findUserByEmail(email) {
    const users = _getUsers();
    return users.find(user => user.email === email);
}

/**
 * Tìm user theo username
 * @param {string} username - Username cần tìm
 * @returns {Object|undefined} - User object hoặc undefined
 */
function _findUserByUsername(username) {
    const users = _getUsers();
    return users.find(user => user.username === username);
}

// Session management

/**
 * Tạo session mới
 * @param {Object} user - User object
 */
function _createSession(user) {
    const session = {
        userId: user.id,
        username: user.username,
        email: user.email,
        loginTime: new Date().toISOString(),
        expiresAt: null
    };
    
    try {
        localStorage.setItem('session', JSON.stringify(session));
    } catch (error) {
        console.error('Error creating session:', error);
        throw new Error('Không thể tạo phiên đăng nhập');
    }
}

/**
 * Xóa session
 */
function _clearSession() {
    try {
        localStorage.removeItem('session');
    } catch (error) {
        console.error('Error clearing session:', error);
    }
}

/**
 * Lấy session hiện tại
 * @returns {Object|null} - Session object hoặc null
 */
function _getSession() {
    try {
        const session = localStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Error loading session:', error);
        return null;
    }
}

// Public API

/**
 * Đăng ký người dùng mới
 * @param {string} username - Tên đăng nhập
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {Object} - {success: boolean, message: string, user?: Object}
 */
function register(username, email, password) {
    // Validate inputs
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        return { success: false, message: usernameValidation.message };
    }
    
    if (!validateEmail(email)) {
        return { success: false, message: 'Email không hợp lệ' };
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message };
    }
    
    // Check for duplicates
    if (_findUserByUsername(username)) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }
    
    if (_findUserByEmail(email)) {
        return { success: false, message: 'Email đã được sử dụng' };
    }
    
    // Create new user
    const user = {
        id: generateId(),
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Save user
    try {
        const users = _getUsers();
        users.push(user);
        _saveUsers(users);
        
        return {
            success: true,
            message: 'Đăng ký thành công',
            user: user
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Đăng ký thất bại'
        };
    }
}

/**
 * Đăng nhập
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {Object} - {success: boolean, message: string, user?: Object}
 */
function login(email, password) {
    // Validate inputs
    if (!email || !password) {
        return { success: false, message: 'Vui lòng nhập email và mật khẩu' };
    }
    
    // Find user
    const user = _findUserByEmail(email);
    if (!user) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }
    
    // Verify password
    if (user.password !== password) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    const users = _getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        _saveUsers(users);
    }
    
    // Create session
    try {
        _createSession(user);
        return {
            success: true,
            message: 'Đăng nhập thành công',
            user: user
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Đăng nhập thất bại'
        };
    }
}

/**
 * Đăng xuất
 */
function logout() {
    _clearSession();
}

/**
 * Kiểm tra trạng thái đăng nhập
 * @returns {boolean} - true nếu đã đăng nhập
 */
function isLoggedIn() {
    return _getSession() !== null;
}

/**
 * Lấy thông tin user hiện tại
 * @returns {Object|null} - User object hoặc null
 */
function getCurrentUser() {
    const session = _getSession();
    if (!session) {
        return null;
    }
    
    const user = _findUserByEmail(session.email);
    return user || null;
}

/**
 * Khởi tạo tài khoản admin mặc định
 * Chỉ tạo nếu chưa tồn tại
 */
function initDefaultAdmin() {
    const adminEmail = 'longsexgay@admin.com';
    const adminPassword = '123456';
    const adminUsername = 'admin';
    
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = _findUserByEmail(adminEmail);
    if (existingAdmin) {
        return; // Admin đã tồn tại, không cần tạo lại
    }
    
    // Tạo tài khoản admin
    const adminUser = {
        id: generateId(),
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    try {
        const users = _getUsers();
        users.push(adminUser);
        _saveUsers(users);
        console.log('Đã khởi tạo tài khoản admin mặc định');
    } catch (error) {
        console.error('Lỗi khi khởi tạo admin:', error);
    }
}

// Khởi tạo admin khi module được load
initDefaultAdmin();

// ============================================
// ALIAS TIENG VIET - Vietnamese Aliases
// ============================================

/**
 * Kiem tra dinh dang email
 */
const kiemTraEmail = validateEmail;

/**
 * Kiem tra mat khau
 */
const kiemTraMatKhau = validatePassword;

/**
 * Kiem tra ten dang nhap
 */
const kiemTraTenDangNhap = validateUsername;

/**
 * Dang ky nguoi dung moi
 */
const dangKy = register;

/**
 * Dang nhap
 */
const dangNhap = login;

/**
 * Dang xuat
 */
const dangXuat = logout;

/**
 * Kiem tra trang thai dang nhap
 */
const kiemTraDangNhap = isLoggedIn;

/**
 * Lay thong tin nguoi dung hien tai
 */
const layNguoiDungHienTai = getCurrentUser;

/**
 * Khoi tao tai khoan admin mac dinh
 */
const khoiTaoAdminMacDinh = initDefaultAdmin;
