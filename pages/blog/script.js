// Blog page script

/**
 * Initialize sample blog posts if not exists
 */
function initBlogPosts() {
    let posts = JSON.parse(localStorage.getItem('blogPosts'));
    
    if (!posts || posts.length === 0) {
        posts = [
            {
                id: '1',
                title: 'Top 5 Quạt Điện Tiết Kiệm Điện Nhất 2026',
                excerpt: 'Khám phá những mẫu quạt điện tiết kiệm điện năng hiệu quả nhất, giúp bạn giảm chi phí tiền điện mà vẫn mát mẻ cả mùa hè.',
                content: 'Nội dung chi tiết về các mẫu quạt tiết kiệm điện...',
                category: 'Sản phẩm',
                author: 'Admin',
                date: new Date().toISOString(),
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
            },
            {
                id: '2',
                title: 'Hướng Dẫn Bảo Dưỡng Quạt Điện Đúng Cách',
                excerpt: 'Cách vệ sinh và bảo dưỡng quạt điện để kéo dài tuổi thọ và duy trì hiệu suất hoạt động tốt nhất.',
                content: 'Nội dung chi tiết về bảo dưỡng quạt...',
                category: 'Hướng dẫn',
                author: 'Admin',
                date: new Date(Date.now() - 86400000).toISOString(),
                image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop'
            },
            {
                id: '3',
                title: 'Khuyến Mãi Mùa Hè - Giảm Giá Đến 30%',
                excerpt: 'Chương trình khuyến mãi lớn nhất trong năm! Giảm giá sốc cho tất cả các dòng quạt điện cao cấp.',
                content: 'Nội dung chi tiết về chương trình khuyến mãi...',
                category: 'Khuyến mãi',
                author: 'Admin',
                date: new Date(Date.now() - 172800000).toISOString(),
                image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop'
            },
            {
                id: '4',
                title: 'So Sánh Quạt Trần Và Quạt Đứng',
                excerpt: 'Phân tích ưu nhược điểm của quạt trần và quạt đứng để bạn lựa chọn loại phù hợp với không gian của mình.',
                content: 'Nội dung chi tiết về so sánh các loại quạt...',
                category: 'Sản phẩm',
                author: 'Admin',
                date: new Date(Date.now() - 259200000).toISOString(),
                image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop'
            },
            {
                id: '5',
                title: 'Xu Hướng Quạt Thông Minh 2026',
                excerpt: 'Tìm hiểu về công nghệ quạt thông minh mới nhất với điều khiển từ xa, hẹn giờ tự động và kết nối IoT.',
                content: 'Nội dung chi tiết về quạt thông minh...',
                category: 'Công nghệ',
                author: 'Admin',
                date: new Date(Date.now() - 345600000).toISOString(),
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
            },
            {
                id: '6',
                title: 'Mẹo Chọn Quạt Phù Hợp Với Diện Tích Phòng',
                excerpt: 'Hướng dẫn chi tiết cách chọn công suất và kích thước quạt phù hợp với diện tích phòng của bạn.',
                content: 'Nội dung chi tiết về cách chọn quạt...',
                category: 'Hướng dẫn',
                author: 'Admin',
                date: new Date(Date.now() - 432000000).toISOString(),
                image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop'
            }
        ];
        
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    
    return posts;
}

/**
 * Format date to Vietnamese
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get author initial
 */
function getAuthorInitial(author) {
    return author.charAt(0).toUpperCase();
}

/**
 * Render blog posts
 */
function renderBlogPosts() {
    const posts = initBlogPosts();
    const blogGrid = document.getElementById('blog-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (posts.length === 0) {
        blogGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    blogGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    blogGrid.innerHTML = posts.map(post => `
        <article class="blog-card" onclick="viewPost('${post.id}')">
            <img src="${post.image}" alt="${sanitizeInput(post.title)}" class="blog-image" onerror="this.src='https://via.placeholder.com/800x400?text=Blog+Image'">
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${sanitizeInput(post.category)}</span>
                    <span class="blog-date">📅 ${formatDate(post.date)}</span>
                </div>
                <h2 class="blog-title">${sanitizeInput(post.title)}</h2>
                <p class="blog-excerpt">${sanitizeInput(post.excerpt)}</p>
                <div class="blog-footer">
                    <div class="blog-author">
                        <div class="author-avatar">${getAuthorInitial(post.author)}</div>
                        <span>${sanitizeInput(post.author)}</span>
                    </div>
                    <a href="#" class="read-more" onclick="event.stopPropagation(); viewPost('${post.id}')">
                        Đọc thêm →
                    </a>
                </div>
            </div>
        </article>
    `).join('');
}

/**
 * View blog post detail
 */
function viewPost(postId) {
    // For now, just show an alert
    // In a real app, this would navigate to a detail page
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        alert(`Xem bài viết: ${post.title}\n\n${post.excerpt}\n\n(Tính năng xem chi tiết sẽ được phát triển sau)`);
    }
}

// Initialize blog page
renderBlogPosts();
