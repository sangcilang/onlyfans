# Requirements Document

## Introduction

Tính năng này bổ sung hai phần quan trọng vào trang chi tiết sản phẩm (`pages/product-detail/`) của website thương mại điện tử Fan Shop:

1. **Mô tả sản phẩm chi tiết**: Hiển thị nội dung mô tả phong phú, có cấu trúc cho từng sản phẩm, thay thế đoạn mô tả placeholder hiện tại.
2. **Gợi ý sản phẩm liên quan**: Hiển thị danh sách sản phẩm gợi ý dựa trên khoảng giá và danh mục, giúp người dùng khám phá thêm sản phẩm phù hợp.

Dự án sử dụng Firebase Realtime Database làm backend chính và localStorage làm fallback. Tính năng cần tích hợp với module `products.js` và `firebase-products.js` hiện có.

---

## Glossary

- **Product_Detail_Page**: Trang chi tiết sản phẩm tại `pages/product-detail/index.html`
- **Product**: Đối tượng sản phẩm có các trường: `id`, `name`, `price`, `image`, `badge`, `sold`, `stock`, `description`, `category`, `specifications`, `createdAt`
- **Description_Section**: Khu vực hiển thị mô tả chi tiết sản phẩm trên Product_Detail_Page
- **Recommendation_Section**: Khu vực hiển thị danh sách sản phẩm gợi ý trên Product_Detail_Page
- **Recommendation_Engine**: Module JavaScript chịu trách nhiệm tính toán và trả về danh sách sản phẩm gợi ý
- **Product_Card**: Thẻ UI hiển thị thông tin tóm tắt của một sản phẩm trong Recommendation_Section
- **Category**: Danh mục sản phẩm (ví dụ: "Quạt trần", "Quạt đứng", "Quạt mini", v.v.)
- **Price_Range**: Khoảng giá được tính bằng ±30% so với giá sản phẩm hiện tại
- **Firebase_DB**: Firebase Realtime Database được cấu hình tại `shared/js/firebase-config.js`
- **DB_Adapter**: Module `shared/js/db-adapter.js` trừu tượng hóa việc đọc/ghi dữ liệu giữa Firebase và localStorage

---

## Requirements

### Requirement 1: Lưu trữ mô tả sản phẩm chi tiết

**User Story:** As a quản trị viên, I want lưu trữ mô tả chi tiết và thông số kỹ thuật cho từng sản phẩm, so that khách hàng có đầy đủ thông tin để đưa ra quyết định mua hàng.

#### Acceptance Criteria

1. THE Product SHALL có trường `description` kiểu chuỗi văn bản, tối đa 2000 ký tự.
2. THE Product SHALL có trường `category` kiểu chuỗi để phân loại sản phẩm theo nhóm.
3. THE Product SHALL có trường `specifications` là một đối tượng chứa các cặp key-value mô tả thông số kỹ thuật.
4. WHEN quản trị viên tạo sản phẩm mới mà không cung cấp `description`, THE DB_Adapter SHALL lưu trường `description` với giá trị chuỗi rỗng.
5. WHEN quản trị viên tạo sản phẩm mới mà không cung cấp `category`, THE DB_Adapter SHALL lưu trường `category` với giá trị chuỗi rỗng.
6. WHEN quản trị viên cập nhật sản phẩm với `description` vượt quá 2000 ký tự, THE DB_Adapter SHALL từ chối lưu và trả về thông báo lỗi mô tả giới hạn ký tự.

---

### Requirement 2: Hiển thị mô tả sản phẩm chi tiết

**User Story:** As a khách hàng, I want xem mô tả chi tiết và thông số kỹ thuật của sản phẩm, so that tôi có thể đánh giá sản phẩm có phù hợp với nhu cầu của mình hay không.

#### Acceptance Criteria

1. WHEN Product_Detail_Page tải xong và sản phẩm có `description` không rỗng, THE Description_Section SHALL hiển thị nội dung `description` dưới dạng văn bản có định dạng.
2. WHEN Product_Detail_Page tải xong và sản phẩm có `specifications` không rỗng, THE Description_Section SHALL hiển thị các thông số kỹ thuật dưới dạng bảng hoặc danh sách có nhãn rõ ràng.
3. WHEN Product_Detail_Page tải xong và sản phẩm không có `description` hoặc `description` là chuỗi rỗng, THE Description_Section SHALL hiển thị văn bản mặc định "Chưa có mô tả cho sản phẩm này."
4. WHEN Product_Detail_Page tải xong và sản phẩm không có `specifications` hoặc `specifications` là đối tượng rỗng, THE Description_Section SHALL ẩn phần thông số kỹ thuật.
5. THE Description_Section SHALL hiển thị trong cùng container với thông tin sản phẩm, phía dưới giá và phía trên các nút hành động.

---

### Requirement 3: Tính toán sản phẩm gợi ý

**User Story:** As a khách hàng, I want xem các sản phẩm liên quan khi đang xem chi tiết một sản phẩm, so that tôi có thể dễ dàng khám phá thêm các lựa chọn phù hợp.

#### Acceptance Criteria

1. WHEN khách hàng truy cập Product_Detail_Page với một `productId` hợp lệ, THE Recommendation_Engine SHALL trả về tối đa 4 sản phẩm gợi ý.
2. THE Recommendation_Engine SHALL loại trừ sản phẩm hiện tại khỏi danh sách gợi ý.
3. THE Recommendation_Engine SHALL ưu tiên các sản phẩm có cùng `category` với sản phẩm hiện tại.
4. WHEN số lượng sản phẩm cùng `category` ít hơn 4, THE Recommendation_Engine SHALL bổ sung bằng các sản phẩm có giá nằm trong Price_Range của sản phẩm hiện tại.
5. WHEN không đủ sản phẩm từ cùng `category` và Price_Range, THE Recommendation_Engine SHALL bổ sung bằng các sản phẩm bán chạy nhất (sắp xếp theo trường `sold` giảm dần) cho đến khi đủ 4 sản phẩm.
6. IF tổng số sản phẩm trong hệ thống ít hơn 2 (không đủ để gợi ý sau khi loại trừ sản phẩm hiện tại), THEN THE Recommendation_Engine SHALL trả về mảng rỗng.

---

### Requirement 4: Hiển thị khu vực gợi ý sản phẩm

**User Story:** As a khách hàng, I want xem danh sách sản phẩm gợi ý được trình bày rõ ràng, so that tôi có thể nhanh chóng nhận biết và điều hướng đến sản phẩm quan tâm.

#### Acceptance Criteria

1. WHEN Product_Detail_Page tải xong và Recommendation_Engine trả về ít nhất 1 sản phẩm, THE Recommendation_Section SHALL hiển thị tiêu đề "Sản phẩm gợi ý" và danh sách Product_Card tương ứng.
2. WHEN Recommendation_Engine trả về mảng rỗng, THE Recommendation_Section SHALL ẩn hoàn toàn khỏi trang.
3. THE Product_Card SHALL hiển thị: ảnh sản phẩm, tên sản phẩm, giá sản phẩm đã định dạng theo tiền tệ Việt Nam, và badge (nếu có).
4. WHEN khách hàng nhấp vào một Product_Card, THE Product_Detail_Page SHALL điều hướng đến trang chi tiết của sản phẩm được chọn với `productId` tương ứng trong URL.
5. THE Recommendation_Section SHALL hiển thị các Product_Card theo dạng lưới ngang (horizontal grid), tối đa 4 cột trên màn hình desktop.
6. WHILE màn hình có chiều rộng nhỏ hơn 768px, THE Recommendation_Section SHALL hiển thị các Product_Card theo dạng lưới 2 cột.

---

### Requirement 5: Tích hợp với hệ thống dữ liệu hiện có

**User Story:** As a nhà phát triển, I want tính năng mô tả và gợi ý sản phẩm tích hợp liền mạch với DB_Adapter hiện có, so that không cần thay đổi kiến trúc dữ liệu cốt lõi.

#### Acceptance Criteria

1. THE Recommendation_Engine SHALL sử dụng hàm `getAllProducts()` từ module `products.js` để lấy danh sách sản phẩm.
2. THE Description_Section SHALL sử dụng dữ liệu sản phẩm đã được tải bởi hàm `getProductById()` hiện có, không thực hiện thêm lần gọi dữ liệu riêng biệt.
3. WHEN Firebase_DB khả dụng, THE DB_Adapter SHALL đọc và ghi trường `description`, `category`, `specifications` từ Firebase_DB.
4. WHEN Firebase_DB không khả dụng, THE DB_Adapter SHALL đọc và ghi trường `description`, `category`, `specifications` từ localStorage.
5. THE Recommendation_Engine SHALL hoàn thành việc tính toán và trả về kết quả trong vòng 500ms kể từ khi nhận được dữ liệu sản phẩm.

---

### Requirement 6: Cập nhật giao diện quản trị sản phẩm

**User Story:** As a quản trị viên, I want nhập và chỉnh sửa mô tả chi tiết cũng như danh mục sản phẩm trong trang admin, so that tôi có thể quản lý nội dung sản phẩm một cách đầy đủ.

#### Acceptance Criteria

1. THE trang admin quản lý sản phẩm (`pages/admin/products/`) SHALL có trường nhập liệu `textarea` cho `description` với giới hạn 2000 ký tự và hiển thị bộ đếm ký tự còn lại.
2. THE trang admin quản lý sản phẩm SHALL có trường nhập liệu `input` hoặc `select` cho `category`.
3. WHEN quản trị viên lưu sản phẩm với `description` hợp lệ, THE trang admin SHALL hiển thị thông báo thành công và cập nhật dữ liệu trong DB_Adapter.
4. IF quản trị viên nhập `description` vượt quá 2000 ký tự, THEN THE trang admin SHALL hiển thị thông báo lỗi "Mô tả không được vượt quá 2000 ký tự" và ngăn việc lưu.
