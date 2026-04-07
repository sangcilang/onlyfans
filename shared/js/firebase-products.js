// Firebase Products Module
// Quản lý sản phẩm với Firebase Realtime Database

/**
 * Khởi tạo sản phẩm mặc định vào Firebase
 */
async function firebaseInitProducts() {
    try {
        // Check if products already exist
        const snapshot = await database.ref('products').once('value');
        if (snapshot.exists()) {
            console.log('Products already initialized');
            return;
        }
        
        // Default products
        const defaultProducts = {
            '1': {
                name: 'Quạt Trần Panasonic F-60TDN 5 Cánh',
                price: 4500000,
                image: 'https://images.unsplash.com/photo-1591193512858-aa2072120ecf?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '1,2k',
                createdAt: new Date().toISOString()
            },
            '2': {
                name: 'Quạt Đứng Senko DCN1806 Công Suất Lớn',
                price: 450000,
                image: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=300',
                badge: 'Rẻ vô địch',
                sold: '5,6k',
                createdAt: new Date().toISOString()
            },
            '3': {
                name: 'Quạt Tích Điện Thông Minh Xiaomi Gen 3',
                price: 1890000,
                image: 'https://images.unsplash.com/photo-1544641913-e9d6824905a9?auto=format&fit=crop&q=80&w=300',
                badge: 'Mall',
                sold: '800',
                createdAt: new Date().toISOString()
            },
            '4': {
                name: 'Quạt Điều Hòa Hơi Nước Sunhouse SHD7727',
                price: 2450000,
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=300',
                badge: 'Giảm 20%',
                sold: '300',
                createdAt: new Date().toISOString()
            },
            '5': {
                name: 'Quạt Bàn Mitsubishi D16-GV Có Hẹn Giờ',
                price: 950000,
                image: 'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '1,1k',
                createdAt: new Date().toISOString()
            },
            '6': {
                name: 'Quạt Treo Tường Asia L16006 Remote',
                price: 680000,
                image: 'https://images.unsplash.com/photo-1622838320004-71155c3e3bbd?auto=format&fit=crop&q=80&w=300',
                badge: 'Bán chạy',
                sold: '2,2k',
                createdAt: new Date().toISOString()
            },
            '7': {
                name: 'Quạt Hộp Tản Gió KDK C3TRK Cao Cấp',
                price: 1200000,
                image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '150',
                createdAt: new Date().toISOString()
            },
            '8': {
                name: 'Quạt Mini Cầm Tay Tích Điện USB',
                price: 99000,
                image: 'https://images.unsplash.com/photo-1591193512858-aa2072120ecf?auto=format&fit=crop&q=80&w=300',
                badge: 'Chỉ 99k',
                sold: '10k+',
                createdAt: new Date().toISOString()
            },
            '9': {
                name: 'Quạt Tháp Tiross TS9182 Có Điều Khiển',
                price: 2150000,
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=300',
                badge: 'Mall',
                sold: '450',
                createdAt: new Date().toISOString()
            },
            '10': {
                name: 'Quạt Thông Gió Vinawind QTT300-PN',
                price: 320000,
                image: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=300',
                badge: 'Bền bỉ',
                sold: '900',
                createdAt: new Date().toISOString()
            },
            '11': {
                name: 'Quạt Trần Panasonic Gen 2',
                price: 1500000,
                image: 'https://images.unsplash.com/photo-1591193512858-aa2072120ecf?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '1,2k',
                createdAt: new Date().toISOString()
            }
        };
        
        await database.ref('products').set(defaultProducts);
        console.log('✅ Default products initialized');
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

/**
 * Lấy tất cả sản phẩm từ Firebase
 */
async function firebaseGetAllProducts() {
    try {
        const snapshot = await database.ref('products').once('value');
        const productsObj = snapshot.val() || {};
        
        // Convert object to array
        return Object.keys(productsObj).map(id => ({
            id: id,
            ...productsObj[id]
        }));
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

/**
 * Lấy sản phẩm theo ID
 */
async function firebaseGetProductById(id) {
    try {
        const snapshot = await database.ref('products/' + id).once('value');
        if (snapshot.exists()) {
            return {
                id: id,
                ...snapshot.val()
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting product:', error);
        return null;
    }
}

/**
 * Thêm sản phẩm mới
 */
async function firebaseAddProduct(product) {
    try {
        const newProductRef = database.ref('products').push();
        const newProduct = {
            name: product.name,
            price: parseInt(product.price),
            image: product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
            badge: product.badge || '',
            sold: product.sold || '0',
            createdAt: new Date().toISOString()
        };
        
        await newProductRef.set(newProduct);
        
        return {
            id: newProductRef.key,
            ...newProduct
        };
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

/**
 * Cập nhật sản phẩm
 */
async function firebaseUpdateProduct(id, updates) {
    try {
        const updateData = {
            ...updates,
            price: parseInt(updates.price)
        };
        
        await database.ref('products/' + id).update(updateData);
        
        const snapshot = await database.ref('products/' + id).once('value');
        return {
            id: id,
            ...snapshot.val()
        };
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

/**
 * Xóa sản phẩm
 */
async function firebaseDeleteProduct(id) {
    try {
        await database.ref('products/' + id).remove();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// Initialize products when module loads
if (isFirebaseConfigured()) {
    firebaseInitProducts();
}
