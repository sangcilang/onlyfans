// Register page script

/**
 * Redirect nếu đã logged in
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = '../home/index.html';
    }
}

/**
 * Handle register form submit
 * @param {Event} event - Form submit event
 */
function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = register(username, email, password);
    
    if (result.success) {
        alert(result.message + ' Vui lòng đăng nhập.');
        window.location.href = '../login/index.html';
    } else {
        alert(result.message);
    }
}

// Check if already logged in
redirectIfLoggedIn();
