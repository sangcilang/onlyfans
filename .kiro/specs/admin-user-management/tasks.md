# Kế Hoạch Triển Khai: Quản Lý Người Dùng

## Tổng Quan

Triển khai tính năng CRUD đầy đủ cho quản lý người dùng trong trang admin, bao gồm thêm mới, chỉnh sửa, xóa và validation. Tận dụng các module validation có sẵn trong auth.js và mở rộng UI với modal form.

## Tasks

- [x] 1. Thêm CSS cho modal form và validation errors
  - Thêm styles cho modal overlay, modal-content, modal-header, modal-body, modal-footer vào pages/admin/style.css
  - Thêm styles cho form-group, form-input, input-error, error-msg
  - Thêm styles cho close-btn và responsive design
  - _Requirements: 1.2, 2.2, 9.1_

- [x] 2. Tạo HTML structure cho user form modal
  - [x] 2.1 Thêm modal HTML vào pages/admin/users/index.html
    - Tạo modal container với id="user-form-modal"
    - Thêm modal-header với title động và nút đóng
    - Thêm modal-body với các trường: username, email, password
    - Thêm hidden input cho user-id (dùng khi edit)
    - Thêm error message spans cho mỗi trường
    - Thêm modal-footer với nút Hủy và Lưu
    - _Requirements: 1.2, 2.2, 4.1, 5.1, 6.1, 7.1, 9.1_
  
  - [x] 2.2 Thêm nút "Thêm Người Dùng" vào header của trang
    - Thêm button với class btn-primary và onclick="showAddUserForm()"
    - _Requirements: 1.1_

- [x] 3. Implement form display và hide functions
  - [x] 3.1 Viết hàm showAddUserForm()
    - Reset form về trạng thái trống
    - Đặt title là "Thêm Người Dùng Mới"
    - Xóa user-id (hidden input)
    - Clear tất cả errors
    - Hiển thị modal (display: flex)
    - _Requirements: 1.2, 9.3_
  
  - [x] 3.2 Viết hàm showEditUserForm(userId)
    - Load dữ liệu user từ LocalStorage theo userId
    - Điền dữ liệu vào form (username, email, password)
    - Đặt user-id vào hidden input
    - Đặt title là "Chỉnh Sửa Người Dùng"
    - Clear tất cả errors
    - Hiển thị modal
    - _Requirements: 2.2, 9.3_
  
  - [x] 3.3 Viết hàm hideUserForm()
    - Ẩn modal (display: none)
    - Reset form về trạng thái trống
    - Clear tất cả errors
    - _Requirements: 9.2, 9.3_

- [x] 4. Implement validation functions
  - [x] 4.1 Viết hàm showFieldError(fieldId, message)
    - Hiển thị error message dưới trường tương ứng
    - Thêm class input-error vào input field
    - _Requirements: 4.2, 5.2, 6.2, 7.2, 7.4_
  
  - [x] 4.2 Viết hàm clearFormErrors()
    - Xóa tất cả error messages
    - Xóa tất cả class input-error
    - _Requirements: 1.5, 2.5, 9.3_
  
  - [x] 4.3 Viết hàm validateUserForm()
    - Validate username bằng validateUsername() từ auth.js
    - Validate email bằng validateEmail() từ auth.js
    - Validate password bằng validatePassword() từ auth.js
    - Kiểm tra username trùng lặp (trừ khi đang edit chính user đó)
    - Hiển thị errors cho từng trường không hợp lệ
    - Trả về true nếu tất cả hợp lệ, false nếu có lỗi
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.4, 6.1, 6.2, 7.1, 7.2, 7.4_

- [ ] 5. Implement save user function
  - [x] 5.1 Viết hàm saveUser()
    - Lấy dữ liệu từ form (username, email, password, user-id)
    - Gọi validateUserForm() để kiểm tra
    - Nếu validation fail, dừng lại và hiển thị errors
    - Sanitize tất cả inputs bằng sanitizeInput() từ utils.js
    - Nếu user-id rỗng: tạo user mới với generateId() và createdAt
    - Nếu user-id có giá trị: cập nhật user hiện tại
    - Lưu vào LocalStorage
    - Gọi loadUsersTable() để refresh bảng
    - Hiển thị notification thành công
    - Đóng modal
    - _Requirements: 1.3, 1.4, 1.5, 2.3, 2.4, 2.5_

- [x] 6. Checkpoint - Test thêm và sửa người dùng
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update delete user function
  - [x] 7.1 Cập nhật hàm deleteUser(userId) nếu cần
    - Hiển thị confirm dialog với thông báo rõ ràng
    - Nếu confirm: xóa user khỏi LocalStorage
    - Gọi loadUsersTable() để refresh bảng
    - Hiển thị notification thành công
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 8. Update table rendering
  - [x] 8.1 Cập nhật hàm loadUsersTable()
    - Đọc users từ LocalStorage
    - Nếu không có users: hiển thị "Chưa có người dùng nào"
    - Render bảng với các cột: ID, Tên đăng nhập, Email, Ngày tạo, Thao tác
    - Format ngày tạo theo dd/mm/yyyy
    - Thêm nút "Sửa" với onclick="editUser('${user.id}')"
    - Thêm nút "Xóa" với onclick="deleteUser('${user.id}')"
    - Sanitize tất cả dữ liệu trước khi render (XSS protection)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. Add real-time validation
  - [x] 9.1 Thêm event listeners cho form inputs
    - Thêm blur event cho username input để validate format và uniqueness
    - Thêm blur event cho email input để validate format
    - Thêm blur event cho password input để validate length
    - _Requirements: 4.1, 6.4, 7.1, 7.3_

- [x] 10. Final checkpoint và testing
  - Ensure all tests pass, ask the user if questions arise.

## Ghi Chú

- Tất cả tasks sử dụng JavaScript thuần, không có framework
- Tận dụng các hàm validation có sẵn trong shared/js/auth.js
- Tận dụng các utility functions trong shared/js/utils.js
- Tất cả dữ liệu được sanitize trước khi render để bảo vệ XSS
- Modal form được sử dụng cho cả thêm mới và chỉnh sửa
- Validation errors hiển thị real-time khi user blur khỏi input field
