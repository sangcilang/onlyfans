// Firebase Authentication Module
// Thay thế localStorage auth bằng Firebase Auth

/**
 * Đăng ký người dùng mới với Firebase
 */
async function firebaseRegister(username, email, password) {
    try {
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
        
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save additional user data to Realtime Database
        await database.ref('users/' + user.uid).set({
            username: username,
            email: email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        
        return {
            success: true,
            message: 'Đăng ký thành công',
            user: {
                id: user.uid,
                username: username,
                email: email
            }
        };
    } catch (error) {
        console.error('Firebase register error:', error);
        
        // Handle Firebase errors
        let message = 'Đăng ký thất bại';
        if (error.code === 'auth/email-already-in-use') {
            message = 'Email đã được sử dụng';
        } else if (error.code === 'auth/weak-password') {
            message = 'Mật khẩu quá yếu';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Email không hợp lệ';
        }
        
        return { success: false, message: message };
    }
}

/**
 * Đăng nhập với Firebase
 */
async function firebaseLogin(email, password) {
    try {
        if (!email || !password) {
            return { success: false, message: 'Vui lòng nhập email và mật khẩu' };
        }
        
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login
        await database.ref('users/' + user.uid + '/lastLogin').set(new Date().toISOString());
        
        // Get user data
        const snapshot = await database.ref('users/' + user.uid).once('value');
        const userData = snapshot.val();
        
        return {
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                id: user.uid,
                username: userData.username,
                email: user.email
            }
        };
    } catch (error) {
        console.error('Firebase login error:', error);
        
        let message = 'Đăng nhập thất bại';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = 'Email hoặc mật khẩu không đúng';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Email không hợp lệ';
        } else if (error.code === 'auth/user-disabled') {
            message = 'Tài khoản đã bị vô hiệu hóa';
        }
        
        return { success: false, message: message };
    }
}

/**
 * Đăng xuất Firebase
 */
async function firebaseLogout() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('Firebase logout error:', error);
        return { success: false };
    }
}

/**
 * Kiểm tra trạng thái đăng nhập Firebase
 */
function firebaseIsLoggedIn() {
    return auth.currentUser !== null;
}

/**
 * Lấy thông tin user hiện tại từ Firebase
 */
async function firebaseGetCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        return null;
    }
    
    try {
        const snapshot = await database.ref('users/' + user.uid).once('value');
        const userData = snapshot.val();
        
        return {
            id: user.uid,
            username: userData.username,
            email: user.email
        };
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

/**
 * Listen to auth state changes
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user.email);
    } else {
        console.log('User signed out');
    }
});
