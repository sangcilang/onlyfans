// Database Adapter
// Tự động chuyển đổi giữa localStorage và Firebase
// Nếu Firebase được config -> dùng Firebase
// Nếu không -> fallback về localStorage

const USE_FIREBASE = typeof firebase !== 'undefined' && isFirebaseConfigured();

console.log(USE_FIREBASE ? '🔥 Using Firebase' : '💾 Using localStorage');

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function register(username, email, password) {
    if (USE_FIREBASE) {
        return await firebaseRegister(username, email, password);
    } else {
        // Fallback to localStorage (existing function)
        return registerLocal(username, email, password);
    }
}

async function login(email, password) {
    if (USE_FIREBASE) {
        return await firebaseLogin(email, password);
    } else {
        return loginLocal(email, password);
    }
}

async function logout() {
    if (USE_FIREBASE) {
        await firebaseLogout();
    } else {
        logoutLocal();
    }
}

function isLoggedIn() {
    if (USE_FIREBASE) {
        return firebaseIsLoggedIn();
    } else {
        return isLoggedInLocal();
    }
}

async function getCurrentUser() {
    if (USE_FIREBASE) {
        return await firebaseGetCurrentUser();
    } else {
        return getCurrentUserLocal();
    }
}

// ============================================
// PRODUCTS FUNCTIONS
// ============================================

async function getAllProducts() {
    if (USE_FIREBASE) {
        return await firebaseGetAllProducts();
    } else {
        return getAllProductsLocal();
    }
}

async function getProductById(id) {
    if (USE_FIREBASE) {
        return await firebaseGetProductById(id);
    } else {
        return getProductByIdLocal(id);
    }
}

async function addProduct(product) {
    if (USE_FIREBASE) {
        return await firebaseAddProduct(product);
    } else {
        return addProductLocal(product);
    }
}

async function updateProduct(id, updates) {
    if (USE_FIREBASE) {
        return await firebaseUpdateProduct(id, updates);
    } else {
        return updateProductLocal(id, updates);
    }
}

async function deleteProduct(id) {
    if (USE_FIREBASE) {
        return await firebaseDeleteProduct(id);
    } else {
        return deleteProductLocal(id);
    }
}

// ============================================
// RENAME EXISTING LOCALSTORAGE FUNCTIONS
// ============================================

// Rename existing auth.js functions
function registerLocal(username, email, password) {
    // Copy code from existing register() in auth.js
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
    
    if (_findUserByUsername(username)) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }
    
    if (_findUserByEmail(email)) {
        return { success: false, message: 'Email đã được sử dụng' };
    }
    
    const user = {
        id: generateId(),
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
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

function loginLocal(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Vui lòng nhập email và mật khẩu' };
    }
    
    const user = _findUserByEmail(email);
    if (!user) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }
    
    user.lastLogin = new Date().toISOString();
    const users = _getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        _saveUsers(users);
    }
    
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

function logoutLocal() {
    _clearSession();
}

function isLoggedInLocal() {
    return _getSession() !== null;
}

function getCurrentUserLocal() {
    const session = _getSession();
    if (!session) {
        return null;
    }
    
    const user = _findUserByEmail(session.email);
    return user || null;
}

// Rename existing products.js functions
function getAllProductsLocal() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

function getProductByIdLocal(id) {
    const products = getAllProductsLocal();
    return products.find(p => p.id === id);
}

function addProductLocal(product) {
    const products = getAllProductsLocal();
    const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        price: parseInt(product.price),
        image: product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
        badge: product.badge || '',
        sold: product.sold || '0',
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
}

function updateProductLocal(id, updates) {
    const products = getAllProductsLocal();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return null;
    }
    
    products[index] = {
        ...products[index],
        ...updates,
        price: parseInt(updates.price),
        id: id
    };
    
    localStorage.setItem('products', JSON.stringify(products));
    return products[index];
}

function deleteProductLocal(id) {
    let products = getAllProductsLocal();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    return true;
}
