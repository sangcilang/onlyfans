# Implementation Plan: Product Description & Recommendations

## Overview

Triển khai tính năng mô tả sản phẩm chi tiết và gợi ý sản phẩm liên quan cho Fan Shop. Kế hoạch bao gồm: mở rộng schema sản phẩm, tạo Recommendation Engine thuần JS, cập nhật trang chi tiết sản phẩm, và cập nhật trang admin quản lý sản phẩm.

## Tasks

- [x] 1. Mở rộng schema sản phẩm và cập nhật data layer
  - [x] 1.1 Cập nhật `shared/js/products.js` — thêm 3 trường mới vào schema
    - Thêm `description: ''`, `category: ''`, `specifications: {}` vào object sản phẩm trong `initDefaultProducts()` (ít nhất 3 sản phẩm mẫu có dữ liệu thực để test)
    - Cập nhật hàm `addProduct()` để nhận và lưu `description`, `category`, `specifications` với default values khi không cung cấp
    - Cập nhật hàm `updateProduct()` để xử lý 3 trường mới
    - Thêm hàm `normalizeProduct(product)` trả về product với default values cho 3 trường mới nếu chưa có
    - Áp dụng `normalizeProduct` trong `getAllProducts()` và `getProductById()`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 1.2 Viết property test cho round-trip storage của `description` (localStorage path)
    - **Property 2: Description round-trip storage**
    - **Validates: Requirements 1.1, 5.3, 5.4**
    - Dùng fast-check: với bất kỳ chuỗi `description` hợp lệ (≤ 2000 ký tự), sau `addProductLocal` rồi `getProductByIdLocal` phải trả về đúng giá trị
    - File: `tests/unit/db-adapter-validation.test.js`

  - [ ]* 1.3 Viết property test cho round-trip storage của `category` (localStorage path)
    - **Property 3: Category round-trip storage**
    - **Validates: Requirements 1.2**
    - Dùng fast-check: với bất kỳ chuỗi `category`, sau `addProductLocal` rồi `getProductByIdLocal` phải trả về đúng giá trị
    - File: `tests/unit/db-adapter-validation.test.js`

- [x] 2. Thêm validation vào `shared/js/db-adapter.js`
  - [x] 2.1 Cập nhật `addProductLocal()` và `updateProductLocal()` trong `db-adapter.js`
    - Thêm validation: nếu `description` được cung cấp và `description.length > 2000`, trả về `{ success: false, message: "Mô tả không được vượt quá 2000 ký tự" }`
    - Cập nhật `addProductLocal` để lưu `description` (default `""`), `category` (default `""`), `specifications` (default `{}`)
    - Cập nhật `updateProductLocal` để xử lý 3 trường mới, giữ nguyên giá trị cũ nếu không cung cấp trong `updates`
    - Áp dụng `normalizeProduct` khi đọc từ localStorage trong `getAllProductsLocal()` và `getProductByIdLocal()`
    - _Requirements: 1.4, 1.5, 1.6, 5.3, 5.4_

  - [ ]* 2.2 Viết property test cho validation `description` quá dài
    - **Property 1: Description validation — reject oversized input**
    - **Validates: Requirements 1.6, 6.4**
    - Dùng fast-check: với bất kỳ chuỗi có `length > 2000`, `addProductLocal` và `updateProductLocal` phải trả về `{ success: false }` và message chứa "2000"
    - File: `tests/unit/db-adapter-validation.test.js`

- [x] 3. Cập nhật `shared/js/firebase-products.js` — persist 3 trường mới
  - [x] 3.1 Cập nhật `firebaseAddProduct()` để lưu `description`, `category`, `specifications`
    - Thêm 3 trường vào object `newProduct` với default values tương ứng
    - _Requirements: 1.1, 1.2, 1.3, 5.3_

  - [x] 3.2 Cập nhật `firebaseUpdateProduct()` để xử lý 3 trường mới
    - Đảm bảo `updateData` bao gồm `description`, `category`, `specifications` khi được cung cấp trong `updates`
    - _Requirements: 5.3_

  - [x] 3.3 Cập nhật `firebaseGetAllProducts()` và `firebaseGetProductById()` để áp dụng `normalizeProduct`
    - Gọi `normalizeProduct` trên mỗi sản phẩm trả về để đảm bảo 3 trường mới luôn có giá trị
    - _Requirements: 5.3, 5.4_

  - [x] 3.4 Cập nhật `firebaseInitProducts()` — thêm `description`, `category`, `specifications` vào dữ liệu mẫu
    - Thêm dữ liệu thực cho ít nhất 3 sản phẩm mẫu (ví dụ: category "Quạt trần", "Quạt đứng", "Quạt mini")
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Checkpoint — Kiểm tra data layer
  - Đảm bảo `addProduct`, `updateProduct`, `getProductById`, `getAllProducts` hoạt động đúng với 3 trường mới trong cả localStorage và Firebase path
  - Đảm bảo validation `description > 2000 ký tự` trả về lỗi đúng format
  - Đảm bảo `normalizeProduct` được áp dụng nhất quán ở tất cả các điểm đọc dữ liệu
  - Hỏi người dùng nếu có thắc mắc trước khi tiếp tục

- [x] 5. Tạo module `shared/js/recommendation-engine.js`
  - [x] 5.1 Implement hàm `parseSoldCount(soldStr)`
    - Chuyển chuỗi dạng "1,2k", "10k+", "300", "5,6k" thành số nguyên để so sánh
    - Xử lý các edge case: `null`, `undefined`, chuỗi rỗng → trả về `0`
    - _Requirements: 3.5_

  - [x] 5.2 Implement hàm `isInPriceRange(price, referencePrice)`
    - Trả về `true` nếu `price` nằm trong khoảng `referencePrice * 0.7` đến `referencePrice * 1.3`
    - _Requirements: 3.4_

  - [x] 5.3 Implement hàm `getRecommendations(currentProductId, allProducts)`
    - Nếu `allProducts.length < 2` → trả về `[]`
    - Nếu `currentProductId` không tồn tại trong `allProducts` → trả về `[]`
    - Ưu tiên 1: lọc sản phẩm cùng `category` (bỏ qua nếu `category` rỗng)
    - Ưu tiên 2: bổ sung sản phẩm trong khoảng giá ±30% cho đến khi đủ 4
    - Ưu tiên 3: bổ sung sản phẩm bán chạy nhất (sort theo `parseSoldCount(sold)` giảm dần) cho đến khi đủ 4
    - Luôn loại trừ sản phẩm hiện tại và không trùng lặp trong kết quả
    - Trả về tối đa 4 sản phẩm
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1, 5.5_

  - [ ]* 5.4 Viết property test cho recommendation count invariant
    - **Property 4: Recommendation count invariant**
    - **Validates: Requirements 3.1**
    - Dùng fast-check: với bất kỳ mảng sản phẩm có ≥ 2 phần tử, `getRecommendations` phải trả về mảng có độ dài từ 0 đến 4
    - File: `tests/unit/recommendation-engine.test.js`

  - [ ]* 5.5 Viết property test cho current product exclusion
    - **Property 5: Current product exclusion**
    - **Validates: Requirements 3.2**
    - Dùng fast-check: với bất kỳ danh sách sản phẩm và `productId` hợp lệ, kết quả không được chứa sản phẩm có `id === productId`
    - File: `tests/unit/recommendation-engine.test.js`

  - [ ]* 5.6 Viết property test cho category priority
    - **Property 6: Category priority in recommendations**
    - **Validates: Requirements 3.3**
    - Dùng fast-check: nếu có ít nhất 1 sản phẩm khác cùng `category` không rỗng, kết quả phải chứa ít nhất 1 sản phẩm cùng category đó
    - File: `tests/unit/recommendation-engine.test.js`

- [x] 6. Cập nhật `pages/product-detail/index.html` — thêm HTML sections mới
  - Thêm `<section id="description-section" class="description-section">` vào trong `.product-detail-container`, sau phần giá và trước `.product-actions`
  - Thêm `<section id="recommendation-section" class="recommendation-section" style="display:none;">` sau `.review-section`
  - Load script `recommendation-engine.js` trước `script.js` trong phần `<script>` cuối trang
  - _Requirements: 2.5, 4.1, 4.2_

- [x] 7. Implement render functions trong `pages/product-detail/script.js`
  - [x] 7.1 Implement hàm `renderDescriptionHTML(product)`
    - Nếu `description` không rỗng: wrap trong `<div class="description-text">`
    - Nếu `description` rỗng/null: render `<p class="description-empty">Chưa có mô tả cho sản phẩm này.</p>`
    - Nếu `specifications` không rỗng: render `<table class="specs-table">` với các hàng key-value
    - Nếu `specifications` rỗng/null: không render phần specs
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 7.2 Viết property test cho description rendering — non-empty content
    - **Property 7: Description rendering — non-empty content**
    - **Validates: Requirements 2.1**
    - Dùng fast-check: với bất kỳ `product` có `description` không rỗng, `renderDescriptionHTML(product)` phải chứa nội dung `description` đó trong HTML output
    - File: `tests/unit/description-renderer.test.js`

  - [ ]* 7.3 Viết property test cho specifications rendering
    - **Property 8: Specifications rendering — all keys and values present**
    - **Validates: Requirements 2.2**
    - Dùng fast-check: với bất kỳ `product` có `specifications` không rỗng, `renderDescriptionHTML(product)` phải chứa tất cả keys và values của `specifications`
    - File: `tests/unit/description-renderer.test.js`

  - [x] 7.4 Implement hàm `renderProductCardHTML(product)`
    - Render card chứa: `<img src="{product.image}">`, tên sản phẩm, giá định dạng VND (dùng `dinhDangTienTe`), badge (nếu có)
    - Wrap toàn bộ card trong `<a href="?productId={product.id}" class="product-card">`
    - _Requirements: 4.3, 4.4_

  - [ ]* 7.5 Viết property test cho product card — required information
    - **Property 9: Product card contains required information**
    - **Validates: Requirements 4.3**
    - Dùng fast-check: với bất kỳ `product` hợp lệ, `renderProductCardHTML(product)` phải chứa `product.image` trong `src`, `product.name`, và giá đã định dạng
    - File: `tests/unit/product-card-renderer.test.js`

  - [ ]* 7.6 Viết property test cho product card navigation link
    - **Property 10: Product card navigation link**
    - **Validates: Requirements 4.4**
    - Dùng fast-check: với bất kỳ `product` hợp lệ, `renderProductCardHTML(product)` phải chứa thẻ `<a>` có `href` chứa `productId={product.id}`
    - File: `tests/unit/product-card-renderer.test.js`

  - [x] 7.7 Implement hàm `renderRecommendationHTML(recommendations)`
    - Nếu `recommendations.length === 0`: trả về chuỗi rỗng
    - Nếu có kết quả: render `<h2>Sản phẩm gợi ý</h2>` và `<div class="recommendation-grid">` chứa các `renderProductCardHTML(product)`
    - _Requirements: 4.1, 4.2_

  - [x] 7.8 Tích hợp vào `initProductDetailPage()` và `displayProductInfo()`
    - Trong `displayProductInfo(product)`: thêm `<div id="description-section">` vào trong `.product-info-section`, sau giá và trước `.product-actions`; gọi `renderDescriptionHTML(product)` để điền nội dung
    - Sau khi load product, gọi `getAllProducts()` rồi `getRecommendations(currentProductId, allProducts)` để lấy danh sách gợi ý
    - Gọi `renderRecommendationHTML(recommendations)` và điền vào `#recommendation-section`; hiện/ẩn section tùy theo kết quả
    - _Requirements: 2.5, 4.1, 4.2, 5.1, 5.2, 5.5_

- [x] 8. Thêm styles vào `pages/product-detail/style.css`
  - Thêm styles cho `.description-section`: padding, background, border-radius tương tự `.product-description` hiện có
  - Thêm styles cho `.description-text`: font-size 16px, line-height 1.8, color var(--text-primary)
  - Thêm styles cho `.description-empty`: font-style italic, color var(--text-secondary)
  - Thêm styles cho `.specs-table`: width 100%, border-collapse collapse; `th` background var(--green-lighter), `td` padding 10px 16px, border 1px solid var(--border-color)
  - Thêm styles cho `.recommendation-section`: margin-top 48px
  - Thêm styles cho `.recommendation-grid`: display grid, grid-template-columns repeat(4, 1fr), gap 20px; responsive 2 cột khi `max-width: 768px`
  - Thêm styles cho `.product-card`: text-decoration none, background white, border-radius 12px, box-shadow var(--shadow-md), overflow hidden, transition hover; chứa img (width 100%, aspect-ratio 1, object-fit cover), `.card-info` (padding 12px), `.card-name`, `.card-price`, `.card-badge`
  - _Requirements: 4.5, 4.6_

- [x] 9. Checkpoint — Kiểm tra trang product detail
  - Mở trang `pages/product-detail/index.html?productId=1` và xác nhận:
    - Description section hiển thị đúng (có nội dung hoặc fallback text)
    - Specifications table hiển thị nếu sản phẩm có specs
    - Recommendation section hiển thị tối đa 4 product cards
    - Mỗi card có ảnh, tên, giá, và link điều hướng đúng
    - Recommendation section ẩn nếu không có gợi ý
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc

- [x] 10. Cập nhật `pages/admin/products/index.html` — thêm form fields mới
  - Thêm `<div class="form-group">` cho `<select id="product-category">` với các options: Quạt trần, Quạt đứng, Quạt bàn, Quạt mini, Quạt tích điện, Quạt điều hòa, Quạt treo tường, Quạt thông gió, Quạt tháp (và option rỗng mặc định)
  - Thêm `<div class="form-group">` cho `<textarea id="product-description" maxlength="2000">` với placeholder và bộ đếm ký tự `<span id="description-char-count">0</span>/2000 ký tự`
  - Thêm `<div class="form-error" id="description-error" style="display:none;">` để hiển thị lỗi inline
  - _Requirements: 6.1, 6.2_

- [x] 11. Cập nhật `pages/admin/products/script.js` — xử lý form fields mới
  - [x] 11.1 Cập nhật `showAddProductForm()` để reset `product-category` về `""` và `product-description` về `""`; reset char counter về `0`
    - _Requirements: 6.1, 6.2_

  - [x] 11.2 Cập nhật `editProduct(productId)` để điền `product.category` vào select và `product.description` vào textarea; cập nhật char counter
    - _Requirements: 6.1, 6.2_

  - [x] 11.3 Cập nhật `saveProduct()` để đọc `category` và `description` từ form; thêm client-side validation `description.length > 2000` hiển thị lỗi inline qua `#description-error` và ngăn lưu; thêm `description` và `category` vào `productData` trước khi gọi `addProduct`/`updateProduct`
    - _Requirements: 6.3, 6.4_

  - [x] 11.4 Thêm event listener `input` trên `#product-description` để cập nhật `#description-char-count` real-time và ẩn/hiện `#description-error`
    - _Requirements: 6.1_

- [x] 12. Checkpoint cuối — Kiểm tra toàn bộ tính năng
  - Kiểm tra admin form: thêm sản phẩm mới với category và description → xác nhận lưu thành công
  - Kiểm tra admin form: nhập description > 2000 ký tự → xác nhận hiển thị lỗi inline và không lưu
  - Kiểm tra trang product detail với sản phẩm vừa tạo → xác nhận description và recommendations hiển thị đúng
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc

## Notes

- Tasks đánh dấu `*` là optional và có thể bỏ qua để triển khai nhanh hơn
- Mỗi task tham chiếu requirements cụ thể để đảm bảo traceability
- Property tests dùng thư viện [fast-check](https://github.com/dubzzz/fast-check) — có thể load qua CDN hoặc npm
- `normalizeProduct` là hàm dùng chung, nên định nghĩa trong `products.js` và export/dùng lại trong `db-adapter.js` và `firebase-products.js`
- Checkpoints đảm bảo kiểm tra incremental sau mỗi nhóm thay đổi lớn
