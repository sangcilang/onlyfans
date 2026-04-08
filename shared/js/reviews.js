// Review Management Module

/**
 * Generate unique review ID
 */
function generateReviewId() {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize text input to prevent XSS attacks
 */
function sanitizeInput(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate review data
 */
function validateReviewData(reviewData) {
    const errors = [];
    
    // Check required fields
    if (!reviewData.userId) errors.push('userId is required');
    if (!reviewData.productId) errors.push('productId is required');
    if (!reviewData.username) errors.push('username is required');
    
    // Validate rating
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        errors.push('rating must be between 1 and 5');
    }
    
    // Validate comment length
    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
        errors.push('comment must be at least 10 characters');
    }
    if (reviewData.comment && reviewData.comment.length > 1000) {
        errors.push('comment must not exceed 1000 characters');
    }
    
    // Validate images
    if (reviewData.images && reviewData.images.length > 3) {
        errors.push('maximum 3 images allowed');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Create a new review
 */
function createReview(reviewData) {
    // Validate data
    const validation = validateReviewData(reviewData);
    if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
    }
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Check for duplicate
    const existingReview = reviews.find(r => 
        r.userId === reviewData.userId && r.productId === reviewData.productId
    );
    
    if (existingReview) {
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }
    
    // Create review object
    const review = {
        id: generateReviewId(),
        userId: reviewData.userId,
        productId: reviewData.productId,
        username: reviewData.username,
        rating: parseInt(reviewData.rating),
        comment: sanitizeInput(reviewData.comment),
        images: reviewData.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerifiedPurchaser: verifyPurchase(reviewData.userId, reviewData.productId)
    };
    
    // Save to localStorage
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    return review;
}

/**
 * Update an existing review
 */
function updateReview(reviewId, updates) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
        throw new Error('Review not found');
    }
    
    const review = reviews[reviewIndex];
    
    // Update allowed fields
    if (updates.rating !== undefined) {
        if (updates.rating < 1 || updates.rating > 5) {
            throw new Error('rating must be between 1 and 5');
        }
        review.rating = parseInt(updates.rating);
    }
    
    if (updates.comment !== undefined) {
        if (updates.comment.trim().length < 10) {
            throw new Error('comment must be at least 10 characters');
        }
        if (updates.comment.length > 1000) {
            throw new Error('comment must not exceed 1000 characters');
        }
        review.comment = sanitizeInput(updates.comment);
    }
    
    if (updates.images !== undefined) {
        if (updates.images.length > 3) {
            throw new Error('maximum 3 images allowed');
        }
        review.images = updates.images;
    }
    
    review.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    reviews[reviewIndex] = review;
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    return review;
}

/**
 * Delete a review
 */
function deleteReview(reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const filteredReviews = reviews.filter(r => r.id !== reviewId);
    
    if (reviews.length === filteredReviews.length) {
        throw new Error('Review not found');
    }
    
    localStorage.setItem('reviews', JSON.stringify(filteredReviews));
    return true;
}

/**
 * Get all reviews for a product
 */
function getReviewsByProduct(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    return reviews
        .filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get review by user and product
 */
function getReviewByUserAndProduct(userId, productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    return reviews.find(r => r.userId === userId && r.productId === productId);
}

/**
 * Calculate average rating for a product
 */
function calculateAverageRating(productId) {
    const reviews = getReviewsByProduct(productId);
    
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
}

/**
 * Check if user can review a product
 */
function canUserReview(userId, productId) {
    // Check if user has purchased the product
    if (!verifyPurchase(userId, productId)) {
        return false;
    }
    
    // Check if user has already reviewed
    const existingReview = getReviewByUserAndProduct(userId, productId);
    return !existingReview;
}

/**
 * Verify if user has purchased a product
 */
function verifyPurchase(userId, productId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    return orders.some(order => {
        // Check if order belongs to user
        if (order.userId !== userId) return false;
        
        // Check if order is completed
        if (order.status !== 'Đã giao' && order.status !== 'Hoàn thành') return false;
        
        // Check if product is in order items
        if (!order.items || !Array.isArray(order.items)) return false;
        
        return order.items.some(item => item.productId === productId);
    });
}

/**
 * Get user's completed orders
 */
function getUserCompletedOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(order => 
        order.userId === userId && 
        (order.status === 'Đã giao' || order.status === 'Hoàn thành')
    );
}

// Vietnamese aliases
const taoDanhGia = createReview;
const capNhatDanhGia = updateReview;
const xoaDanhGia = deleteReview;
const layDanhGiaTheoSanPham = getReviewsByProduct;
const layDanhGiaTheoNguoiDungVaSanPham = getReviewByUserAndProduct;
const tinhDiemTrungBinh = calculateAverageRating;
const nguoiDungCoTheDanhGia = canUserReview;
const xacMinhMuaHang = verifyPurchase;
const layDonHangHoanThanh = getUserCompletedOrders;
