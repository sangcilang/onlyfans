// Products management module

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
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        // Migration: Thêm trường stock cho các sản phẩm cũ nếu chưa có
        let needsUpdate = false;
        products = products.map(product => {
            if (product.stock === undefined) {
                needsUpdate = true;
                return {
                    ...product,
                    stock: Math.floor(Math.random() * 150) + 10 // Random stock từ 10-160
                };
            }
            return product;
        });
        
        if (needsUpdate) {
            localStorage.setItem('products', JSON.stringify(products));
            console.log('✅ Đã cập nhật trường stock cho các sản phẩm hiện có');
        }
    }
    
    return products;
}

/**
 * Lấy tất cả sản phẩm
 */
function getAllProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

/**
 * Lấy sản phẩm theo ID
 */
function getProductById(id) {
    const products = getAllProducts();
    return products.find(p => p.id === id);
}

/**
 * Thêm sản phẩm mới
 */
function addProduct(product) {
    const products = getAllProducts();
    const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        price: parseInt(product.price),
        image: product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
        badge: product.badge || '',
        sold: product.sold || '0',
        stock: product.stock ? parseInt(product.stock) : 100,
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
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return null;
    }
    
    // Xử lý stock nếu có trong updates
    if (updates.stock !== undefined) {
        updates.stock = parseInt(updates.stock);
    }
    
    products[index] = {
        ...products[index],
        ...updates,
        price: parseInt(updates.price),
        id: id // Đảm bảo ID không thay đổi
    };
    
    localStorage.setItem('products', JSON.stringify(products));
    return products[index];
}

/**
 * Xóa sản phẩm
 */
function deleteProduct(id) {
    let products = getAllProducts();
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
