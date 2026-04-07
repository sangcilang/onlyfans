# API Tiếng Việt - Vietnamese API Reference

Tất cả các hàm chính đều có alias tiếng Việt không dấu. Bạn có thể sử dụng cả tên tiếng Anh hoặc tiếng Việt.

## Utils (shared/js/utils.js)

### Định Dạng & Hiển Thị

```javascript
// Tiếng Anh
formatCurrency(1500000)  // "1.500.000đ"

// Tiếng Việt
dinhDangTienTe(1500000)  // "1.500.000đ"
```

```javascript
// Tiếng Anh
sanitizeInput("<script>alert('xss')</script>")

// Tiếng Việt
lamSachDuLieu("<script>alert('xss')</script>")
```

```javascript
// Tiếng Anh
showNotification("Thành công!", "success")

// Tiếng Việt
hienThiThongBao("Thành công!", "success")
```

### Validation & Utilities

```javascript
// Tiếng Anh
validateRequired({ "Tên": "John", "Email": "john@example.com" })

// Tiếng Việt
kiemTraBatBuoc({ "Tên": "John", "Email": "john@example.com" })
```

```javascript
// Tiếng Anh
const id = generateId()

// Tiếng Việt
const id = taoId()
```

---

## Authentication (shared/js/auth.js)

### Validation

```javascript
// Tiếng Anh
validateEmail("test@example.com")  // true/false

// Tiếng Việt
kiemTraEmail("test@example.com")  // true/false
```

```javascript
// Tiếng Anh
validatePassword("123456")  // {valid: true, message: ""}

// Tiếng Việt
kiemTraMatKhau("123456")  // {hopLe: true, thongBao: ""}
```

```javascript
// Tiếng Anh
validateUsername("john_doe")  // {valid: true, message: ""}

// Tiếng Việt
kiemTraTenDangNhap("john_doe")  // {hopLe: true, thongBao: ""}
```

### Đăng Ký & Đăng Nhập

```javascript
// Tiếng Anh
register("john_doe", "john@example.com", "123456")

// Tiếng Việt
dangKy("john_doe", "john@example.com", "123456")
// Trả về: {success: boolean, message: string, user?: Object}
```

```javascript
// Tiếng Anh
login("john@example.com", "123456")

// Tiếng Việt
dangNhap("john@example.com", "123456")
// Trả về: {success: boolean, message: string, user?: Object}
```

```javascript
// Tiếng Anh
logout()

// Tiếng Việt
dangXuat()
```

### Kiểm Tra Trạng Thái

```javascript
// Tiếng Anh
if (isLoggedIn()) {
    console.log("Đã đăng nhập");
}

// Tiếng Việt
if (kiemTraDangNhap()) {
    console.log("Đã đăng nhập");
}
```

```javascript
// Tiếng Anh
const user = getCurrentUser()

// Tiếng Việt
const nguoiDung = layNguoiDungHienTai()
// Trả về: {id, username, email} hoặc null
```

### Admin

```javascript
// Tiếng Anh
initDefaultAdmin()

// Tiếng Việt
khoiTaoAdminMacDinh()
```

---

## Products (shared/js/products.js)

### Khởi Tạo

```javascript
// Tiếng Anh
initDefaultProducts()

// Tiếng Việt
khoiTaoSanPhamMacDinh()
```

### Lấy Sản Phẩm

```javascript
// Tiếng Anh
const products = getAllProducts()

// Tiếng Việt
const sanPham = layTatCaSanPham()
// Trả về: Array of products
```

```javascript
// Tiếng Anh
const product = getProductById("1")

// Tiếng Việt
const sanPham = laySanPhamTheoId("1")
// Trả về: Product object hoặc undefined
```

### Thêm, Sửa, Xóa

```javascript
// Tiếng Anh
addProduct({
    name: "Quạt mới",
    price: 500000,
    image: "https://...",
    badge: "Mới",
    sold: "0"
})

// Tiếng Việt
themSanPham({
    name: "Quạt mới",
    price: 500000,
    image: "https://...",
    badge: "Mới",
    sold: "0"
})
```

```javascript
// Tiếng Anh
updateProduct("1", { price: 600000 })

// Tiếng Việt
capNhatSanPham("1", { price: 600000 })
```

```javascript
// Tiếng Anh
deleteProduct("1")

// Tiếng Việt
xoaSanPham("1")
```

---

## Cart (shared/js/cart.js)

### Thêm & Xóa

```javascript
// Tiếng Anh
addToCart("Quạt Panasonic", 1500000)

// Tiếng Việt
themVaoGioHang("Quạt Panasonic", 1500000)
// Trả về: {success: boolean, message: string}
```

```javascript
// Tiếng Anh
removeFromCart(0)  // Xóa item đầu tiên

// Tiếng Việt
xoaKhoiGioHang(0)  // Xóa item đầu tiên
```

```javascript
// Tiếng Anh
clearCart()

// Tiếng Việt
xoaToanBoGioHang()
```

### Lấy Thông Tin

```javascript
// Tiếng Anh
const cart = getCart()

// Tiếng Việt
const gioHang = layGioHang()
// Trả về: Array of cart items
```

```javascript
// Tiếng Anh
const total = getCartTotal()

// Tiếng Việt
const tongTien = tinhTongTien()
// Trả về: Number (tổng tiền)
```

```javascript
// Tiếng Anh
const count = getCartCount()

// Tiếng Việt
const soLuong = laySoLuongGioHang()
// Trả về: Number (số lượng items)
```

### Cập Nhật UI

```javascript
// Tiếng Anh
updateCartCountUI()

// Tiếng Việt
capNhatGioHangUI()
```

---

## Ví Dụ Sử Dụng Thực Tế

### Đăng Ký Người Dùng

```javascript
// Cách 1: Tiếng Anh
const result = register("john_doe", "john@example.com", "123456");
if (result.success) {
    showNotification(result.message, "success");
} else {
    showNotification(result.message, "error");
}

// Cách 2: Tiếng Việt
const ketQua = dangKy("john_doe", "john@example.com", "123456");
if (ketQua.success) {
    hienThiThongBao(ketQua.message, "success");
} else {
    hienThiThongBao(ketQua.message, "error");
}
```

### Thêm Sản Phẩm Vào Giỏ

```javascript
// Cách 1: Tiếng Anh
function handleAddToCart(productName, price) {
    if (!isLoggedIn()) {
        showNotification("Vui lòng đăng nhập", "error");
        return;
    }
    
    const result = addToCart(productName, price);
    showNotification(result.message, result.success ? "success" : "error");
}

// Cách 2: Tiếng Việt
function xuLyThemVaoGio(tenSanPham, gia) {
    if (!kiemTraDangNhap()) {
        hienThiThongBao("Vui lòng đăng nhập", "error");
        return;
    }
    
    const ketQua = themVaoGioHang(tenSanPham, gia);
    hienThiThongBao(ketQua.message, ketQua.success ? "success" : "error");
}
```

### Hiển Thị Danh Sách Sản Phẩm

```javascript
// Cách 1: Tiếng Anh
function displayProducts() {
    const products = getAllProducts();
    const html = products.map(product => `
        <div class="product-card">
            <h3>${sanitizeInput(product.name)}</h3>
            <p>${formatCurrency(product.price)}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">
                Thêm vào giỏ
            </button>
        </div>
    `).join('');
    
    document.getElementById('products').innerHTML = html;
}

// Cách 2: Tiếng Việt
function hienThiSanPham() {
    const sanPham = layTatCaSanPham();
    const html = sanPham.map(sp => `
        <div class="product-card">
            <h3>${lamSachDuLieu(sp.name)}</h3>
            <p>${dinhDangTienTe(sp.price)}</p>
            <button onclick="themVaoGioHang('${sp.name}', ${sp.price})">
                Thêm vào giỏ
            </button>
        </div>
    `).join('');
    
    document.getElementById('products').innerHTML = html;
}
```

---

## Lưu Ý

1. **Backward Compatibility**: Tất cả tên tiếng Anh vẫn hoạt động bình thường
2. **Mixing**: Bạn có thể mix cả tiếng Anh và tiếng Việt trong cùng một file
3. **Convention**: Khuyên dùng một ngôn ngữ thống nhất trong một file
4. **Performance**: Không có sự khác biệt về hiệu suất

## Quy Tắc Đặt Tên Tiếng Việt

- Không dấu
- camelCase (chữ cái đầu viết thường, các từ sau viết hoa chữ cái đầu)
- Ví dụ:
  - `getCurrentUser` → `layNguoiDungHienTai`
  - `addToCart` → `themVaoGioHang`
  - `formatCurrency` → `dinhDangTienTe`
