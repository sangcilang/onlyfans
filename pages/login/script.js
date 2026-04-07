// Login page script

/**
 * Redirect nếu đã logged in
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = '../home/index.html';
    }
}

/**
 * Handle login form submit
 * @param {Event} event - Form submit event
 */
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = login(email, password);
    
    if (result.success) {
        alert(result.message);
        window.location.href = '../home/index.html';
    } else {
        alert(result.message);
    }
}

// Check if already logged in
redirectIfLoggedIn();
