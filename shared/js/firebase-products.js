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
                description: 'Quạt trần Panasonic F-60TDN với 5 cánh quạt cao cấp, thiết kế sang trọng phù hợp với mọi không gian nội thất. Động cơ tiết kiệm điện, vận hành êm ái với 3 tốc độ gió. Đường kính cánh 60cm, phù hợp phòng rộng từ 20-35m².',
                category: 'Quạt trần',
                specifications: {
                    'Đường kính cánh': '60 cm',
                    'Số cánh': '5',
                    'Công suất': '55W',
                    'Số tốc độ': '3',
                    'Điện áp': '220V - 50Hz',
                    'Xuất xứ': 'Nhật Bản'
                },
                createdAt: new Date().toISOString()
            },
            '2': {
                name: 'Quạt Đứng Senko DCN1806 Công Suất Lớn',
                price: 450000,
                image: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=300',
                badge: 'Rẻ vô địch',
                sold: '5,6k',
                description: 'Quạt đứng Senko DCN1806 với công suất lớn, lưu lượng gió mạnh mẽ. Thân quạt chắc chắn, chân đế rộng chống đổ ngã. Có chức năng hẹn giờ tắt tự động và điều chỉnh góc quay 90°. Phù hợp cho gia đình, văn phòng và xưởng sản xuất.',
                category: 'Quạt đứng',
                specifications: {
                    'Đường kính cánh': '40 cm',
                    'Số cánh': '5',
                    'Công suất': '60W',
                    'Số tốc độ': '3',
                    'Góc quay': '90°',
                    'Điện áp': '220V - 50Hz',
                    'Xuất xứ': 'Việt Nam'
                },
                createdAt: new Date().toISOString()
            },
            '3': {
                name: 'Quạt Tích Điện Thông Minh Xiaomi Gen 3',
                price: 1890000,
                image: 'https://images.unsplash.com/photo-1544641913-e9d6824905a9?auto=format&fit=crop&q=80&w=300',
                badge: 'Mall',
                sold: '800',
                description: 'Quạt tích điện Xiaomi Gen 3 với pin dung lượng lớn 10000mAh, sử dụng liên tục lên đến 20 giờ. Kết nối điều khiển qua app Mi Home, hỗ trợ 12 tốc độ gió. Thiết kế tối giản hiện đại, phù hợp mọi không gian.',
                category: 'Quạt tích điện',
                specifications: {
                    'Dung lượng pin': '10000 mAh',
                    'Thời gian sử dụng': 'Lên đến 20 giờ',
                    'Số tốc độ': '12',
                    'Kết nối': 'Bluetooth / Wi-Fi',
                    'Công suất sạc': '18W',
                    'Xuất xứ': 'Trung Quốc'
                },
                createdAt: new Date().toISOString()
            },
            '4': {
                name: 'Quạt Điều Hòa Hơi Nước Sunhouse SHD7727',
                price: 2450000,
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=300',
                badge: 'Giảm 20%',
                sold: '300',
                description: 'Quạt điều hòa hơi nước Sunhouse SHD7727 kết hợp làm mát và tạo độ ẩm, giúp không khí trong lành hơn. Bình chứa nước 7 lít, có thể thêm đá để tăng hiệu quả làm mát. Điều khiển từ xa tiện lợi, hẹn giờ tắt tự động.',
                category: 'Quạt điều hòa',
                specifications: {
                    'Dung tích bình nước': '7 lít',
                    'Công suất': '80W',
                    'Lưu lượng gió': '600 m³/h',
                    'Số tốc độ': '3',
                    'Điều khiển': 'Remote',
                    'Điện áp': '220V - 50Hz'
                },
                createdAt: new Date().toISOString()
            },
            '5': {
                name: 'Quạt Bàn Mitsubishi D16-GV Có Hẹn Giờ',
                price: 950000,
                image: 'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '1,1k',
                description: 'Quạt bàn Mitsubishi D16-GV với thiết kế nhỏ gọn, phù hợp đặt trên bàn làm việc hoặc đầu giường. Chức năng hẹn giờ tắt từ 1-7 giờ, 3 tốc độ gió. Vận hành êm ái, tiết kiệm điện năng.',
                category: 'Quạt bàn',
                specifications: {
                    'Đường kính cánh': '40 cm',
                    'Công suất': '45W',
                    'Số tốc độ': '3',
                    'Hẹn giờ': '1-7 giờ',
                    'Điện áp': '220V - 50Hz',
                    'Xuất xứ': 'Nhật Bản'
                },
                createdAt: new Date().toISOString()
            },
            '6': {
                name: 'Quạt Treo Tường Asia L16006 Remote',
                price: 680000,
                image: 'https://images.unsplash.com/photo-1622838320004-71155c3e3bbd?auto=format&fit=crop&q=80&w=300',
                badge: 'Bán chạy',
                sold: '2,2k',
                description: 'Quạt treo tường Asia L16006 tiết kiệm diện tích, phù hợp cho phòng nhỏ, hành lang, nhà bếp. Điều khiển từ xa tiện lợi, góc quay 90°. Lắp đặt đơn giản với bộ phụ kiện đi kèm.',
                category: 'Quạt treo tường',
                specifications: {
                    'Đường kính cánh': '40 cm',
                    'Công suất': '55W',
                    'Số tốc độ': '3',
                    'Góc quay': '90°',
                    'Điều khiển': 'Remote',
                    'Điện áp': '220V - 50Hz'
                },
                createdAt: new Date().toISOString()
            },
            '7': {
                name: 'Quạt Hộp Tản Gió KDK C3TRK Cao Cấp',
                price: 1200000,
                image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '150',
                description: '',
                category: 'Quạt thông gió',
                specifications: {},
                createdAt: new Date().toISOString()
            },
            '8': {
                name: 'Quạt Mini Cầm Tay Tích Điện USB',
                price: 99000,
                image: 'https://images.unsplash.com/photo-1591193512858-aa2072120ecf?auto=format&fit=crop&q=80&w=300',
                badge: 'Chỉ 99k',
                sold: '10k+',
                description: 'Quạt mini cầm tay tích điện USB siêu nhỏ gọn, tiện mang theo khi ra ngoài. Sạc qua cổng USB, pin dùng được 4-6 giờ. Có 2 tốc độ gió, trọng lượng chỉ 150g.',
                category: 'Quạt mini',
                specifications: {
                    'Dung lượng pin': '2000 mAh',
                    'Thời gian sử dụng': '4-6 giờ',
                    'Số tốc độ': '2',
                    'Trọng lượng': '150g',
                    'Sạc': 'USB'
                },
                createdAt: new Date().toISOString()
            },
            '9': {
                name: 'Quạt Tháp Tiross TS9182 Có Điều Khiển',
                price: 2150000,
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=300',
                badge: 'Mall',
                sold: '450',
                description: 'Quạt tháp Tiross TS9182 thiết kế hiện đại, phù hợp phòng khách sang trọng. Quay 360° tự động, 12 tốc độ gió, điều khiển từ xa. Màn hình LED hiển thị tốc độ và hẹn giờ.',
                category: 'Quạt tháp',
                specifications: {
                    'Chiều cao': '110 cm',
                    'Công suất': '45W',
                    'Số tốc độ': '12',
                    'Góc quay': '360°',
                    'Điều khiển': 'Remote',
                    'Màn hình': 'LED'
                },
                createdAt: new Date().toISOString()
            },
            '10': {
                name: 'Quạt Thông Gió Vinawind QTT300-PN',
                price: 320000,
                image: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=300',
                badge: 'Bền bỉ',
                sold: '900',
                description: '',
                category: 'Quạt thông gió',
                specifications: {},
                createdAt: new Date().toISOString()
            },
            '11': {
                name: 'Quạt Trần Panasonic Gen 2',
                price: 1500000,
                image: 'https://images.unsplash.com/photo-1591193512858-aa2072120ecf?auto=format&fit=crop&q=80&w=300',
                badge: 'Yêu thích',
                sold: '1,2k',
                description: 'Quạt trần Panasonic thế hệ 2 với thiết kế cải tiến, tiết kiệm điện hơn 20% so với thế hệ trước. 4 cánh quạt nhôm đúc, bền bỉ theo thời gian. Phù hợp phòng rộng 15-25m².',
                category: 'Quạt trần',
                specifications: {
                    'Đường kính cánh': '56 cm',
                    'Số cánh': '4',
                    'Công suất': '45W',
                    'Số tốc độ': '3',
                    'Điện áp': '220V - 50Hz',
                    'Xuất xứ': 'Nhật Bản'
                },
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
 * Chuẩn hóa sản phẩm — đảm bảo 3 trường mới luôn có giá trị mặc định
 * (inline, không phụ thuộc vào products.js)
 * @param {Object} product
 * @returns {Object}
 */
function normalizeFirebaseProduct(product) {
    return {
        description: '',
        category: '',
        specifications: {},
        ...product
    };
}

/**
 * Lấy tất cả sản phẩm từ Firebase
 */
async function firebaseGetAllProducts() {
    try {
        const snapshot = await database.ref('products').once('value');
        const productsObj = snapshot.val() || {};
        
        // Convert object to array và áp dụng normalizeProduct
        return Object.keys(productsObj).map(id => normalizeFirebaseProduct({
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
            return normalizeFirebaseProduct({
                id: id,
                ...snapshot.val()
            });
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
            description: product.description !== undefined ? product.description : '',
            category: product.category !== undefined ? product.category : '',
            specifications: product.specifications !== undefined ? product.specifications : {},
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

        // Đảm bảo 3 trường mới được persist khi được cung cấp trong updates
        if (updates.description !== undefined) {
            updateData.description = updates.description;
        }
        if (updates.category !== undefined) {
            updateData.category = updates.category;
        }
        if (updates.specifications !== undefined) {
            updateData.specifications = updates.specifications;
        }
        
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
