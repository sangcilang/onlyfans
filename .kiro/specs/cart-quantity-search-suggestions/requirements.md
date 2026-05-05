# Requirements Document

## Introduction

Tính năng này bổ sung hai cải tiến UX quan trọng cho website Fan Shop:

1. **Nút thêm/bớt số lượng trong giỏ hàng**: Hiện tại trang giỏ hàng (`pages/cart/`) chỉ cho phép xóa sản phẩm. Tính năng này thêm nút "+" và "−" để người dùng điều chỉnh số lượng từng sản phẩm trực tiếp trong giỏ, đồng thời cập nhật tổng tiền theo thời gian thực.

2. **Gợi ý sản phẩm khi tìm kiếm**: Ô tìm kiếm trên header (`#searchInput` trong `navigation.js`) hiện chỉ điều hướng khi nhấn nút. Tính năng này hiển thị dropdown gợi ý sản phẩm phù hợp ngay khi người dùng gõ, giúp tìm kiếm nhanh hơn và điều hướng trực tiếp đến trang chi tiết sản phẩm.

## Glossary

- **Cart_Page**: Trang giỏ hàng tại `pages/cart/`, render bởi `pages/cart/script.js`
- **Cart_Module**: Module quản lý giỏ hàng tại `shared/js/cart.js`, cung cấp các hàm `getCart()`, `getCartTotal()`, `removeFromCart()`
- **Cart_Item**: Một đối tượng trong mảng giỏ hàng, có các trường `id`, `name`, `price`, `quantity`, `addedAt`
- **Quantity_Control**: Bộ điều khiển gồm nút "−", ô hiển thị số lượng, và nút "+" cho một Cart_Item
- **Search_Input**: Ô nhập liệu `#searchInput` trong header, được render bởi `navigation.js`
- **Search_Suggestion_Dropdown**: Danh sách gợi ý sản phẩm hiển thị bên dưới Search_Input khi người dùng gõ
- **Suggestion_Item**: Một dòng trong Search_Suggestion_Dropdown, đại diện cho một sản phẩm phù hợp
- **Products_Module**: Module quản lý sản phẩm tại `shared/js/products.js`, cung cấp hàm `getAllProducts()`
- **Product_Detail_Page**: Trang chi tiết sản phẩm tại `pages/product-detail/index.html`
- **Total_Price_Display**: Phần tử `#total-price-display` hiển thị tổng tiền giỏ hàng

---

## Requirements

### Requirement 1: Hiển thị Quantity Control cho mỗi Cart Item

**User Story:** As a người mua hàng, I want thấy nút "+" và "−" bên cạnh mỗi sản phẩm trong giỏ hàng, so that tôi có thể điều chỉnh số lượng mà không cần xóa và thêm lại sản phẩm.

#### Acceptance Criteria

1. THE Cart_Page SHALL hiển thị một Quantity_Control cho mỗi Cart_Item trong bảng giỏ hàng.
2. THE Quantity_Control SHALL bao gồm nút "−", ô hiển thị số lượng hiện tại, và nút "+", theo đúng thứ tự từ trái sang phải.
3. WHEN Cart_Page được tải, THE Quantity_Control SHALL hiển thị đúng giá trị `quantity` hiện tại của Cart_Item tương ứng.
4. WHEN giỏ hàng trống, THE Cart_Page SHALL hiển thị thông báo trống thay vì Quantity_Control.

---

### Requirement 2: Tăng số lượng Cart Item

**User Story:** As a người mua hàng, I want nhấn nút "+" để tăng số lượng sản phẩm, so that tôi có thể mua nhiều hơn một đơn vị mà không cần thêm lại từ trang sản phẩm.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "+" của một Cart_Item, THE Cart_Module SHALL tăng `quantity` của Cart_Item đó lên 1 đơn vị.
2. WHEN `quantity` của một Cart_Item được tăng, THE Cart_Page SHALL cập nhật ô hiển thị số lượng của Quantity_Control tương ứng ngay lập tức.
3. WHEN `quantity` của một Cart_Item được tăng, THE Total_Price_Display SHALL cập nhật tổng tiền ngay lập tức.
4. THE Cart_Module SHALL lưu giá trị `quantity` đã cập nhật vào localStorage sau mỗi lần thay đổi.

---

### Requirement 3: Giảm số lượng Cart Item

**User Story:** As a người mua hàng, I want nhấn nút "−" để giảm số lượng sản phẩm, so that tôi có thể điều chỉnh đơn hàng mà không cần xóa hoàn toàn sản phẩm.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "−" của một Cart_Item có `quantity` lớn hơn 1, THE Cart_Module SHALL giảm `quantity` của Cart_Item đó xuống 1 đơn vị.
2. WHEN `quantity` của một Cart_Item được giảm, THE Cart_Page SHALL cập nhật ô hiển thị số lượng của Quantity_Control tương ứng ngay lập tức.
3. WHEN `quantity` của một Cart_Item được giảm, THE Total_Price_Display SHALL cập nhật tổng tiền ngay lập tức.
4. WHILE `quantity` của một Cart_Item bằng 1, THE Cart_Page SHALL vô hiệu hóa (disable) nút "−" của Quantity_Control tương ứng.
5. THE Cart_Module SHALL lưu giá trị `quantity` đã cập nhật vào localStorage sau mỗi lần thay đổi.

---

### Requirement 4: Xóa Cart Item khi số lượng về 0

**User Story:** As a người mua hàng, I want sản phẩm tự động bị xóa khỏi giỏ hàng khi tôi giảm số lượng xuống 0, so that giỏ hàng không hiển thị sản phẩm với số lượng 0.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "−" của một Cart_Item có `quantity` bằng 1, THE Cart_Module SHALL xóa Cart_Item đó khỏi giỏ hàng.
2. WHEN một Cart_Item bị xóa do giảm số lượng, THE Cart_Page SHALL xóa hàng tương ứng khỏi bảng giỏ hàng ngay lập tức.
3. WHEN tất cả Cart_Item bị xóa, THE Cart_Page SHALL hiển thị thông báo giỏ hàng trống.
4. WHEN một Cart_Item bị xóa do giảm số lượng, THE Total_Price_Display SHALL cập nhật tổng tiền ngay lập tức.

---

### Requirement 5: Tính toán tổng tiền theo số lượng

**User Story:** As a người mua hàng, I want tổng tiền phản ánh đúng số lượng của từng sản phẩm, so that tôi biết chính xác số tiền cần thanh toán.

#### Acceptance Criteria

1. THE Cart_Module SHALL tính tổng tiền bằng tổng của `price * quantity` cho tất cả Cart_Item trong giỏ hàng.
2. WHEN `quantity` của bất kỳ Cart_Item nào thay đổi, THE Total_Price_Display SHALL hiển thị tổng tiền đã được tính lại trong vòng 100ms.
3. THE Cart_Page SHALL hiển thị tổng tiền đúng ngay khi trang được tải lần đầu, dựa trên `quantity` hiện tại của từng Cart_Item.

---

### Requirement 6: Hiển thị Search Suggestion Dropdown

**User Story:** As a người mua hàng, I want thấy danh sách gợi ý sản phẩm khi tôi gõ vào ô tìm kiếm, so that tôi có thể tìm thấy sản phẩm nhanh hơn mà không cần nhấn Enter.

#### Acceptance Criteria

1. WHEN người dùng gõ ít nhất 1 ký tự vào Search_Input, THE Search_Suggestion_Dropdown SHALL xuất hiện bên dưới Search_Input.
2. THE Search_Suggestion_Dropdown SHALL hiển thị tối đa 6 Suggestion_Item phù hợp nhất với từ khóa đã nhập.
3. THE Search_Suggestion_Dropdown SHALL lọc sản phẩm từ `getAllProducts()` dựa trên sự xuất hiện của từ khóa (không phân biệt hoa thường) trong tên sản phẩm.
4. WHEN Search_Input trống, THE Search_Suggestion_Dropdown SHALL ẩn đi.
5. WHEN người dùng nhấp ra ngoài Search_Input và Search_Suggestion_Dropdown, THE Search_Suggestion_Dropdown SHALL ẩn đi.

---

### Requirement 7: Nội dung và giao diện Suggestion Item

**User Story:** As a người mua hàng, I want mỗi gợi ý hiển thị tên và giá sản phẩm, so that tôi có thể nhận ra sản phẩm cần tìm trước khi click vào.

#### Acceptance Criteria

1. THE Suggestion_Item SHALL hiển thị tên sản phẩm.
2. THE Suggestion_Item SHALL hiển thị giá sản phẩm được định dạng theo đơn vị tiền tệ Việt Nam (VNĐ).
3. WHEN không có sản phẩm nào khớp với từ khóa, THE Search_Suggestion_Dropdown SHALL hiển thị thông báo "Không tìm thấy sản phẩm phù hợp".
4. WHEN người dùng di chuột qua một Suggestion_Item, THE Search_Suggestion_Dropdown SHALL làm nổi bật (highlight) Suggestion_Item đó.

---

### Requirement 8: Điều hướng từ Search Suggestion

**User Story:** As a người mua hàng, I want click vào một gợi ý để đến trang chi tiết sản phẩm đó, so that tôi có thể xem thông tin đầy đủ và thêm vào giỏ hàng.

#### Acceptance Criteria

1. WHEN người dùng click vào một Suggestion_Item, THE Cart_Page SHALL điều hướng trình duyệt đến Product_Detail_Page của sản phẩm tương ứng với URL dạng `pages/product-detail/index.html?id={productId}`.
2. WHEN người dùng click vào một Suggestion_Item, THE Search_Suggestion_Dropdown SHALL ẩn đi.
3. WHEN người dùng nhấn phím Escape trong khi Search_Suggestion_Dropdown đang hiển thị, THE Search_Suggestion_Dropdown SHALL ẩn đi.

---

### Requirement 9: Hiệu năng tìm kiếm gợi ý

**User Story:** As a người mua hàng, I want gợi ý xuất hiện nhanh khi tôi gõ, so that trải nghiệm tìm kiếm không bị gián đoạn.

#### Acceptance Criteria

1. WHEN người dùng gõ vào Search_Input, THE Search_Suggestion_Dropdown SHALL cập nhật danh sách gợi ý trong vòng 300ms kể từ lần gõ phím cuối cùng (debounce).
2. THE Products_Module SHALL được gọi để lấy danh sách sản phẩm không quá một lần cho mỗi lần người dùng dừng gõ (debounce interval).
