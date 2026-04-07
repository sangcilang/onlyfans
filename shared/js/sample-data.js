// Sample data generator for Fan Shop
// Tao du lieu mau cho he thong

/**
 * Tao tin tuc mau
 */
function taoTinTucMau() {
    const tinTuc = [];
    const titles = [
        'Top 10 Quạt Điện Tiết Kiệm Điện Nhất 2026',
        'Hướng Dẫn Bảo Dưỡng Quạt Điện Đúng Cách',
        'Khuyến Mãi Mùa Hè - Giảm Giá Đến 30%',
        'So Sánh Quạt Trần Và Quạt Đứng',
        'Xu Hướng Quạt Thông Minh 2026',
        'Mẹo Chọn Quạt Phù Hợp Với Diện Tích Phòng',
        'Quạt Điều Hòa Hơi Nước - Giải Pháp Làm Mát Tiết Kiệm',
        'Cách Vệ Sinh Quạt Trần An Toàn Tại Nhà',
        'Flash Sale Cuối Tuần - Giảm Đến 50%',
        'Quạt Mini - Giải Pháp Di Động Cho Mùa Hè',
        'Công Nghệ Inverter Trên Quạt Điện',
        'Top 5 Quạt Trần Đẹp Nhất Cho Phòng Khách',
        'Quạt Thông Gió - Giải Pháp Cho Không Gian Kín',
        'Mua Quạt Điện Trả Góp 0% Lãi Suất',
        'Cách Sử Dụng Quạt Điện An Toàn Cho Trẻ Em',
        'Quạt Tích Điện - Giải Pháp Khi Mất Điện',
        'So Sánh Quạt Điện Và Điều Hòa - Nên Chọn Gì?',
        'Quạt Tháp - Thiết Kế Hiện Đại, Tiết Kiệm Không Gian',
        'Bí Quyết Tiết Kiệm Điện Khi Dùng Quạt',
        'Quạt Điện Thông Minh Điều Khiển Bằng Giọng Nói',
        'Chương Trình Đổi Quạt Cũ Lấy Quạt Mới',
        'Quạt Hộp Công Nghiệp - Sức Gió Mạnh Mẽ',
        'Cách Khắc Phục Quạt Điện Kêu To',
        'Quạt Treo Tường - Tiết Kiệm Diện Tích',
        'Ưu Đãi Đặc Biệt Cho Khách Hàng Thân Thiết',
        'Quạt Điện Năng Lượng Mặt Trời',
        'Chọn Quạt Điện Phù Hợp Với Phong Thủy',
        'Quạt Điện Panasonic - Thương Hiệu Nhật Bản Uy Tín',
        'Mẹo Làm Mát Phòng Nhanh Chóng Với Quạt',
        'Sinh Nhật Fan Shop - Ưu Đãi Khủng Cả Tháng'
    ];
    
    const excerpts = [
        'Khám phá những mẫu quạt điện tiết kiệm điện năng hiệu quả nhất, giúp bạn giảm chi phí tiền điện mà vẫn mát mẻ cả mùa hè.',
        'Cách vệ sinh và bảo dưỡng quạt điện để kéo dài tuổi thọ và duy trì hiệu suất hoạt động tốt nhất.',
        'Chương trình khuyến mãi lớn nhất trong năm! Giảm giá sốc cho tất cả các dòng quạt điện cao cấp.',
        'Phân tích ưu nhược điểm của quạt trần và quạt đứng để bạn lựa chọn loại phù hợp với không gian của mình.',
        'Tìm hiểu về công nghệ quạt thông minh mới nhất với điều khiển từ xa, hẹn giờ tự động và kết nối IoT.',
        'Hướng dẫn chi tiết cách chọn công suất và kích thước quạt phù hợp với diện tích phòng của bạn.',
        'Quạt điều hòa hơi nước là lựa chọn hoàn hảo cho những ai muốn tiết kiệm điện năng nhưng vẫn mát mẻ.',
        'Hướng dẫn từng bước vệ sinh quạt trần đúng cách, an toàn và hiệu quả ngay tại nhà.',
        'Chỉ trong 48 giờ! Săn ngay các deal quạt điện giảm giá cực sốc, số lượng có hạn.',
        'Quạt mini cầm tay, quạt để bàn USB - những sản phẩm nhỏ gọn nhưng hiệu quả cho văn phòng và du lịch.',
        'Tìm hiểu về công nghệ Inverter giúp quạt điện tiết kiệm điện năng lên đến 60% so với quạt thường.',
        'Gợi ý những mẫu quạt trần thiết kế đẹp, hiện đại, phù hợp với mọi phong cách nội thất phòng khách.',
        'Quạt thông gió công nghiệp và gia đình - giải pháp hoàn hảo cho nhà bếp, nhà vệ sinh và không gian kín.',
        'Chương trình trả góp 0% lãi suất cho tất cả sản phẩm quạt điện, thời gian lên đến 12 tháng.',
        'Những lưu ý quan trọng khi sử dụng quạt điện trong nhà có trẻ nhỏ để đảm bảo an toàn tuyệt đối.',
        'Quạt tích điện với thời gian hoạt động lên đến 8 giờ, giải pháp hoàn hảo cho những lúc mất điện.',
        'Phân tích chi tiết ưu nhược điểm, chi phí sử dụng giữa quạt điện và điều hòa để bạn đưa ra lựa chọn phù hợp.',
        'Quạt tháp với thiết kế thon gọn, hiện đại, phù hợp với mọi không gian nội thất.',
        '10 mẹo đơn giản giúp bạn tiết kiệm đến 40% điện năng khi sử dụng quạt điện trong mùa hè.',
        'Công nghệ mới nhất: Quạt điện tích hợp trợ lý ảo, điều khiển bằng giọng nói tiếng Việt.',
        'Mang quạt cũ đến đổi lấy quạt mới, được hỗ trợ đến 500.000đ. Chương trình áp dụng đến hết tháng.',
        'Quạt hộp công nghiệp với lưu lượng gió lớn, phù hợp cho xưởng sản xuất, nhà kho và không gian rộng.',
        'Hướng dẫn tự khắc phục tình trạng quạt điện kêu to, rung lắc bất thường ngay tại nhà.',
        'Quạt treo tường là lựa chọn thông minh cho những không gian nhỏ, tiết kiệm diện tích sàn nhà.',
        'Tích điểm đổi quà, giảm giá 15% cho lần mua tiếp theo và nhiều ưu đãi hấp dẫn khác.',
        'Công nghệ xanh: Quạt điện sử dụng năng lượng mặt trời, thân thiện với môi trường và tiết kiệm chi phí.',
        'Tư vấn chọn màu sắc, vị trí đặt quạt điện hợp phong thủy để mang lại may mắn cho gia đình.',
        'Tìm hiểu về dòng quạt điện Panasonic - thương hiệu hàng đầu từ Nhật Bản với chất lượng vượt trội.',
        'Những mẹo đơn giản giúp phòng của bạn mát mẻ nhanh chóng chỉ với quạt điện thông thường.',
        'Kỷ niệm 5 năm thành lập, Fan Shop tri ân khách hàng với hàng ngàn ưu đãi hấp dẫn suốt cả tháng.'
    ];
    
    const categories = ['Sản phẩm', 'Hướng dẫn', 'Khuyến mãi', 'Công nghệ'];
    
    for (let i = 0; i < 30; i++) {
        tinTuc.push({
            id: `${i + 1}`,
            title: titles[i],
            excerpt: excerpts[i],
            content: `Nội dung chi tiết về ${titles[i].toLowerCase()}...`,
            category: categories[Math.floor(Math.random() * categories.length)],
            author: 'Admin',
            date: new Date(Date.now() - i * 86400000).toISOString(),
            image: `https://picsum.photos/seed/blog${i + 1}/800/400`
        });
    }
    
    return tinTuc;
}

/**
 * Tao 20 nguoi dung mau
 */
function taoNguoiDungMau() {
    const danhSachTen = [
        'Nguyen Van An', 'Tran Thi Binh', 'Le Van Cuong', 'Pham Thi Dung',
        'Hoang Van Em', 'Vo Thi Phuong', 'Dang Van Giang', 'Bui Thi Ha',
        'Do Van Hung', 'Ngo Thi Lan', 'Truong Van Khanh', 'Ly Thi Mai',
        'Vuong Van Nam', 'Duong Thi Oanh', 'Phan Van Phuc', 'Trinh Thi Quynh',
        'Dinh Van Son', 'Ha Thi Thao', 'Lam Van Tuan', 'Cao Thi Uyen'
    ];
    
    const nguoiDung = [];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
        const ten = danhSachTen[i];
        const tenKhongDau = ten.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/\s+/g, '');
        
        nguoiDung.push({
            id: `user_${i + 1}_${now}`,
            username: tenKhongDau,
            email: `${tenKhongDau}@example.com`,
            password: '123456',
            createdAt: new Date(now - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return nguoiDung;
}

/**
 * Tao 100 san pham mau
 */
function taoSanPhamMau() {
    const loaiQuat = [
        'Quạt Trần', 'Quạt Đứng', 'Quạt Bàn', 'Quạt Treo Tường',
        'Quạt Hộp', 'Quạt Mini', 'Quạt Tháp', 'Quạt Thông Gió',
        'Quạt Điều Hòa', 'Quạt Tích Điện'
    ];
    
    const thuongHieu = [
        'Panasonic', 'Senko', 'Xiaomi', 'Sunhouse', 'Mitsubishi',
        'Asia', 'KDK', 'Tiross', 'Vinawind', 'Toshiba',
        'Daikin', 'Sharp', 'Hitachi', 'Samsung', 'LG'
    ];
    
    const badge = [
        'Yêu thích', 'Bán chạy', 'Giảm giá', 'Mới', 'Hot',
        'Sale', 'Rẻ nhất', 'Cao cấp', 'Tiết kiệm điện', ''
    ];
    
    const sanPham = [];
    const now = Date.now();
    
    for (let i = 0; i < 100; i++) {
        const loai = loaiQuat[Math.floor(Math.random() * loaiQuat.length)];
        const hang = thuongHieu[Math.floor(Math.random() * thuongHieu.length)];
        const maSanPham = `${hang.substring(0, 3).toUpperCase()}-${1000 + i}`;
        
        const giaGoc = Math.floor(Math.random() * 5000000) + 100000;
        const giaBan = Math.round(giaGoc / 10000) * 10000;
        
        const daBan = Math.floor(Math.random() * 10000);
        const daBanText = daBan > 1000 ? `${(daBan / 1000).toFixed(1)}k` : daBan.toString();
        
        const tonKho = Math.floor(Math.random() * 200) + 10;
        
        sanPham.push({
            id: `product_${i + 1}_${now}`,
            name: `${loai} ${hang} ${maSanPham}`,
            price: giaBan,
            image: `https://picsum.photos/seed/product${i + 1}/400/400`,
            badge: badge[Math.floor(Math.random() * badge.length)],
            sold: daBanText,
            stock: tonKho,
            createdAt: new Date(now - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return sanPham;
}

/**
 * Tao 50 don hang mau
 */
function taoDonHangMau(nguoiDung, sanPham) {
    const donHang = [];
    const now = Date.now();
    
    const trangThai = ['Đang xử lý', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];
    
    for (let i = 0; i < 50; i++) {
        const nguoiMua = nguoiDung[Math.floor(Math.random() * nguoiDung.length)];
        const soLuongSanPham = Math.floor(Math.random() * 3) + 1;
        
        const cacSanPham = [];
        let tongTien = 0;
        
        for (let j = 0; j < soLuongSanPham; j++) {
            const sp = sanPham[Math.floor(Math.random() * sanPham.length)];
            const soLuong = Math.floor(Math.random() * 3) + 1;
            
            cacSanPham.push({
                productId: sp.id,
                name: sp.name,
                price: sp.price,
                quantity: soLuong
            });
            
            tongTien += sp.price * soLuong;
        }
        
        donHang.push({
            id: `order_${i + 1}_${now}`,
            userId: nguoiMua.id,
            username: nguoiMua.username,
            email: nguoiMua.email,
            items: cacSanPham,
            total: tongTien,
            status: trangThai[Math.floor(Math.random() * trangThai.length)],
            createdAt: new Date(now - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return donHang;
}

/**
 * Khoi tao tat ca du lieu mau
 */
function khoiTaoDuLieuMau() {
    console.log('🔄 Đang khởi tạo dữ liệu mẫu...');
    
    try {
        // Tao nguoi dung
        const nguoiDung = taoNguoiDungMau();
        
        // Them admin neu chua co
        const adminEmail = 'longsexgay@admin.com';
        const coAdmin = nguoiDung.some(u => u.email === adminEmail);
        if (!coAdmin) {
            nguoiDung.unshift({
                id: `admin_${Date.now()}`,
                username: 'admin',
                email: adminEmail,
                password: '123456',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        }
        
        localStorage.setItem('users', JSON.stringify(nguoiDung));
        console.log(`✅ Đã tạo ${nguoiDung.length} người dùng`);
        
        // Tao san pham
        const sanPham = taoSanPhamMau();
        localStorage.setItem('products', JSON.stringify(sanPham));
        console.log(`✅ Đã tạo ${sanPham.length} sản phẩm`);
        
        // Tao don hang
        const donHang = taoDonHangMau(nguoiDung, sanPham);
        localStorage.setItem('orders', JSON.stringify(donHang));
        console.log(`✅ Đã tạo ${donHang.length} đơn hàng`);
        
        // Tao tin tuc
        const tinTuc = taoTinTucMau();
        localStorage.setItem('blogPosts', JSON.stringify(tinTuc));
        console.log(`✅ Đã tạo ${tinTuc.length} tin tức`);
        
        // Tinh tong doanh thu
        const tongDoanhThu = donHang
            .filter(dh => dh.status !== 'Đã hủy')
            .reduce((tong, dh) => tong + dh.total, 0);
        
        console.log(`💰 Tổng doanh thu: ${dinhDangTienTe(tongDoanhThu)}`);
        console.log('✨ Hoàn thành khởi tạo dữ liệu mẫu!');
        
        return {
            nguoiDung: nguoiDung.length,
            sanPham: sanPham.length,
            donHang: donHang.length,
            tinTuc: tinTuc.length,
            doanhThu: tongDoanhThu
        };
    } catch (error) {
        console.error('❌ Lỗi khi khởi tạo dữ liệu:', error);
        return null;
    }
}

/**
 * Tu dong khoi tao du lieu neu chua co
 */
function tuDongKhoiTaoDuLieu() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Check if we just initialized data (to prevent reload loop)
    const justInitialized = sessionStorage.getItem('data_just_initialized');
    
    // Neu chua co du lieu hoac du lieu qua it, khoi tao lai
    if (!justInitialized && (users.length < 5 || products.length < 20 || orders.length < 10 || blogPosts.length < 10)) {
        console.log('🎲 Phát hiện dữ liệu thiếu, đang tự động khởi tạo...');
        const result = khoiTaoDuLieuMau();
        
        if (result) {
            console.log('✨ Đã tự động khởi tạo dữ liệu mẫu thành công!');
            console.log(`📊 Thống kê: ${result.nguoiDung} người dùng, ${result.sanPham} sản phẩm, ${result.donHang} đơn hàng, ${result.tinTuc} tin tức`);
            
            // Mark as initialized to prevent reload loop
            sessionStorage.setItem('data_just_initialized', 'true');
            
            // Reload page once to show new data
            setTimeout(() => {
                console.log('🔄 Đang tải lại trang để hiển thị dữ liệu mới...');
                location.reload();
            }, 500);
        }
    } else {
        // Clear the flag after successful load
        if (justInitialized) {
            sessionStorage.removeItem('data_just_initialized');
        }
        
        console.log('✅ Dữ liệu đã có sẵn:', {
            nguoiDung: users.length,
            sanPham: products.length,
            donHang: orders.length,
            tinTuc: blogPosts.length
        });
    }
}

/**
 * Xoa tat ca du lieu
 */
function xoaTatCaDuLieu() {
    if (confirm('⚠️ Bạn có chắc muốn xóa TẤT CẢ dữ liệu? Hành động này không thể hoàn tác!')) {
        localStorage.removeItem('users');
        localStorage.removeItem('products');
        localStorage.removeItem('orders');
        localStorage.removeItem('blogPosts');
        
        // Xoa tat ca cart
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cart_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('🗑️ Đã xóa tất cả dữ liệu');
        alert('Đã xóa tất cả dữ liệu. Vui lòng tải lại trang.');
        location.reload();
    }
}

// Expose functions to window for console access
window.khoiTaoDuLieuMau = khoiTaoDuLieuMau;
window.xoaTatCaDuLieu = xoaTatCaDuLieu;
window.taoNguoiDungMau = taoNguoiDungMau;
window.taoSanPhamMau = taoSanPhamMau;
window.taoDonHangMau = taoDonHangMau;
window.taoTinTucMau = taoTinTucMau;

console.log('📦 Sample Data Generator loaded!');
console.log('💡 Sử dụng: khoiTaoDuLieuMau() để tạo dữ liệu mẫu');
console.log('💡 Sử dụng: xoaTatCaDuLieu() để xóa tất cả dữ liệu');

// Tu dong khoi tao du lieu khi load
tuDongKhoiTaoDuLieu();
