# Cấu Trúc Admin Pages

## Tổng Quan
Các trang admin đã được tách thành các page riêng biệt:

```
pages/admin/
├── index.html (redirect to dashboard)
├── style.css (shared styles)
├── script.js (old - can be removed)
├── dashboard/
│   ├── index.html
│   └── script.js
├── orders/
│   ├── index.html
│   └── script.js
├── inventory/
│   ├── index.html
│   └── script.js
├── products/
│   ├── index.html
│   └── script.js
├── users/
│   ├── index.html
│   └── script.js
├── posts/
│   ├── index.html
│   └── script.js
└── activity/
    ├── index.html
    └── script.js
```

## Đã Tạo
✅ Dashboard (Tổng Quan)
✅ Orders (Đơn Hàng)
✅ Inventory (Quản Lý Kho)

## Cần Tạo
- Products (Sản Phẩm)
- Users (Người Dùng)
- Posts (Tin Tức)
- Activity (Hoạt Động)

## Cách Sử Dụng
1. Truy cập `/pages/admin/` sẽ tự động redirect sang `/pages/admin/dashboard/`
2. Mỗi trang có sidebar riêng với link đến các trang khác
3. Mỗi trang có script.js riêng để xử lý logic

## Lưu Ý
- Tất cả các trang đều share chung `style.css` từ thư mục cha
- Mỗi trang cần check admin access trước khi hiển thị nội dung
- Sidebar được copy vào mỗi trang để dễ navigation
