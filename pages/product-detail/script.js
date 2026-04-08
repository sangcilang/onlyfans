// Product Detail Page Script

// Global state
let currentProductId = null;
let currentUserId = null;
let currentReview = null;
let selectedRating = 0;
let uploadedImages = [];
let isEditMode = false;

/**
 * Get productId from URL query string
 */
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('productId');
}

/**
 * Display product information
 */
function displayProductInfo(product) {
    const container = document.getElementById('product-detail-container');
    
    if (!product) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Không tìm thấy sản phẩm</h2>
                <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <a href="../../index.html" class="btn btn-primary">Quay về trang chủ</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image-section">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            
            <div class="product-info-section">
                <h1 class="product-name">${product.name}</h1>
                
                <div class="product-meta">
                    <span class="product-sold">Đã bán: ${product.sold || '0'}</span>
                    ${product.stock !== undefined ? `<span class="product-stock">Còn lại: ${product.stock}</span>` : ''}
                </div>
                
                <div class="product-price">
                    <span class="price-value">${formatPrice(product.price)}</span>
                </div>
                
                <div class="product-description">
                    <h3>Mô tả sản phẩm</h3>
                    <p>${product.description || 'Sản phẩm chất lượng cao, được nhập khẩu chính hãng. Bảo hành đầy đủ theo quy định của nhà sản xuất.'}</p>
                </div>
                
                <div class="product-actions">
                    <button id="add-to-cart-btn" class="btn btn-primary btn-large">
                        <span class="btn-icon">🛒</span>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => handleAddToCart(product));
    }
}

/**
 * Handle "Add to Cart" functionality
 */
function handleAddToCart(product) {
    const result = addToCart(product.name, product.price);
    
    if (result.success) {
        displayNotification(result.message, 'success');
    } else {
        displayNotification(result.message, 'error');
    }
}

/**
 * Show notification message
 */
function displayNotification(message, type = 'info') {
    hienThiThongBao(message, type);
}

/**
 * Format price to Vietnamese currency
 */
function formatPrice(price) {
    return dinhDangTienTe(price);
}

/**
 * Render review form
 */
function renderReviewForm(productId) {
    const container = document.getElementById('review-form-container');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="message info">
                <p>Vui lòng <a href="../login/index.html">đăng nhập</a> để đánh giá sản phẩm.</p>
            </div>
        `;
        return;
    }
    
    currentUserId = currentUser.id;
    
    // Check if user has purchased this product
    if (!verifyPurchase(currentUserId, productId)) {
        container.innerHTML = `
            <div class="message warning">
                <p>Bạn cần mua sản phẩm này trước khi có thể đánh giá.</p>
            </div>
        `;
        return;
    }
    
    // Check if user already reviewed
    const existingReview = getReviewByUserAndProduct(currentUserId, productId);
    
    if (existingReview && !isEditMode) {
        container.innerHTML = `
            <div class="message info">
                <p>Bạn đã đánh giá sản phẩm này. <button onclick="editReview('${existingReview.id}')" class="btn btn-secondary" style="display: inline-block; padding: 8px 16px; margin-left: 8px;">Chỉnh sửa đánh giá</button></p>
            </div>
        `;
        return;
    }
    
    // Render form
    const review = isEditMode ? currentReview : null;
    selectedRating = review ? review.rating : 0;
    uploadedImages = review ? [...review.images] : [];
    
    container.innerHTML = `
        <h3>${isEditMode ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}</h3>
        
        <div class="star-rating-input">
            <label>Đánh giá của bạn</label>
            <div class="stars" id="star-rating">
                ${[1, 2, 3, 4, 5].map(i => `<span class="star ${i <= selectedRating ? 'active' : ''}" data-rating="${i}">★</span>`).join('')}
            </div>
        </div>
        
        <div class="comment-input">
            <label>Nhận xét</label>
            <textarea id="review-comment" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này (tối thiểu 10 ký tự)">${review ? review.comment : ''}</textarea>
            <div class="char-count"><span id="char-count">0</span>/1000</div>
        </div>
        
        <div class="image-upload">
            <label>Hình ảnh (tối đa 3 ảnh, mỗi ảnh < 2MB)</label>
            <input type="file" id="review-images" accept="image/jpeg,image/png,image/gif" multiple>
            <div class="image-preview" id="image-preview"></div>
        </div>
        
        <button onclick="submitReview()" class="btn btn-primary btn-submit-review">${isEditMode ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</button>
        ${isEditMode ? '<button onclick="cancelEdit()" class="btn btn-secondary" style="margin-left: 12px;">Hủy</button>' : ''}
    `;
    
    // Setup event listeners
    setupStarRating();
    setupCommentInput();
    setupImageUpload();
    updateImagePreview();
}

/**
 * Setup star rating interaction
 */
function setupStarRating() {
    const stars = document.querySelectorAll('#star-rating .star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay();
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    document.getElementById('star-rating').addEventListener('mouseleave', updateStarDisplay);
}

/**
 * Update star display
 */
function updateStarDisplay() {
    const stars = document.querySelectorAll('#star-rating .star');
    stars.forEach((star, i) => {
        if (i < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

/**
 * Setup comment input
 */
function setupCommentInput() {
    const textarea = document.getElementById('review-comment');
    const charCount = document.getElementById('char-count');
    
    textarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
        
        if (this.value.length > 1000) {
            this.value = this.value.substring(0, 1000);
            charCount.textContent = 1000;
        }
    });
    
    // Initial count
    charCount.textContent = textarea.value.length;
}

/**
 * Setup image upload
 */
function setupImageUpload() {
    const input = document.getElementById('review-images');
    
    input.addEventListener('change', async function() {
        const files = Array.from(this.files);
        
        if (uploadedImages.length + files.length > 3) {
            displayNotification('Chỉ được tải lên tối đa 3 ảnh', 'error');
            this.value = '';
            return;
        }
        
        try {
            const newImages = await processImages(files, true, 200);
            uploadedImages = [...uploadedImages, ...newImages];
            updateImagePreview();
            this.value = '';
        } catch (error) {
            displayNotification(error.message, 'error');
            this.value = '';
        }
    });
}

/**
 * Update image preview
 */
function updateImagePreview() {
    const preview = document.getElementById('image-preview');
    
    if (uploadedImages.length === 0) {
        preview.innerHTML = '';
        return;
    }
    
    preview.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

/**
 * Remove image
 */
function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

/**
 * Submit review
 */
async function submitReview() {
    const comment = document.getElementById('review-comment').value.trim();
    
    // Validation
    if (selectedRating === 0) {
        displayNotification('Vui lòng chọn số sao đánh giá', 'error');
        return;
    }
    
    if (comment.length < 10) {
        displayNotification('Nhận xét phải có ít nhất 10 ký tự', 'error');
        return;
    }
    
    if (comment.length > 1000) {
        displayNotification('Nhận xét không được vượt quá 1000 ký tự', 'error');
        return;
    }
    
    try {
        const currentUser = getCurrentUser();
        
        if (isEditMode && currentReview) {
            // Update existing review
            updateReview(currentReview.id, {
                rating: selectedRating,
                comment: comment,
                images: uploadedImages
            });
            
            displayNotification('Cập nhật đánh giá thành công!', 'success');
        } else {
            // Create new review
            createReview({
                userId: currentUserId,
                productId: currentProductId,
                username: currentUser.username,
                rating: selectedRating,
                comment: comment,
                images: uploadedImages
            });
            
            displayNotification('Gửi đánh giá thành công!', 'success');
        }
        
        // Reset form
        isEditMode = false;
        currentReview = null;
        selectedRating = 0;
        uploadedImages = [];
        
        // Refresh displays
        renderReviewForm(currentProductId);
        renderReviewSummary(currentProductId);
        renderReviewDisplay(currentProductId);
        
    } catch (error) {
        displayNotification(error.message, 'error');
    }
}

/**
 * Edit review
 */
function editReview(reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
        displayNotification('Không tìm thấy đánh giá', 'error');
        return;
    }
    
    isEditMode = true;
    currentReview = review;
    renderReviewForm(currentProductId);
}

/**
 * Cancel edit
 */
function cancelEdit() {
    isEditMode = false;
    currentReview = null;
    selectedRating = 0;
    uploadedImages = [];
    renderReviewForm(currentProductId);
}

/**
 * Delete review
 */
function deleteReviewHandler(reviewId) {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        return;
    }
    
    try {
        deleteReview(reviewId);
        displayNotification('Xóa đánh giá thành công!', 'success');
        
        // Refresh displays
        renderReviewForm(currentProductId);
        renderReviewSummary(currentProductId);
        renderReviewDisplay(currentProductId);
    } catch (error) {
        displayNotification(error.message, 'error');
    }
}

/**
 * Render review summary
 */
function renderReviewSummary(productId) {
    const container = document.getElementById('review-summary');
    const reviews = getReviewsByProduct(productId);
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Chưa có đánh giá nào</p>';
        return;
    }
    
    const avgRating = calculateAverageRating(productId);
    const distribution = [5, 4, 3, 2, 1].map(rating => {
        const count = reviews.filter(r => r.rating === rating).length;
        const percentage = (count / reviews.length) * 100;
        return { rating, count, percentage };
    });
    
    container.innerHTML = `
        <div class="average-rating">
            <div class="rating-number">${avgRating.toFixed(1)}</div>
            <div class="rating-stars">
                <div class="stars">${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}</div>
                <div class="total-reviews">${reviews.length} đánh giá</div>
            </div>
        </div>
        
        <div class="rating-distribution">
            ${distribution.map(d => `
                <div class="rating-bar">
                    <span>${d.rating}★</span>
                    <div class="bar">
                        <div class="fill" style="width: ${d.percentage}%"></div>
                    </div>
                    <span>${d.count}</span>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render review display
 */
function renderReviewDisplay(productId) {
    const container = document.getElementById('review-list');
    const reviews = getReviewsByProduct(productId);
    const currentUser = getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : null;
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews">
                <p>Chưa có đánh giá nào cho sản phẩm này</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const date = new Date(review.createdAt);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const isOwner = currentUserId === review.userId;
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="user-info">
                        <span class="username">${review.username}</span>
                        ${review.isVerifiedPurchaser ? '<span class="verified-badge">✓ Đã mua hàng</span>' : ''}
                    </div>
                    ${isOwner ? `
                        <div class="review-actions">
                            <button class="btn-edit" onclick="editReview('${review.id}')">Sửa</button>
                            <button class="btn-delete" onclick="deleteReviewHandler('${review.id}')">Xóa</button>
                        </div>
                    ` : ''}
                </div>
                
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                
                <div class="review-comment">${review.comment}</div>
                
                ${review.images && review.images.length > 0 ? `
                    <div class="review-images">
                        ${review.images.map(img => `<img src="${img}" alt="Review image" onclick="window.open('${img}', '_blank')">`).join('')}
                    </div>
                ` : ''}
                
                <div class="review-date">${dateStr}</div>
            </div>
        `;
    }).join('');
}

/**
 * Initialize page
 */
function initProductDetailPage() {
    currentProductId = getProductIdFromURL();
    
    if (!currentProductId) {
        const container = document.getElementById('product-detail-container');
        container.innerHTML = `
            <div class="error-message">
                <h2>Thiếu thông tin sản phẩm</h2>
                <p>Vui lòng chọn sản phẩm từ danh sách.</p>
                <a href="../../index.html" class="btn btn-primary">Quay về trang chủ</a>
            </div>
        `;
        return;
    }
    
    const product = getProductById(currentProductId);
    displayProductInfo(product);
    
    if (product) {
        renderReviewSummary(currentProductId);
        renderReviewForm(currentProductId);
        renderReviewDisplay(currentProductId);
    }
}

// Initialize page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetailPage);
} else {
    initProductDetailPage();
}
