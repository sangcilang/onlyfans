# Test Navigation - Fan Shop

## Các đường dẫn chính:

### Trang chủ
- URL: `/pages/home/` hoặc `/` (redirect)
- Có thể truy cập từ: Logo, Menu "Trang chủ"

### Đăng nhập
- URL: `/pages/login/`
- Có thể truy cập từ: Link "Đăng nhập" ở header (khi chưa đăng nhập)
- Redirect về `/pages/home/` sau khi đăng nhập thành công
- Redirect về `/pages/home/` nếu đã đăng nhập

### Đăng ký
- URL: `/pages/register/`
- Có thể truy cập từ: Link "Đăng ký" ở header (khi chưa đăng nhập), Link trong trang login
- Redirect về `/pages/login/` sau khi đăng ký thành công
- Redirect về `/pages/home/` nếu đã đăng nhập

### Giỏ hàng
- URL: `/pages/cart/`
- Có thể truy cập từ: Icon giỏ hàng ở header

### Các trang khác
- Giới thiệu: `/pages/about/`
- Chính sách: `/pages/policy/`
- Liên hệ: `/pages/contact/`

## Flow đăng ký/đăng nhập:

1. **Người dùng mới:**
   - Vào trang chủ → Click "Đăng ký" → Điền form → Submit
   - Redirect về `/pages/login/` → Đăng nhập
   - Redirect về `/pages/home/` → Thấy tên user ở header

2. **Người dùng đã có tài khoản:**
   - Vào trang chủ → Click "Đăng nhập" → Điền form → Submit
   - Redirect về `/pages/home/` → Thấy tên user ở header

3. **Đăng xuất:**
   - Click "Đăng xuất" ở header → Redirect về `/pages/home/`
   - Header hiển thị lại "Đăng nhập" và "Đăng ký"

## Các cải tiến đã thực hiện:

✅ Logo có thể click để về trang chủ
✅ Search button không bị lỗi khi function không tồn tại
✅ Tất cả links sử dụng absolute path `/pages/...`
✅ Redirect logic đúng cho login/register
✅ Auth UI update tự động
✅ Cart count update tự động

## Lưu ý khi test:

- Mở browser console để xem errors (nếu có)
- Test trên local server (không phải file://)
- Clear localStorage nếu cần test từ đầu: `localStorage.clear()`
- Kiểm tra responsive trên mobile
