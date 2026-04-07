# Hướng Dẫn Setup Firebase

## Bước 1: Tạo Project Firebase

1. Truy cập: https://console.firebase.google.com/
2. Đăng nhập bằng tài khoản Google
3. Click "Add project" (Thêm dự án)
4. Đặt tên project: `fan-shop` (hoặc tên bạn thích)
5. Tắt Google Analytics (không cần thiết cho dự án này)
6. Click "Create project"

## Bước 2: Tạo Web App

1. Trong Firebase Console, click vào biểu tượng `</>` (Web)
2. Đặt tên app: `Fan Shop Web`
3. KHÔNG tick "Firebase Hosting" (chưa cần)
4. Click "Register app"
5. **QUAN TRỌNG:** Copy đoạn config, sẽ có dạng:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "fan-shop-xxxxx.firebaseapp.com",
  databaseURL: "https://fan-shop-xxxxx-default-rtdb.firebaseio.com",
  projectId: "fan-shop-xxxxx",
  storageBucket: "fan-shop-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

6. Click "Continue to console"

## Bước 3: Enable Realtime Database

1. Trong menu bên trái, click "Realtime Database"
2. Click "Create Database"
3. Chọn location: `asia-southeast1` (Singapore - gần Việt Nam nhất)
4. Chọn "Start in test mode" (cho phép đọc/ghi tự do)
5. Click "Enable"

## Bước 4: Enable Authentication

1. Trong menu bên trái, click "Authentication"
2. Click "Get started"
3. Tab "Sign-in method"
4. Click "Email/Password"
5. Enable "Email/Password"
6. Click "Save"

## Bước 5: Cấu Hình Database Rules (Bảo Mật)

1. Vào "Realtime Database" > tab "Rules"
2. Thay thế rules bằng:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "blogPosts": {
      ".read": true,
      ".write": "auth != null"
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. Click "Publish"

## Bước 6: Cập Nhật Config Vào Code

1. Mở file `shared/js/firebase-config.js`
2. Thay thế `firebaseConfig` bằng config bạn đã copy ở Bước 2
3. Lưu file

## Bước 7: Test

1. Chạy website: `python -m http.server 8000`
2. Mở trình duyệt: http://localhost:8000/pages/home/index.html
3. Kiểm tra Console (F12) xem có lỗi Firebase không
4. Thử đăng ký tài khoản mới
5. Vào Firebase Console > Authentication để xem user
6. Vào Firebase Console > Realtime Database để xem dữ liệu

## Lưu Ý Quan Trọng

### Bảo Mật
- Test mode cho phép mọi người đọc/ghi - CHỈ dùng cho development
- Sau khi hoàn thành, cần cập nhật rules nghiêm ngặt hơn

### Giới Hạn Miễn Phí
- Spark Plan (Free):
  - 1GB storage
  - 10GB/tháng bandwidth
  - 100 simultaneous connections
  - Đủ cho dự án học tập/demo

### Chuyển Máy Khác
1. Copy toàn bộ folder project
2. Không cần setup gì thêm
3. Chỉ cần có internet để kết nối Firebase
4. Config đã được lưu trong code

## Troubleshooting

### Lỗi: "Permission denied"
- Kiểm tra Database Rules
- Đảm bảo user đã đăng nhập (cho write operations)

### Lỗi: "Firebase not defined"
- Kiểm tra đã load firebase scripts trong HTML
- Kiểm tra thứ tự load scripts

### Lỗi: "databaseURL not found"
- Vào Realtime Database settings
- Copy Database URL
- Thêm vào firebaseConfig

## Tài Liệu Tham Khảo

- Firebase Docs: https://firebase.google.com/docs
- Realtime Database: https://firebase.google.com/docs/database
- Authentication: https://firebase.google.com/docs/auth
