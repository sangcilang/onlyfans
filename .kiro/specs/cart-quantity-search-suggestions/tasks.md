# Implementation Plan: Cart Quantity Control & Search Suggestions

## Overview

Triển khai hai tính năng UX cho Fan Shop (Vanilla JS + HTML + CSS):
1. **Quantity Control trong giỏ hàng** — thêm nút "−" / số lượng / "+" cho mỗi sản phẩm trong `pages/cart/`.
2. **Search Suggestion Dropdown** — dropdown gợi ý sản phẩm bên dưới `#searchInput` trong header với debounce 300ms.

Không thêm dependency mới. Tất cả thay đổi là Vanilla JS thuần.

## Tasks

- [x] 1. Thêm hàm `updateCartItemQuantity` vào `shared/js/cart.js`
  - Thêm hàm `updateCartItemQuantity(index, delta)` vào cuối file `shared/js/cart.js`
  - Hàm load cart từ `_loadCart()`, kiểm tra `index` hợp lệ (0 ≤ index < cart.length)
  - Tính `newQuantity = item.quantity + delta`
  - Nếu `newQuantity <= 0`: gọi `removeFromCart(index)`, trả về `{ success: true, removed: true }`
  - Nếu `newQuantity >= 1`: cập nhật `item.quantity`, gọi `_saveCart(cart)`, gọi `updateCartCountUI()`, trả về `{ success: true, removed: false }`
  - Nếu `index` không hợp lệ: trả về `{ success: false, message: 'Index không hợp lệ' }`
  - Bắt lỗi localStorage và trả về `{ success: false }` nếu `_saveCart` throw
  - Thêm alias tiếng Việt `capNhatSoLuongGioHang = updateCartItemQuantity` theo pattern hiện có
  - _Requirements: 2.1, 2.4, 3.1, 3.5, 4.1_

  - [ ]* 1.1 Viết property test cho `updateCartItemQuantity` — tăng số lượng
    - **Property 2: Tăng số lượng tăng đúng 1 đơn vị**
    - Generator: Cart_Item với `quantity` ngẫu nhiên từ 1–98; sau `updateCartItemQuantity(0, +1)`, assert `getCart()[0].quantity === oldQuantity + 1`
    - **Validates: Requirements 2.1, 2.4**

  - [ ]* 1.2 Viết property test cho `updateCartItemQuantity` — giảm số lượng
    - **Property 3: Giảm số lượng giảm đúng 1 đơn vị (khi quantity > 1)**
    - Generator: Cart_Item với `quantity` ngẫu nhiên từ 2–99; sau `updateCartItemQuantity(0, -1)`, assert `getCart()[0].quantity === oldQuantity - 1`
    - **Validates: Requirements 3.1, 3.5**

  - [ ]* 1.3 Viết property test cho `updateCartItemQuantity` — xóa khi quantity = 1
    - **Property 5: Giảm quantity từ 1 xóa item khỏi giỏ hàng**
    - Generator: giỏ hàng N items ngẫu nhiên, một item có `quantity = 1`; sau `updateCartItemQuantity(index, -1)`, assert `getCart().length === N - 1`
    - **Validates: Requirements 4.1**

  - [ ]* 1.4 Viết property test cho `getCartTotal`
    - **Property 6: Tổng tiền bằng tổng price × quantity**
    - Generator: mảng Cart_Item với `price` và `quantity` ngẫu nhiên; assert `getCartTotal() === items.reduce((s, i) => s + i.price * i.quantity, 0)`
    - **Validates: Requirements 5.1, 5.3**

- [x] 2. Cập nhật `pages/cart/index.html` — thêm cột Số lượng vào thead
  - Thêm `<th>Số lượng</th>` vào `<thead>` giữa cột "Đơn giá" và "Thao tác"
  - Cập nhật `colspan` của ô thông báo trống từ `3` thành `4` trong `script.js` (xử lý ở task 3)
  - _Requirements: 1.1, 1.2_

- [x] 3. Cập nhật `pages/cart/script.js` — render Quantity Control và xử lý sự kiện
  - Cập nhật hàm `renderCart()`:
    - Thêm cột `<td>` chứa Quantity Control vào mỗi hàng, giữa cột giá và cột thao tác
    - Cấu trúc Quantity Control: `<div class="quantity-control">` chứa nút `.qty-btn.qty-minus` (disabled nếu `quantity <= 1`), `<span class="qty-display">`, nút `.qty-btn.qty-plus`
    - Nút "−": `onclick="handleQuantityChange(${index}, -1)"`, thêm `disabled` nếu `item.quantity <= 1`
    - Nút "+": `onclick="handleQuantityChange(${index}, 1)"`
    - Cập nhật `colspan` của ô thông báo trống từ `3` thành `4`
  - Thêm hàm `handleQuantityChange(index, delta)` gọi `updateCartItemQuantity(index, delta)` rồi `renderCart()`
  - _Requirements: 1.1, 1.2, 1.3, 2.2, 2.3, 3.2, 3.3, 3.4, 4.2, 4.3, 4.4, 5.2, 5.3_

  - [ ]* 3.1 Viết property test cho `renderCart` — hiển thị đúng số lượng
    - **Property 1: Quantity Control hiển thị đúng số lượng**
    - Generator: mảng Cart_Item với `quantity` ngẫu nhiên từ 1–99; assert mỗi hàng rendered chứa đúng giá trị `quantity` trong `.qty-display`
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [ ]* 3.2 Viết property test cho `renderCart` — nút "−" disabled khi quantity = 1
    - **Property 4: Nút "−" bị disable khi quantity = 1**
    - Generator: Cart_Item với `quantity = 1`; assert nút `.qty-minus` có thuộc tính `disabled` trong rendered HTML
    - **Validates: Requirements 3.4**

- [x] 4. Thêm styles Quantity Control vào `pages/cart/style.css`
  - Thêm styles cho `.quantity-control`, `.qty-btn`, `.qty-btn:hover:not(:disabled)`, `.qty-btn:disabled`, `.qty-display` theo đúng spec trong design
  - Đảm bảo dùng CSS variables đã có (`--green-primary`, `--border-color`, `--text-secondary`, `--text-primary`)
  - _Requirements: 1.1, 1.2_

- [x] 5. Checkpoint — Kiểm tra tính năng Quantity Control
  - Đảm bảo tất cả tests liên quan đến cart quantity pass, hỏi người dùng nếu có vấn đề.

- [x] 6. Cập nhật `shared/js/navigation.js` — thêm `#search-suggestions` vào header và `initSearchSuggestions()`
  - Cập nhật hàm `renderHeader()`: bọc `#searchInput` và `#search-suggestions` trong `.search-container` có `position: relative`; thêm `<div id="search-suggestions" class="search-suggestions" style="display:none;"></div>` sau nút tìm kiếm; thêm `autocomplete="off"` vào input
  - Thêm hàm `initSearchSuggestions()` với logic:
    - Lấy `input = document.getElementById('searchInput')` và `dropdown = document.getElementById('search-suggestions')`; return sớm nếu không tìm thấy
    - Khai báo `let debounceTimer = null` trong closure
    - Lắng nghe `input` event: `clearTimeout(debounceTimer)`, nếu query rỗng gọi `hideSearchSuggestions()`, ngược lại set `debounceTimer = setTimeout(() => showSearchSuggestions(query), 300)`
    - Lắng nghe `keydown` event: nếu `e.key === 'Escape'` gọi `hideSearchSuggestions()`
    - Lắng nghe `document.click` event: nếu click ngoài input và dropdown thì gọi `hideSearchSuggestions()`
  - Thêm hàm `showSearchSuggestions(query)`:
    - Gọi `getAllProducts()` trong try/catch (log lỗi và ẩn dropdown nếu throw)
    - Lọc sản phẩm: `products.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 6)`
    - Nếu không có kết quả: render `<div class="suggestion-empty">Không tìm thấy sản phẩm phù hợp</div>`
    - Nếu có kết quả: render các `.suggestion-item` với `onclick="navigateToProduct('${p.id}')"`, chứa `.suggestion-name` (dùng `sanitizeInput`) và `.suggestion-price` (dùng `formatCurrency`)
    - Set `dropdown.style.display = 'block'`
  - Thêm hàm `hideSearchSuggestions()`: set `display = 'none'` và xóa `innerHTML`
  - Thêm hàm `navigateToProduct(productId)`: gọi `hideSearchSuggestions()` rồi `window.location.href = \`${getBasePath()}product-detail/index.html?id=${productId}\``
  - Gọi `initSearchSuggestions()` ở cuối hàm `initNavigation()`, sau `updateCartCountUI()`
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 9.1, 9.2_

  - [ ]* 6.1 Viết property test cho hàm lọc gợi ý — tối đa 6 kết quả
    - **Property 7: Gợi ý tìm kiếm không vượt quá 6 kết quả**
    - Generator: danh sách sản phẩm ngẫu nhiên (0–50 items), từ khóa ngẫu nhiên; assert kết quả lọc `.length <= 6`
    - **Validates: Requirements 6.2**

  - [ ]* 6.2 Viết property test cho hàm lọc gợi ý — chỉ chứa sản phẩm khớp từ khóa
    - **Property 8: Gợi ý chỉ chứa sản phẩm khớp từ khóa (case-insensitive)**
    - Generator: danh sách sản phẩm ngẫu nhiên, từ khóa ngẫu nhiên; assert tất cả kết quả có `name.toLowerCase().includes(query.toLowerCase())`
    - **Validates: Requirements 6.3**

  - [ ]* 6.3 Viết property test cho `showSearchSuggestions` — Suggestion Item chứa tên và giá
    - **Property 9: Suggestion Item hiển thị đầy đủ tên và giá**
    - Generator: sản phẩm với tên và giá ngẫu nhiên; assert HTML rendered của Suggestion_Item chứa tên sản phẩm và giá định dạng VNĐ
    - **Validates: Requirements 7.1, 7.2**

  - [ ]* 6.4 Viết property test cho `navigateToProduct` — URL chứa đúng product ID
    - **Property 10: Click gợi ý điều hướng đến đúng URL sản phẩm**
    - Generator: product ID ngẫu nhiên (string); assert URL được tạo chứa `product-detail/index.html?id={id}` với đúng ID
    - **Validates: Requirements 8.1**

- [x] 7. Thêm styles Search Suggestion Dropdown vào `shared/css/common.css`
  - Thêm styles cho `.search-suggestions`, `.suggestion-item`, `.suggestion-item:last-child`, `.suggestion-item:hover`, `.suggestion-name`, `.suggestion-price`, `.suggestion-empty` theo đúng spec trong design
  - Đảm bảo `.search-suggestions` có `position: absolute; top: 100%; left: 0; right: 0; z-index: 1001`
  - Đảm bảo `.search-container` trong common.css có `position: relative` (hoặc thêm nếu chưa có) để dropdown định vị đúng
  - Dùng CSS variables đã có (`--shadow-lg`, `--border-color`, `--green-lighter`, `--green-dark`, `--text-primary`, `--text-secondary`)
  - _Requirements: 6.1, 7.1, 7.2, 7.3, 7.4_

- [x] 8. Checkpoint cuối — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có vấn đề.

## Notes

- Tasks đánh dấu `*` là optional và có thể bỏ qua để triển khai MVP nhanh hơn
- Mỗi task tham chiếu requirements cụ thể để đảm bảo traceability
- Property tests dùng thư viện **fast-check** (Vanilla JS, không cần framework)
- Trường `quantity` đã tồn tại trong schema Cart_Item hiện tại — không cần migration dữ liệu
- `getCartTotal()` đã tính `price * quantity` đúng — chỉ cần cập nhật UI rendering
- `sanitizeInput()` và `formatCurrency()` đã có sẵn trong `shared/js/utils.js`
