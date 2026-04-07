# Hướng Dẫn Chạy Website Fan Shop

## Phương Pháp 1: Chạy Với LocalStorage (Đơn Giản - Không Cần Cài Đặt)

### Bước 1: Mở Terminal/Command Prompt

Trên Windows:
- Nhấn `Win + R`
- Gõ `cmd` và nhấn Enter

### Bước 2: Di chuyển đến thư mục dự án

```bash
cd đường/dẫn/đến/thư/mục/dự-án
```

Ví dụ:
```bash
cd C:\Users\TenBan\Downloads\fan-shop
```

### Bước 3: Chạy HTTP Server

Sử dụng Python (đã cài sẵn trên hầu hết các máy):

```bash
python -m http.server 8000
```

Hoặc nếu có Python 3:
```bash
python3 -m http.server 8000
```

### Bước 4: Mở trình duyệt

Truy cập: http://localhost:8000/pages/home/index.html

### Lưu Ý Về LocalStorage
- ✅ Không cần cài đặt gì thêm
- ✅ Chạy được offline
- ❌ Dữ liệu chỉ lưu trên máy hiện tại
- ❌ Xóa bộ nhớ đệm = mất dữ liệu
- ❌ Không chia sẻ được giữa các máy khác nhau

---

## Phương Pháp 2: Chạy Với Firebase (Khuyên Dùng - Có Cơ Sở Dữ Liệu Thật)

### Bước 1: Cài Đặt Firebase

Làm theo hướng dẫn chi tiết trong file: **FIREBASE_SETUP.md**

Tóm tắt:
1. Tạo dự án trên https://console.firebase.google.com/
2. Bật Realtime Database
3. Bật Authentication (Email/Password)
4. Sao chép cấu hình vào `shared/js/firebase-config.js`

### Bước 2: Cập Nhật Các File HTML

Thay thế phần scripts trong tất cả các file HTML bằng mẫu trong **TEMPLATE_WITH_FIREBASE.html**

Các file cần cập nhật:
- pages/home/index.html
- pages/login/index.html
- pages/register/index.html
- pages/admin/index.html
- pages/cart/index.html
- pages/blog/index.html
- pages/about/index.html
- pages/contact/index.html
- pages/policy/index.html

### Bước 3: Chạy Server

```bash
python -m http.server 8000
```

### Bước 4: Mở trình duyệt

Truy cập: http://localhost:8000/pages/home/index.html

### Lưu Ý Về Firebase
- ✅ Dữ liệu lưu trên đám mây
- ✅ Chia sẻ được giữa các máy khác nhau
- ✅ Không mất dữ liệu khi xóa bộ nhớ đệm
- ✅ Đồng bộ theo thời gian thực
- ⚠️ Cần kết nối internet để hoạt động
- ⚠️ Cần cài đặt ban đầu (chỉ 1 lần duy nhất)

---

## Tài Khoản Quản Trị Mặc Định

**Email:** longsexgay@admin.com  
**Mật khẩu:** 123456

Tài khoản này có các quyền:
- Truy cập trang quản trị
- Quản lý sản phẩm (thêm/sửa/xóa)
- Quản lý người dùng
- Quản lý tin tức

---

## Khởi Tạo Dữ Liệu Mẫu

Để có dữ liệu demo đầy đủ (người dùng, sản phẩm, đơn hàng), truy cập:

**http://localhost:8000/init-data.html**

Trang này sẽ tạo:
- 📊 **21 người dùng** (bao gồm admin)
- 📦 **100 sản phẩm** đa dạng
- 🛒 **50 đơn hàng** với doanh thu thực tế
- 💰 **Doanh thu** tự động tính toán

### Cách Sử Dụng:

1. Mở http://localhost:8000/init-data.html
2. Click "✨ Tạo Dữ Liệu Mẫu"
3. Xác nhận
4. Dữ liệu sẽ được tạo tự động

### Xóa Dữ Liệu:

- Click "🗑️ Xóa Tất Cả Dữ Liệu" trên trang init-data.html
- Hoặc mở Console (F12) và gõ: `xoaTatCaDuLieu()`

---

## Xử Lý Sự Cố

### Lỗi: "Address already in use" (Địa chỉ đang được sử dụng)
Cổng 8000 đang được sử dụng. Thử cổng khác:
```bash
python -m http.server 8001
```

### Lỗi: "Python not found" (Không tìm thấy Python)
Cài đặt Python từ: https://www.python.org/downloads/

### Lỗi Firebase: "Permission denied" (Quyền truy cập bị từ chối)
- Kiểm tra Database Rules trong Firebase Console
- Đảm bảo đã đăng nhập (đối với các thao tác ghi dữ liệu)

### Lỗi: "Firebase not defined" (Firebase không được định nghĩa)
- Kiểm tra đã tải các script Firebase trong HTML chưa
- Kiểm tra thứ tự tải các script (Firebase phải được tải trước)

---

## Chuyển Sang Máy Khác

### Với LocalStorage:
1. Sao chép toàn bộ thư mục dự án
2. Chạy lại HTTP server
3. ⚠️ Dữ liệu sẽ bị mất (phải tạo lại từ đầu)

### Với Firebase:
1. Sao chép toàn bộ thư mục dự án
2. Chạy lại HTTP server
3. ✅ Dữ liệu vẫn còn (lưu trên đám mây)
4. ✅ Không cần cài đặt lại gì cả

Chúc bạn lập trình vui vẻ! 🚀
