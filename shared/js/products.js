// Products management module

/**
 * Chuẩn hóa sản phẩm — đảm bảo 3 trường mới luôn có giá trị mặc định
 * @param {Object} product
 * @returns {Object}
 */
function normalizeProduct(product) {
    return {
        description: '',
        category: '',
        specifications: {},
        ...product
    };
}

/**
 * Khởi tạo sản phẩm mặc định
 */
function initDefaultProducts() {
    let products = JSON.parse(localStorage.getItem('products'));
    
    if (!products || products.length === 0) {
        products = [
            {
                id: '1',
                name: 'Quạt Trần Panasonic F-60TDN 5 Cánh',
                price: 4500000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2310b981" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Trần%3C/text%3E%3C/svg%3E',
                badge: 'Yêu thích',
                sold: '1,2k',
                stock: 45,
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
            {
                id: '2',
                name: 'Quạt Đứng Senko DCN1806 Công Suất Lớn',
                price: 450000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%233b82f6" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Đứng%3C/text%3E%3C/svg%3E',
                badge: 'Rẻ vô địch',
                sold: '5,6k',
                stock: 150,
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
            {
                id: '3',
                name: 'Quạt Tích Điện Thông Minh Xiaomi Gen 3',
                price: 1890000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236366f1" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Tích Điện%3C/text%3E%3C/svg%3E',
                badge: 'Mall',
                sold: '800',
                stock: 8,
                description: 'Quạt tích điện Xiaomi Gen 3 với pin dung lượng lớn 10000mAh, sử dụng liên tục lên đến 20 giờ. Kết nối điều khiển qua app Mi Home, hỗ trợ 12 tốc độ gió. Thiết kế tối giản hiện đại, phù hợp mọi không gian. Có thể dùng như sạc dự phòng cho điện thoại.',
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
            {
                id: '4',
                name: 'Quạt Điều Hòa Hơi Nước Sunhouse SHD7727',
                price: 2450000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f59e0b" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Điều Hòa%3C/text%3E%3C/svg%3E',
                badge: 'Giảm 20%',
                sold: '300',
                stock: 25,
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
            {
                id: '5',
                name: 'Quạt Bàn Mitsubishi D16-GV Có Hẹn Giờ',
                price: 950000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ef4444" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Bàn%3C/text%3E%3C/svg%3E',
                badge: 'Yêu thích',
                sold: '1,1k',
                stock: 80,
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
            {
                id: '6',
                name: 'Quạt Treo Tường Asia L16006 Remote',
                price: 680000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2314b8a6" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Treo Tường%3C/text%3E%3C/svg%3E',
                badge: 'Bán chạy',
                sold: '2,2k',
                stock: 120,
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
            {
                id: '7',
                name: 'Quạt Hộp Tản Gió KDK C3TRK Cao Cấp',
                price: 1200000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%238b5cf6" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Hộp%3C/text%3E%3C/svg%3E',
                badge: 'Yêu thích',
                sold: '150',
                stock: 35,
                description: '',
                category: 'Quạt thông gió',
                specifications: {},
                createdAt: new Date().toISOString()
            },
            {
                id: '8',
                name: 'Quạt Mini Cầm Tay Tích Điện USB',
                price: 99000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ec4899" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Mini%3C/text%3E%3C/svg%3E',
                badge: 'Chỉ 99k',
                sold: '10k+',
                stock: 200,
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
            {
                id: '9',
                name: 'Quạt Tháp Tiross TS9182 Có Điều Khiển',
                price: 2150000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2306b6d4" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Tháp%3C/text%3E%3C/svg%3E',
                badge: 'Mall',
                sold: '450',
                stock: 5,
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
            {
                id: '10',
                name: 'Quạt Thông Gió Vinawind QTT300-PN',
                price: 320000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2384cc16" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Thông Gió%3C/text%3E%3C/svg%3E',
                badge: 'Bền bỉ',
                sold: '900',
                stock: 90,
                description: '',
                category: 'Quạt thông gió',
                specifications: {},
                createdAt: new Date().toISOString()
            },
            {
                id: '11',
                name: 'Quạt Trần Panasonic Gen 2',
                price: 1500000,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2310b981" width="400" height="400"/%3E%3Ctext fill="white" font-size="30" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EQuạt Trần Gen 2%3C/text%3E%3C/svg%3E',
                badge: 'Yêu thích',
                sold: '1,2k',
                stock: 60,
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
        ];
        
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        // Migration: Thêm các trường còn thiếu cho các sản phẩm cũ
        let needsUpdate = false;
        products = products.map(product => {
            let updated = { ...product };
            if (product.stock === undefined) {
                needsUpdate = true;
                updated.stock = Math.floor(Math.random() * 150) + 10; // Random stock từ 10-160
            }
            if (product.description === undefined) {
                needsUpdate = true;
                updated.description = '';
            }
            if (product.category === undefined) {
                needsUpdate = true;
                updated.category = '';
            }
            if (product.specifications === undefined) {
                needsUpdate = true;
                updated.specifications = {};
            }
            return updated;
        });
        
        if (needsUpdate) {
            localStorage.setItem('products', JSON.stringify(products));
            console.log('✅ Đã cập nhật các trường mới cho các sản phẩm hiện có');
        }
    }
    
    return products;
}

/**
 * Lấy tất cả sản phẩm
 */
function getAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.map(normalizeProduct);
}

/**
 * Lấy sản phẩm theo ID
 */
function getProductById(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    return product ? normalizeProduct(product) : undefined;
}

/**
 * Thêm sản phẩm mới
 */
function addProduct(product) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        price: parseInt(product.price),
        image: product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
        badge: product.badge || '',
        sold: product.sold || '0',
        stock: product.stock ? parseInt(product.stock) : 100,
        description: product.description !== undefined ? product.description : '',
        category: product.category !== undefined ? product.category : '',
        specifications: product.specifications !== undefined ? product.specifications : {},
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
}

/**
 * Cập nhật sản phẩm
 */
function updateProduct(id, updates) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return null;
    }
    
    // Xử lý stock nếu có trong updates
    if (updates.stock !== undefined) {
        updates.stock = parseInt(updates.stock);
    }

    // Xử lý price nếu có trong updates
    const updatedPrice = updates.price !== undefined ? parseInt(updates.price) : products[index].price;

    products[index] = {
        ...products[index],
        ...updates,
        price: updatedPrice,
        id: id, // Đảm bảo ID không thay đổi
        // Giữ nguyên 3 trường mới nếu không cung cấp trong updates
        description: updates.description !== undefined ? updates.description : (products[index].description || ''),
        category: updates.category !== undefined ? updates.category : (products[index].category || ''),
        specifications: updates.specifications !== undefined ? updates.specifications : (products[index].specifications || {})
    };
    
    localStorage.setItem('products', JSON.stringify(products));
    return products[index];
}

/**
 * Xóa sản phẩm
 */
function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    return true;
}

// Khởi tạo sản phẩm mặc định khi load
initDefaultProducts();

// ============================================
// ALIAS TIENG VIET - Vietnamese Aliases
// ============================================

/**
 * Chuan hoa san pham
 */
const chuanHoaSanPham = normalizeProduct;

/**
 * Khoi tao san pham mac dinh
 */
const khoiTaoSanPhamMacDinh = initDefaultProducts;

/**
 * Lay tat ca san pham
 */
const layTatCaSanPham = getAllProducts;

/**
 * Lay san pham theo ID
 */
const laySanPhamTheoId = getProductById;

/**
 * Them san pham moi
 */
const themSanPham = addProduct;

/**
 * Cap nhat san pham
 */
const capNhatSanPham = updateProduct;

/**
 * Xoa san pham
 */
const xoaSanPham = deleteProduct;
