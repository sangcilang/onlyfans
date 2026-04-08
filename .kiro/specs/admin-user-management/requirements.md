# Tài Liệu Yêu Cầu - Quản Lý Người Dùng

## Giới Thiệu

Tính năng Quản lý người dùng cho phép admin thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên tài khoản người dùng trong hệ thống. Hiện tại trang admin/users chỉ hiển thị danh sách và xóa người dùng. Tính năng này sẽ bổ sung khả năng thêm mới và chỉnh sửa thông tin người dùng, cùng với validation đầy đủ.

## Thuật Ngữ

- **Admin_System**: Hệ thống quản trị cho phép admin quản lý người dùng
- **User_Form**: Form nhập liệu để tạo hoặc chỉnh sửa thông tin người dùng
- **User_Table**: Bảng hiển thị danh sách người dùng
- **Validation_Module**: Module kiểm tra tính hợp lệ của dữ liệu đầu vào
- **LocalStorage**: Bộ nhớ cục bộ trình duyệt lưu trữ dữ liệu người dùng

## Yêu Cầu

### Yêu Cầu 1: Thêm Người Dùng Mới

**User Story:** Là một admin, tôi muốn thêm người dùng mới vào hệ thống, để có thể tạo tài khoản cho người dùng mà không cần họ tự đăng ký.

#### Tiêu Chí Chấp Nhận

1. THE Admin_System SHALL hiển thị nút "Thêm Người Dùng" trên trang quản lý người dùng
2. WHEN admin nhấn nút "Thêm Người Dùng", THE Admin_System SHALL hiển thị User_Form với các trường username, email và password
3. WHEN admin nhập đầy đủ thông tin hợp lệ và submit form, THE Admin_System SHALL tạo người dùng mới trong LocalStorage
4. WHEN người dùng mới được tạo thành công, THE Admin_System SHALL cập nhật User_Table và hiển thị thông báo thành công
5. WHEN admin submit form với dữ liệu không hợp lệ, THE Admin_System SHALL hiển thị thông báo lỗi và giữ nguyên form

### Yêu Cầu 2: Chỉnh Sửa Thông Tin Người Dùng

**User Story:** Là một admin, tôi muốn chỉnh sửa thông tin người dùng, để có thể cập nhật username, email hoặc đặt lại mật khẩu khi cần thiết.

#### Tiêu Chí Chấp Nhận

1. THE Admin_System SHALL hiển thị nút "Sửa" cho mỗi người dùng trong User_Table
2. WHEN admin nhấn nút "Sửa", THE Admin_System SHALL hiển thị User_Form với dữ liệu hiện tại của người dùng đã điền sẵn
3. WHEN admin thay đổi thông tin và submit form, THE Admin_System SHALL cập nhật thông tin người dùng trong LocalStorage
4. WHEN cập nhật thành công, THE Admin_System SHALL cập nhật User_Table và hiển thị thông báo thành công
5. WHEN admin submit form với dữ liệu không hợp lệ, THE Admin_System SHALL hiển thị thông báo lỗi và giữ nguyên form

### Yêu Cầu 3: Xóa Người Dùng

**User Story:** Là một admin, tôi muốn xóa người dùng khỏi hệ thống, để có thể loại bỏ tài khoản không còn sử dụng hoặc vi phạm quy định.

#### Tiêu Chí Chấp Nhận

1. THE Admin_System SHALL hiển thị nút "Xóa" cho mỗi người dùng trong User_Table
2. WHEN admin nhấn nút "Xóa", THE Admin_System SHALL hiển thị hộp thoại xác nhận
3. WHEN admin xác nhận xóa, THE Admin_System SHALL xóa người dùng khỏi LocalStorage
4. WHEN xóa thành công, THE Admin_System SHALL cập nhật User_Table và hiển thị thông báo thành công
5. WHEN admin hủy xác nhận, THE Admin_System SHALL đóng hộp thoại và không thực hiện thao tác xóa

### Yêu Cầu 4: Validation Email

**User Story:** Là một admin, tôi muốn hệ thống kiểm tra định dạng email, để đảm bảo email được nhập là hợp lệ.

#### Tiêu Chí Chấp Nhận

1. WHEN admin nhập email vào User_Form, THE Validation_Module SHALL kiểm tra định dạng email theo chuẩn RFC 5322
2. IF email không chứa ký tự @, THEN THE Validation_Module SHALL trả về lỗi "Email không hợp lệ"
3. IF email không có phần domain sau @, THEN THE Validation_Module SHALL trả về lỗi "Email không hợp lệ"
4. IF email không có phần extension sau dấu chấm, THEN THE Validation_Module SHALL trả về lỗi "Email không hợp lệ"
5. WHEN email hợp lệ, THE Validation_Module SHALL cho phép submit form

### Yêu Cầu 5: Validation Username Duy Nhất

**User Story:** Là một admin, tôi muốn hệ thống kiểm tra username không bị trùng, để đảm bảo mỗi người dùng có username riêng biệt.

#### Tiêu Chí Chấp Nhận

1. WHEN admin tạo người dùng mới, THE Validation_Module SHALL kiểm tra username đã tồn tại trong LocalStorage
2. IF username đã tồn tại, THEN THE Validation_Module SHALL trả về lỗi "Tên đăng nhập đã tồn tại"
3. WHEN admin chỉnh sửa người dùng, THE Validation_Module SHALL kiểm tra username trùng với người dùng khác
4. IF username trùng với người dùng khác, THEN THE Validation_Module SHALL trả về lỗi "Tên đăng nhập đã tồn tại"
5. WHEN username duy nhất, THE Validation_Module SHALL cho phép submit form

### Yêu Cầu 6: Validation Độ Mạnh Mật Khẩu

**User Story:** Là một admin, tôi muốn hệ thống kiểm tra độ mạnh của mật khẩu, để đảm bảo tài khoản người dùng được bảo mật tốt.

#### Tiêu Chí Chấp Nhận

1. WHEN admin nhập mật khẩu vào User_Form, THE Validation_Module SHALL kiểm tra độ dài mật khẩu
2. IF mật khẩu có ít hơn 6 ký tự, THEN THE Validation_Module SHALL trả về lỗi "Mật khẩu phải có ít nhất 6 ký tự"
3. WHEN mật khẩu có từ 6 ký tự trở lên, THE Validation_Module SHALL chấp nhận mật khẩu
4. THE Validation_Module SHALL hiển thị thông báo lỗi ngay khi admin nhập mật khẩu không hợp lệ
5. WHEN mật khẩu hợp lệ, THE Validation_Module SHALL cho phép submit form

### Yêu Cầu 7: Validation Username Format

**User Story:** Là một admin, tôi muốn hệ thống kiểm tra định dạng username, để đảm bảo username tuân thủ quy tắc đặt tên.

#### Tiêu Chí Chấp Nhận

1. WHEN admin nhập username vào User_Form, THE Validation_Module SHALL kiểm tra độ dài username
2. IF username có ít hơn 3 ký tự hoặc nhiều hơn 20 ký tự, THEN THE Validation_Module SHALL trả về lỗi "Tên đăng nhập phải có từ 3-20 ký tự"
3. WHEN admin nhập username, THE Validation_Module SHALL kiểm tra ký tự được phép
4. IF username chứa ký tự không phải chữ cái, số hoặc dấu gạch dưới, THEN THE Validation_Module SHALL trả về lỗi "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
5. WHEN username hợp lệ, THE Validation_Module SHALL cho phép submit form

### Yêu Cầu 8: Hiển Thị Danh Sách Người Dùng

**User Story:** Là một admin, tôi muốn xem danh sách tất cả người dùng, để có thể quản lý và theo dõi tài khoản trong hệ thống.

#### Tiêu Chí Chấp Nhận

1. WHEN trang quản lý người dùng được tải, THE Admin_System SHALL đọc dữ liệu người dùng từ LocalStorage
2. THE Admin_System SHALL hiển thị User_Table với các cột: ID, Tên đăng nhập, Email, Ngày tạo, Thao tác
3. WHEN có người dùng trong hệ thống, THE Admin_System SHALL hiển thị thông tin của từng người dùng trong User_Table
4. WHEN không có người dùng nào, THE Admin_System SHALL hiển thị thông báo "Chưa có người dùng nào"
5. THE Admin_System SHALL hiển thị ngày tạo theo định dạng dd/mm/yyyy

### Yêu Cầu 9: Đóng và Hủy Form

**User Story:** Là một admin, tôi muốn có thể đóng hoặc hủy form nhập liệu, để có thể thoát khỏi thao tác thêm/sửa mà không lưu thay đổi.

#### Tiêu Chí Chấp Nhận

1. THE User_Form SHALL hiển thị nút "Hủy" hoặc nút đóng (X)
2. WHEN admin nhấn nút "Hủy" hoặc nút đóng, THE Admin_System SHALL đóng User_Form
3. WHEN form được đóng, THE Admin_System SHALL xóa tất cả dữ liệu đã nhập trong form
4. WHEN form được đóng, THE Admin_System SHALL không lưu bất kỳ thay đổi nào vào LocalStorage
5. WHEN form được đóng, THE Admin_System SHALL hiển thị lại User_Table ở trạng thái ban đầu
