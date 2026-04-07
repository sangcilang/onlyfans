// Contact page script

/**
 * Handle contact form submit
 * @param {Event} event - Form submit event
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const contactInfo = document.getElementById('contact-info').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !contactInfo || !message) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    
    alert('Cảm ơn bạn! Thông tin đã được gửi đến bộ phận chăm sóc khách hàng.');
    
    // Reset form
    event.target.reset();
}
