# Tài Liệu Thiết Kế - Quản Lý Người Dùng

## Tổng Quan

Tính năng Quản lý người dùng mở rộng trang admin/users hiện tại để hỗ trợ đầy đủ các thao tác CRUD (Create, Read, Update, Delete) trên tài khoản người dùng. Hiện tại, trang chỉ có khả năng hiển thị danh sách và xóa người dùng. Thiết kế này bổ sung chức năng thêm mới và chỉnh sửa người dùng, cùng với validation đầy đủ cho tất cả các trường dữ liệu.

Hệ thống sử dụng LocalStorage để lưu trữ dữ liệu người dùng và đã có sẵn các hàm validation cơ bản trong module `auth.js`. Thiết kế này tận dụng các hàm hiện có và mở rộng UI để cung cấp trải nghiệm quản lý người dùng hoàn chỉnh.

## Kiến Trúc

### Cấu Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Users Page                          │
│  (pages/admin/users/index.html + script.js)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Shared Modules                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   auth.js    │  │   utils.js   │  │ navigation.js│      │
│  │              │  │              │  │              │      │
│  │ - validate   │  │ - sanitize   │  │ - routing    │      │
│  │ - CRUD users │  │ - format     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ stores/reads
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    LocalStorage                              │
│  - users: Array<User>                                        │
│  - session: SessionObject                                    │
└─────────────────────────────────────────────────────────────┘
```

### Luồng Dữ Liệu

1. **Hiển thị danh sách**: Page load → Read LocalStorage → Render table
2. **Thêm người dùng**: Click "Thêm" → Show form → Validate → Save to LocalStorage → Refresh table
3. **Sửa người dùng**: Click "Sửa" → Load data to form → Validate → Update LocalStorage → Refresh table
4. **Xóa người dùng**: Click "Xóa" → Confirm → Remove from LocalStorage → Refresh table

## Các Thành Phần và Giao Diện

### 1. User Table Component

**Mục đích**: Hiển thị danh sách người dùng với các thao tác

**Cấu trúc HTML**:
```html
<table class="admin-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Tên đăng nhập</th>
      <th>Email</th>
      <th>Ngày tạo</th>
      <th>Thao tác</th>
    </tr>
  </thead>
  <tbody id="users-table">
    <!-- Rows generated dynamically -->
  </tbody>
</table>
```

**Chức năng**:
- Hiển thị tất cả người dùng từ LocalStorage
- Mỗi hàng có nút "Sửa" và "Xóa"
- Hiển thị thông báo khi không có dữ liệu
- Tự động cập nhật sau mỗi thao tác CRUD

### 2. User Form Component

**Mục đích**: Form nhập liệu cho thêm mới và chỉnh sửa người dùng

**Cấu trúc HTML**:
```html
<div id="user-form-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="user-form-title">Thêm Người Dùng Mới</h3>
      <button class="close-btn" onclick="hideUserForm()">×</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="user-id">
      
      <div class="form-group">
        <label>Tên đăng nhập *</label>
        <input type="text" id="user-username" class="form-input">
        <span class="error-msg" id="error-username"></span>
      </div>
      
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="user-email" class="form-input">
        <span class="error-msg" id="error-email"></span>
      </div>
      
      <div class="form-group">
        <label>Mật khẩu *</label>
        <input type="password" id="user-password" class="form-input">
        <span class="error-msg" id="error-password"></span>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="hideUserForm()">Hủy</button>
      <button class="btn btn-primary" onclick="saveUser()">Lưu</button>
    </div>
  </div>
</div>
```

**Chức năng**:
- Hiển thị dưới dạng modal overlay
- Validation real-time khi người dùng nhập
- Hiển thị thông báo lỗi dưới mỗi trường
- Chế độ thêm mới: form trống
- Chế độ chỉnh sửa: form điền sẵn dữ liệu

### 3. Action Buttons

**Nút "Thêm Người Dùng"**:
```html
<button class="btn btn-primary" onclick="showAddUserForm()">
  ➕ Thêm Người Dùng
</button>
```

**Nút "Sửa"** (trong mỗi hàng):
```html
<button class="action-btn btn-edit" onclick="editUser('${user.id}')">
  Sửa
</button>
```

**Nút "Xóa"** (trong mỗi hàng):
```html
<button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">
  Xóa
</button>
```

## Mô Hình Dữ Liệu

### User Object

```javascript
{
  id: string,              // Unique identifier (generated by generateId())
  username: string,        // 3-20 characters, alphanumeric + underscore
  email: string,           // Valid email format
  password: string,        // Minimum 6 characters
  createdAt: string,       // ISO 8601 timestamp
  lastLogin: string|null   // ISO 8601 timestamp or null
}
```

### LocalStorage Structure

```javascript
{
  "users": [
    {
      "id": "1234567890_abc123",
      "username": "admin",
      "email": "admin@example.com",
      "password": "123456",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "lastLogin": "2024-01-20T14:25:00.000Z"
    },
    // ... more users
  ]
}
```

## Xử Lý Lỗi

### Validation Errors

Tất cả validation errors được hiển thị inline dưới trường nhập liệu tương ứng:

1. **Username Errors**:
   - "Tên đăng nhập phải có từ 3-20 ký tự"
   - "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
   - "Tên đăng nhập đã tồn tại"

2. **Email Errors**:
   - "Email không hợp lệ"

3. **Password Errors**:
   - "Mật khẩu phải có ít nhất 6 ký tự"

### Error Display Strategy

```javascript
function showFieldError(fieldId, message) {
  const errorElement = document.getElementById(`error-${fieldId}`);
  const inputElement = document.getElementById(`user-${fieldId}`);
  
  if (message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('input-error');
  } else {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('input-error');
  }
}
```

### System Errors

Các lỗi hệ thống (LocalStorage full, JSON parse errors) được xử lý bằng try-catch và hiển thị thông báo chung:

```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  alert('Đã xảy ra lỗi. Vui lòng thử lại.');
}
```

## Chiến Lược Kiểm Thử

### Tại Sao Không Sử Dụng Property-Based Testing

Tính năng này KHÔNG phù hợp với property-based testing vì:

1. **UI Rendering**: Phần lớn logic là render HTML và xử lý DOM
2. **Simple CRUD**: Các thao tác CRUD đơn giản với LocalStorage, không có transformation logic phức tạp
3. **Validation đã được test**: Module `auth.js` đã có sẵn các hàm validation được test
4. **Side-effect operations**: Các thao tác chủ yếu là side-effects (hiển thị modal, cập nhật DOM, lưu LocalStorage)

Thay vào đó, chúng ta sẽ sử dụng:
- **Unit tests**: Test các hàm validation và CRUD riêng lẻ
- **Integration tests**: Test luồng hoàn chỉnh từ UI đến LocalStorage
- **Manual testing**: Test UI/UX và responsive design

### Unit Tests

**Test Validation Functions** (đã có sẵn trong auth.js):
```javascript
// Test validateUsername
- Username với 2 ký tự → trả về lỗi
- Username với 21 ký tự → trả về lỗi
- Username với ký tự đặc biệt → trả về lỗi
- Username hợp lệ → trả về valid: true

// Test validateEmail
- Email không có @ → trả về false
- Email không có domain → trả về false
- Email hợp lệ → trả về true

// Test validatePassword
- Password 5 ký tự → trả về lỗi
- Password 6 ký tự → trả về valid: true
```

**Test CRUD Functions**:
```javascript
// Test addUser
- Thêm user với dữ liệu hợp lệ → user được lưu vào LocalStorage
- Thêm user với username trùng → trả về lỗi
- Thêm user với email trùng → trả về lỗi

// Test updateUser
- Cập nhật user với dữ liệu hợp lệ → user được cập nhật
- Cập nhật username trùng với user khác → trả về lỗi
- Cập nhật user không tồn tại → trả về lỗi

// Test deleteUser
- Xóa user tồn tại → user bị xóa khỏi LocalStorage
- Xóa user không tồn tại → không có lỗi

// Test loadUsersTable
- LocalStorage có users → render đúng số hàng
- LocalStorage rỗng → hiển thị "Chưa có người dùng nào"
```

### Integration Tests

**Test Complete Workflows**:
```javascript
// Workflow: Thêm người dùng mới
1. Click nút "Thêm Người Dùng"
2. Nhập username, email, password hợp lệ
3. Click "Lưu"
4. Verify: User xuất hiện trong bảng
5. Verify: User tồn tại trong LocalStorage

// Workflow: Chỉnh sửa người dùng
1. Click nút "Sửa" trên một user
2. Thay đổi email
3. Click "Lưu"
4. Verify: Email được cập nhật trong bảng
5. Verify: Email được cập nhật trong LocalStorage

// Workflow: Xóa người dùng
1. Click nút "Xóa" trên một user
2. Confirm dialog
3. Verify: User biến mất khỏi bảng
4. Verify: User bị xóa khỏi LocalStorage

// Workflow: Validation errors
1. Click "Thêm Người Dùng"
2. Nhập username 2 ký tự
3. Blur khỏi trường
4. Verify: Hiển thị lỗi "Tên đăng nhập phải có từ 3-20 ký tự"
5. Verify: Không thể submit form
```

### Manual Testing Checklist

- [ ] UI hiển thị đúng trên desktop (1920x1080)
- [ ] UI hiển thị đúng trên tablet (768px)
- [ ] UI hiển thị đúng trên mobile (375px)
- [ ] Modal form hiển thị đúng và có thể đóng
- [ ] Validation errors hiển thị real-time
- [ ] Thông báo thành công hiển thị sau mỗi thao tác
- [ ] Confirm dialog hiển thị khi xóa
- [ ] Không thể thêm username trùng
- [ ] Không thể thêm email trùng
- [ ] Có thể chỉnh sửa user mà không thay đổi username
- [ ] Ngày tạo hiển thị đúng định dạng dd/mm/yyyy
- [ ] XSS protection: Nhập `<script>alert('xss')</script>` vào username → bị sanitize

### Test Data

```javascript
// Valid test users
const validUsers = [
  {
    username: "testuser1",
    email: "test1@example.com",
    password: "123456"
  },
  {
    username: "test_user_2",
    email: "test2@example.com",
    password: "password123"
  }
];

// Invalid test cases
const invalidCases = [
  {
    username: "ab",  // Too short
    email: "valid@example.com",
    password: "123456",
    expectedError: "Tên đăng nhập phải có từ 3-20 ký tự"
  },
  {
    username: "valid_user",
    email: "invalid-email",  // Invalid format
    password: "123456",
    expectedError: "Email không hợp lệ"
  },
  {
    username: "valid_user",
    email: "valid@example.com",
    password: "12345",  // Too short
    expectedError: "Mật khẩu phải có ít nhất 6 ký tự"
  }
];
```

## Ghi Chú Triển Khai

### Tận Dụng Code Hiện Có

1. **Validation**: Sử dụng các hàm có sẵn trong `auth.js`:
   - `validateUsername(username)`
   - `validateEmail(email)`
   - `validatePassword(password)`

2. **Utilities**: Sử dụng các hàm có sẵn trong `utils.js`:
   - `sanitizeInput(input)` - Bảo vệ XSS
   - `generateId()` - Tạo ID duy nhất
   - `showNotification(message, type)` - Hiển thị thông báo

3. **Styling**: Sử dụng các class CSS có sẵn trong `pages/admin/style.css`:
   - `.admin-table` - Bảng dữ liệu
   - `.action-btn`, `.btn-edit`, `.btn-delete` - Nút thao tác
   - `.btn`, `.btn-primary`, `.btn-secondary` - Nút chung

### Code Mới Cần Thêm

1. **Modal CSS** (thêm vào `pages/admin/style.css`):
```css
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  margin: 5% auto;
  padding: 0;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 24px;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 2px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--green-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input.input-error {
  border-color: #dc2626;
}

.error-msg {
  display: none;
  color: #dc2626;
  font-size: 13px;
  margin-top: 4px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-secondary);
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary);
}
```

2. **JavaScript Functions** (thêm vào `pages/admin/users/script.js`):
   - `showAddUserForm()` - Hiển thị form thêm mới
   - `showEditUserForm(userId)` - Hiển thị form chỉnh sửa
   - `hideUserForm()` - Đóng form
   - `saveUser()` - Lưu user (thêm mới hoặc cập nhật)
   - `validateUserForm()` - Validate toàn bộ form
   - `showFieldError(fieldId, message)` - Hiển thị lỗi cho trường
   - `clearFormErrors()` - Xóa tất cả lỗi

### Performance Considerations

1. **LocalStorage Limits**: LocalStorage có giới hạn ~5-10MB. Với cấu trúc User object hiện tại, có thể lưu hàng nghìn users mà không gặp vấn đề.

2. **Table Rendering**: Với số lượng users lớn (>1000), nên implement pagination hoặc virtual scrolling. Tuy nhiên, đây là tính năng tương lai, không cần thiết cho MVP.

3. **Real-time Validation**: Validation được trigger trên sự kiện `blur` thay vì `input` để tránh hiển thị lỗi quá sớm và gây khó chịu cho người dùng.

### Security Considerations

1. **XSS Protection**: Tất cả input được sanitize bằng `sanitizeInput()` trước khi render
2. **Password Storage**: Password được lưu plain text trong LocalStorage (chấp nhận được cho demo/prototype, nhưng cần hash trong production)
3. **Admin Check**: Tất cả thao tác CRUD yêu cầu user phải là admin
4. **Input Validation**: Validation cả client-side và khi lưu vào LocalStorage

