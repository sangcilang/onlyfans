# Tài Liệu Yêu Cầu - Hệ Thống Đánh Giá Sản Phẩm

## Giới Thiệu

Hệ thống đánh giá sản phẩm cho phép người dùng đã mua hàng để lại đánh giá, bình luận và tải ảnh lên cho các sản phẩm. Hệ thống này giúp tăng độ tin cậy và cung cấp thông tin hữu ích cho người mua hàng tiềm năng.

## Thuật Ngữ

- **Review_System**: Hệ thống quản lý đánh giá sản phẩm
- **User**: Người dùng đã đăng nhập vào hệ thống
- **Verified_Purchaser**: Người dùng đã mua sản phẩm (có đơn hàng hoàn thành)
- **Review**: Đánh giá bao gồm xếp hạng sao, văn bản bình luận và ảnh
- **Product**: Sản phẩm trong hệ thống
- **Order**: Đơn hàng đã được tạo trong hệ thống
- **Review_Form**: Form nhập liệu để tạo đánh giá
- **Review_Display**: Khu vực hiển thị danh sách đánh giá trên trang sản phẩm
- **Image_Upload**: Chức năng tải ảnh lên
- **Purchase_Verification**: Quá trình xác minh người dùng đã mua sản phẩm

## Yêu Cầu

### Yêu Cầu 1: Xác Minh Quyền Đánh Giá

**User Story:** Là một người dùng, tôi muốn chỉ những người đã mua sản phẩm mới có thể đánh giá, để đảm bảo đánh giá đến từ người mua thực sự.

#### Tiêu Chí Chấp Nhận

1. WHEN a User views a Product detail page, THE Review_System SHALL display the Review_Form only if the User is a Verified_Purchaser for that Product
2. WHEN a User who is not a Verified_Purchaser attempts to submit a Review, THE Review_System SHALL reject the submission and display an error message
3. THE Purchase_Verification SHALL check if an Order exists in localStorage with the User's ID and the Product ID with status "Đã giao" or "Hoàn thành"
4. WHEN a User is not logged in, THE Review_System SHALL display a message prompting the User to log in before reviewing

### Yêu Cầu 2: Tạo Đánh Giá Với Văn Bản

**User Story:** Là một người mua hàng, tôi muốn viết bình luận về sản phẩm, để chia sẻ trải nghiệm của tôi với người khác.

#### Tiêu Chí Chấp Nhận

1. WHEN a Verified_Purchaser submits the Review_Form, THE Review_System SHALL require a text comment with minimum 10 characters and maximum 1000 characters
2. WHEN a Verified_Purchaser submits a valid Review, THE Review_System SHALL store the Review in localStorage with User ID, Product ID, comment text, and timestamp
3. THE Review_System SHALL sanitize all text input to prevent XSS attacks before storing
4. WHEN a Review is successfully created, THE Review_System SHALL display a success message and refresh the Review_Display

### Yêu Cầu 3: Xếp Hạng Sao

**User Story:** Là một người mua hàng, tôi muốn cho điểm sao cho sản phẩm, để thể hiện mức độ hài lòng của tôi.

#### Tiêu Chí Chấp Nhận

1. THE Review_Form SHALL include a star rating input with values from 1 to 5 stars
2. WHEN a Verified_Purchaser submits the Review_Form, THE Review_System SHALL require a star rating selection
3. THE Review_System SHALL store the star rating value with each Review
4. THE Review_Display SHALL show the average star rating for each Product based on all Reviews

### Yêu Cầu 4: Tải Ảnh Lên

**User Story:** Là một người mua hàng, tôi muốn tải ảnh sản phẩm lên cùng đánh giá, để minh họa trải nghiệm của tôi.

#### Tiêu Chí Chấp Nhận

1. THE Review_Form SHALL include an Image_Upload component that accepts image files (JPEG, PNG, GIF)
2. WHEN a Verified_Purchaser selects an image file, THE Image_Upload SHALL validate the file size is less than 2MB
3. WHEN an image file is valid, THE Image_Upload SHALL convert the image to base64 format for storage in localStorage
4. THE Review_System SHALL allow a maximum of 3 images per Review
5. WHEN an image file exceeds size limit or is invalid format, THE Image_Upload SHALL display an error message and prevent upload

### Yêu Cầu 5: Hiển Thị Đánh Giá

**User Story:** Là một người dùng, tôi muốn xem các đánh giá của sản phẩm, để có thêm thông tin trước khi mua.

#### Tiêu Chí Chấp Nhận

1. WHEN a User views a Product detail page, THE Review_Display SHALL show all Reviews for that Product sorted by newest first
2. THE Review_Display SHALL show for each Review the username, star rating, comment text, images, and timestamp
3. THE Review_Display SHALL indicate Verified_Purchaser status with a badge next to the username
4. WHEN a Product has no Reviews, THE Review_Display SHALL show a message "Chưa có đánh giá nào"
5. THE Review_Display SHALL show a summary section with average star rating and total number of Reviews

### Yêu Cầu 6: Chỉnh Sửa Và Xóa Đánh Giá

**User Story:** Là một người đã đánh giá, tôi muốn chỉnh sửa hoặc xóa đánh giá của mình, để cập nhật ý kiến hoặc sửa lỗi.

#### Tiêu Chí Chấp Nhận

1. WHEN a User views their own Review, THE Review_Display SHALL show edit and delete buttons
2. WHEN a User clicks the edit button, THE Review_System SHALL populate the Review_Form with existing Review data
3. WHEN a User submits an edited Review, THE Review_System SHALL update the existing Review in localStorage and update the timestamp
4. WHEN a User clicks the delete button, THE Review_System SHALL prompt for confirmation
5. WHEN a User confirms deletion, THE Review_System SHALL remove the Review from localStorage and refresh the Review_Display

### Yêu Cầu 7: Giới Hạn Một Đánh Giá Mỗi Người Dùng

**User Story:** Là quản trị viên hệ thống, tôi muốn mỗi người dùng chỉ có thể đánh giá một lần cho mỗi sản phẩm, để tránh spam và đánh giá trùng lặp.

#### Tiêu Chí Chấp Nhận

1. WHEN a Verified_Purchaser has already submitted a Review for a Product, THE Review_System SHALL hide the Review_Form and show an edit option instead
2. THE Review_System SHALL check localStorage for existing Reviews by the same User ID and Product ID before allowing new Review submission
3. WHEN a User attempts to submit a duplicate Review, THE Review_System SHALL reject the submission and display an error message

### Yêu Cầu 8: Cấu Trúc Dữ Liệu LocalStorage

**User Story:** Là một nhà phát triển, tôi muốn có cấu trúc dữ liệu rõ ràng cho đánh giá, để dễ dàng quản lý và truy vấn.

#### Tiêu Chí Chấp Nhận

1. THE Review_System SHALL store Reviews in localStorage with key "reviews" as a JSON array
2. THE Review_System SHALL store each Review object with fields: id, userId, productId, username, rating, comment, images (array), createdAt, updatedAt
3. THE Review_System SHALL generate unique Review IDs using timestamp and random string combination
4. THE Review_System SHALL maintain data integrity by validating all required fields before storage

### Yêu Cầu 9: Quản Lý Đánh Giá Trong Trang Quản Trị

**User Story:** Là admin, tôi muốn xem và quản lý tất cả đánh giá sản phẩm, để theo dõi phản hồi của khách hàng và xử lý các vấn đề.

#### Tiêu Chí Chấp Nhận

1. THE Review_System SHALL provide an admin page at pages/admin/reviews/index.html to display all Reviews
2. THE admin page SHALL display Reviews in a table with columns: Product Name, Username, Rating, Comment (truncated), Date, Actions
3. THE admin page SHALL allow filtering Reviews by rating (All, 5★, 4★, 3★, 2★, 1★)
4. THE admin page SHALL highlight Reviews with rating ≤ 2 stars as "negative reviews" with a warning color
5. THE admin page SHALL display total count of Reviews and count by rating

### Yêu Cầu 10: Xem Chi Tiết Đánh Giá

**User Story:** Là admin, tôi muốn xem chi tiết đầy đủ của một đánh giá, để hiểu rõ vấn đề khách hàng gặp phải.

#### Tiêu Chí Chấp Nhận

1. WHEN admin clicks on a Review in the table, THE Review_System SHALL display a modal with full Review details
2. THE modal SHALL show: Product name, Username, Email (from user data), Rating, Full comment, All images, Created date, Updated date
3. THE modal SHALL display user's order history for context
4. THE modal SHALL show a "Liên hệ khách hàng" button for Reviews with rating ≤ 2 stars

### Yêu Cầu 11: Liên Hệ Khách Hàng Về Đánh Giá Xấu

**User Story:** Là admin, tôi muốn có thông tin liên hệ của khách hàng có đánh giá xấu, để giải quyết vấn đề và cải thiện dịch vụ.

#### Tiêu Chí Chấp Nhận

1. WHEN admin clicks "Liên hệ khách hàng" button, THE Review_System SHALL display user's contact information (email, phone if available)
2. THE Review_System SHALL provide a pre-filled email template with subject "Phản hồi đánh giá sản phẩm [Product Name]"
3. THE email template SHALL include: Customer name, Product name, Review rating, Review comment
4. THE Review_System SHALL provide a "Copy email" button to copy the customer's email address
5. THE Review_System SHALL log the contact attempt with timestamp in the Review object

### Yêu Cầu 12: Xóa Đánh Giá Không Phù Hợp

**User Story:** Là admin, tôi muốn xóa các đánh giá vi phạm quy định hoặc spam, để duy trì chất lượng đánh giá.

#### Tiêu Chí Chấp Nhận

1. THE admin page SHALL provide a delete button for each Review
2. WHEN admin clicks delete, THE Review_System SHALL show a confirmation dialog with Review details
3. WHEN admin confirms deletion, THE Review_System SHALL remove the Review from localStorage
4. THE Review_System SHALL log the deletion action with admin username and timestamp
5. THE Review_System SHALL refresh the Review list after successful deletion

### Yêu Cầu 13: Thống Kê Đánh Giá

**User Story:** Là admin, tôi muốn xem thống kê tổng quan về đánh giá, để đánh giá chất lượng sản phẩm và dịch vụ.

#### Tiêu Chí Chấp Nhận

1. THE admin page SHALL display summary statistics: Total reviews, Average rating, Reviews by rating (5★ to 1★)
2. THE admin page SHALL show count and percentage of negative reviews (≤ 2 stars)
3. THE admin page SHALL display top 5 products with most reviews
4. THE admin page SHALL display top 5 products with lowest average rating
5. THE admin page SHALL update statistics in real-time when Reviews are filtered or deleted

### Yêu Cầu 14: Quản Lý Lịch Sử Liên Hệ Khách Hàng

**User Story:** Là admin, tôi muốn lưu trữ và quản lý lịch sử liên hệ với khách hàng, để theo dõi các tương tác và giải quyết vấn đề hiệu quả.

#### Tiêu Chí Chấp Nhận

1. THE Review_System SHALL provide a "Quản lý liên hệ" page at pages/admin/contacts/index.html
2. WHEN admin contacts a customer about a review, THE Review_System SHALL create a Contact record in localStorage
3. THE Contact record SHALL include: id, reviewId, customerId, customerName, customerEmail, productName, reviewRating, contactReason, contactDate, adminUsername, notes, status
4. THE contacts page SHALL display all Contact records in a table sorted by newest first
5. THE contacts page SHALL allow filtering by status (All, Pending, Contacted, Resolved)

### Yêu Cầu 15: Thêm Ghi Chú Liên Hệ

**User Story:** Là admin, tôi muốn thêm ghi chú về các lần liên hệ với khách hàng, để ghi lại thông tin quan trọng và kết quả xử lý.

#### Tiêu Chí Chấp Nhận

1. WHEN admin views a Contact record, THE Review_System SHALL display an "Thêm ghi chú" button
2. WHEN admin clicks "Thêm ghi chú", THE Review_System SHALL show a modal with textarea for notes
3. WHEN admin submits notes, THE Review_System SHALL append the notes to the Contact record with timestamp
4. THE Contact record SHALL support multiple notes entries with timestamps
5. THE contacts page SHALL display the latest note preview for each Contact

### Yêu Cầu 16: Cập Nhật Trạng Thái Liên Hệ

**User Story:** Là admin, tôi muốn cập nhật trạng thái của các lần liên hệ, để theo dõi tiến độ xử lý.

#### Tiêu Chí Chấp Nhận

1. THE contacts page SHALL provide a status dropdown for each Contact record
2. THE status options SHALL be: "Chờ xử lý" (Pending), "Đã liên hệ" (Contacted), "Đã giải quyết" (Resolved)
3. WHEN admin changes status, THE Review_System SHALL update the Contact record immediately
4. THE Review_System SHALL log status changes with timestamp and admin username
5. THE contacts page SHALL highlight "Chờ xử lý" contacts with a warning color

### Yêu Cầu 17: Xuất Dữ Liệu Liên Hệ Ra Excel

**User Story:** Là admin, tôi muốn xuất danh sách liên hệ ra file Excel, để lưu trữ và báo cáo.

#### Tiêu Chí Chấp Nhận

1. THE contacts page SHALL provide an "Xuất Excel" button
2. WHEN admin clicks "Xuất Excel", THE Review_System SHALL generate an Excel file with all visible Contact records
3. THE Excel file SHALL include columns: Ngày liên hệ, Khách hàng, Email, Sản phẩm, Đánh giá, Lý do liên hệ, Trạng thái, Ghi chú, Admin xử lý
4. THE Excel file SHALL be named "lien-he-khach-hang-[date].xlsx" with current date
5. THE Review_System SHALL use SheetJS (xlsx) library for Excel generation

### Yêu Cầu 18: Cấu Trúc Dữ Liệu Contacts LocalStorage

**User Story:** Là một nhà phát triển, tôi muốn có cấu trúc dữ liệu rõ ràng cho contacts, để dễ dàng quản lý và truy vấn.

#### Tiêu Chí Chấp Nhận

1. THE Review_System SHALL store Contacts in localStorage with key "contacts" as a JSON array
2. THE Review_System SHALL store each Contact object with fields: id, reviewId, customerId, customerName, customerEmail, productName, reviewRating, contactReason, contactDate, adminUsername, notes (array), status, statusHistory (array)
3. THE Review_System SHALL generate unique Contact IDs using timestamp and random string combination
4. THE Review_System SHALL maintain data integrity by validating all required fields before storage

