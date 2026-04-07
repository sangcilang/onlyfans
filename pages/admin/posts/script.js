// Posts page script

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

function loadPostsTable() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const tbody = document.getElementById('posts-table');
    
    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Chưa có bài viết nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = posts.map((post, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${sanitizeInput(post.title)}</strong></td>
            <td><span class="blog-category">${sanitizeInput(post.category)}</span></td>
            <td>${new Date(post.date).toLocaleDateString('vi-VN')}</td>
            <td>
                <button class="action-btn btn-edit" onclick="viewPost('${post.id}')" title="Xem chi tiết">👁️</button>
                <button class="action-btn btn-edit" onclick="editPost('${post.id}')" title="Sửa bài viết">✏️</button>
                <button class="action-btn btn-delete" onclick="deletePost('${post.id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function showAddPostForm() {
    document.getElementById('add-post-form').style.display = 'block';
    document.getElementById('post-form-title').textContent = 'Thêm Bài Viết Mới';
    document.getElementById('post-id').value = '';
    document.getElementById('post-title').value = '';
    document.getElementById('post-category').value = 'Sản phẩm';
    document.getElementById('post-excerpt').value = '';
    document.getElementById('post-image').value = '';
}

function hideAddPostForm() {
    document.getElementById('add-post-form').style.display = 'none';
    document.getElementById('post-id').value = '';
    document.getElementById('post-title').value = '';
    document.getElementById('post-category').value = 'Sản phẩm';
    document.getElementById('post-excerpt').value = '';
    document.getElementById('post-image').value = '';
}

function viewPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        alert('Không tìm thấy bài viết');
        return;
    }
    
    const details = `
📰 CHI TIẾT BÀI VIẾT

📌 Tiêu đề: ${post.title}
📂 Danh mục: ${post.category}
✍️ Tác giả: ${post.author || 'N/A'}
📅 Ngày đăng: ${new Date(post.date).toLocaleString('vi-VN')}

📝 Nội dung:
${post.excerpt || post.content}

🖼️ Hình ảnh: ${post.image || 'Không có'}
    `.trim();
    
    alert(details);
}

function editPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        alert('Không tìm thấy bài viết');
        return;
    }
    
    document.getElementById('post-form-title').textContent = 'Sửa Bài Viết';
    document.getElementById('post-id').value = post.id;
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-excerpt').value = post.excerpt || post.content;
    document.getElementById('post-image').value = post.image || '';
    document.getElementById('add-post-form').style.display = 'block';
    
    document.getElementById('add-post-form').scrollIntoView({ behavior: 'smooth' });
}

function addBlogPost() {
    const id = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const image = document.getElementById('post-image').value.trim();
    
    if (!title || !excerpt) {
        alert('Vui lòng nhập đầy đủ tiêu đề và mô tả');
        return;
    }
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    if (id) {
        // Update existing post
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title: title,
                excerpt: excerpt,
                content: excerpt,
                category: category,
                image: image || posts[postIndex].image,
                updatedAt: new Date().toISOString()
            };
            alert('Đã cập nhật bài viết thành công!');
        }
    } else {
        // Add new post
        const newPost = {
            id: Date.now().toString(),
            title: title,
            excerpt: excerpt,
            content: excerpt,
            category: category,
            author: getCurrentUser().username,
            date: new Date().toISOString(),
            image: image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
        };
        posts.unshift(newPost);
        alert('Đã thêm bài viết thành công!');
    }
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    hideAddPostForm();
    loadPostsTable();
}

function deletePost(postId) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) {
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    loadPostsTable();
}

if (checkAdminAccess()) {
    loadPostsTable();
}
