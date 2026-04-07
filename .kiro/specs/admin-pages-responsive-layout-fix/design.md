# Admin Product Image Display Bugfix Design

## Overview

Các trang quản trị admin hiện không hiển thị hình ảnh sản phẩm trong bảng dữ liệu, mặc dù dữ liệu sản phẩm đã có trường `image` và form nhập liệu có trường "URL hình ảnh". Bug này ảnh hưởng đến trải nghiệm quản lý vì admin không thể xem trước sản phẩm một cách trực quan.

Fix này sẽ thêm cột "Hình ảnh" vào các bảng admin (products, inventory, orders) để hiển thị thumbnail sản phẩm với kích thước 50x50px, border-radius 8px. Khi sản phẩm không có URL hình ảnh hoặc URL không hợp lệ, hệ thống sẽ hiển thị placeholder icon 🖼️.

## Glossary

- **Bug_Condition (C)**: Điều kiện kích hoạt bug - khi admin xem bảng danh sách sản phẩm trong các trang admin (products, inventory, orders, dashboard)
- **Property (P)**: Hành vi mong muốn - bảng phải hiển thị cột hình ảnh với thumbnail sản phẩm hoặc placeholder
- **Preservation**: Các hành vi hiện tại phải được giữ nguyên - các cột khác, chức năng chỉnh sửa/xóa, responsive layout, cảnh báo tồn kho
- **loadProductsTable()**: Hàm trong `pages/admin/products/script.js` render bảng danh sách sản phẩm
- **loadInventoryTable()**: Hàm trong `pages/admin/inventory/script.js` render bảng quản lý kho
- **loadOrdersTable()**: Hàm trong `pages/admin/orders/script.js` render bảng đơn hàng
- **product.image**: Thuộc tính chứa URL hình ảnh sản phẩm trong object product

## Bug Details

### Bug Condition

Bug xảy ra khi admin truy cập các trang quản trị và xem bảng danh sách sản phẩm. Các hàm `loadProductsTable()`, `loadInventoryTable()`, và `loadOrdersTable()` không render cột hình ảnh, mặc dù dữ liệu `product.image` đã tồn tại.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { page: string, products: Array<Product> }
  OUTPUT: boolean
  
  RETURN input.page IN ['products', 'inventory', 'orders', 'dashboard']
         AND input.products.length > 0
         AND input.products.some(p => p.image !== undefined)
         AND NOT imageColumnRendered(input.page)
END FUNCTION
```

### Examples

- **Products Page**: Admin truy cập `/pages/admin/products/index.html`, bảng hiển thị 6 cột (ID, Tên, Giá, Badge, Đã bán, Thao tác) nhưng không có cột Hình ảnh
- **Inventory Page**: Admin truy cập `/pages/admin/inventory/index.html`, bảng hiển thị 7 cột (ID, Tên, Giá, Tồn kho, Đã bán, Trạng thái, Thao tác) nhưng không có cột Hình ảnh
- **Orders Page**: Admin xem chi tiết đơn hàng, danh sách sản phẩm trong đơn chỉ hiển thị tên và giá, không có hình ảnh
- **Edge Case**: Sản phẩm có `product.image = ''` hoặc `product.image = undefined` - hệ thống nên hiển thị placeholder thay vì bỏ trống

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Các cột hiện tại (ID, Tên sản phẩm, Giá, Badge, Đã bán, Tồn kho, Trạng thái, Thao tác) phải tiếp tục hiển thị đúng dữ liệu
- Chức năng chỉnh sửa, xóa sản phẩm phải hoạt động bình thường
- Form thêm/sửa sản phẩm với trường "URL hình ảnh" phải tiếp tục lưu dữ liệu vào localStorage
- Responsive layout với `.table-container` phải hoạt động đúng khi có thêm cột ảnh
- Cảnh báo sản phẩm sắp hết hàng trong trang inventory phải tiếp tục hoạt động
- Biểu đồ và thống kê trong dashboard phải render đúng

**Scope:**
Tất cả các tương tác không liên quan đến việc hiển thị cột hình ảnh phải hoạt động như cũ. Bao gồm:
- Click chuột vào các nút chỉnh sửa, xóa
- Nhập liệu vào form thêm/sửa sản phẩm
- Thay đổi trạng thái đơn hàng
- Cập nhật số lượng tồn kho
- Scroll ngang trên mobile/tablet

## Hypothesized Root Cause

Dựa trên phân tích code, các nguyên nhân có thể là:

1. **Missing Table Column**: Các file HTML (`pages/admin/products/index.html`, `pages/admin/inventory/index.html`) không có thẻ `<th>Hình ảnh</th>` trong `<thead>`

2. **Missing Cell Rendering**: Các hàm JavaScript (`loadProductsTable()`, `loadInventoryTable()`, `loadOrdersTable()`) không render thẻ `<td>` chứa `<img>` tag cho cột hình ảnh

3. **No Image Fallback Logic**: Không có logic xử lý trường hợp `product.image` rỗng hoặc undefined để hiển thị placeholder

4. **CSS Styling Missing**: Có thể thiếu CSS để style thumbnail (width, height, border-radius, object-fit)

## Correctness Properties

Property 1: Bug Condition - Image Column Display

_For any_ admin page (products, inventory, orders) where the product table is rendered and products have image URLs, the fixed rendering function SHALL display an "Hình ảnh" column with product thumbnails (50x50px, border-radius 8px, object-fit cover) or placeholder icon 🖼️ when image URL is missing/invalid.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 2: Preservation - Existing Table Functionality

_For any_ table interaction that does NOT involve viewing the image column (editing products, deleting products, updating stock, changing order status, scrolling table), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Giả sử phân tích root cause đúng, các thay đổi cần thực hiện:

**File**: `pages/admin/products/index.html`

**Function**: Table header trong `<thead>`

**Specific Changes**:
1. **Add Image Column Header**: Thêm `<th>Hình ảnh</th>` vào `<thead>` sau cột ID, trước cột "Tên sản phẩm"
   - Vị trí: Giữa `<th>ID</th>` và `<th>Tên sản phẩm</th>`
   - Cập nhật colspan trong empty message từ `colspan="6"` thành `colspan="7"`

**File**: `pages/admin/products/script.js`

**Function**: `loadProductsTable()`

**Specific Changes**:
2. **Add Image Cell Rendering**: Thêm `<td>` chứa `<img>` hoặc placeholder vào template string
   - Vị trí: Sau `<td>${index + 1}</td>`, trước `<td><strong>${sanitizeInput(product.name)}</strong></td>`
   - Logic: `product.image ? <img src="${product.image}" class="product-thumbnail"> : <span class="image-placeholder">🖼️</span>`

3. **Add Image Fallback Logic**: Xử lý trường hợp `product.image` rỗng, undefined, hoặc URL không hợp lệ
   - Kiểm tra: `if (!product.image || product.image.trim() === '')`
   - Fallback: Hiển thị `<span class="image-placeholder">🖼️</span>`

**File**: `pages/admin/inventory/index.html`

**Function**: Table header trong `<thead>`

**Specific Changes**:
4. **Add Image Column Header**: Thêm `<th>Hình ảnh</th>` vào `<thead>` sau cột ID
   - Cập nhật colspan trong empty message từ `colspan="7"` thành `colspan="8"`

**File**: `pages/admin/inventory/script.js`

**Function**: `loadInventoryTable()`

**Specific Changes**:
5. **Add Image Cell Rendering**: Tương tự products page, thêm cột hình ảnh vào template string

**File**: `pages/admin/orders/script.js`

**Function**: `viewOrderDetails()`

**Specific Changes**:
6. **Add Image to Order Details**: Trong hàm `viewOrderDetails()`, cập nhật `itemsList` để bao gồm thông tin hình ảnh (hoặc chỉ hiển thị trong bảng nếu có)

**File**: `pages/admin/style.css` (hoặc tạo mới nếu cần)

**Specific Changes**:
7. **Add Thumbnail Styles**: Thêm CSS cho `.product-thumbnail` và `.image-placeholder`
   ```css
   .product-thumbnail {
     width: 50px;
     height: 50px;
     border-radius: 8px;
     object-fit: cover;
   }
   .image-placeholder {
     font-size: 24px;
     display: inline-block;
   }
   ```

## Testing Strategy

### Validation Approach

Testing strategy tuân theo two-phase approach: đầu tiên, chạy exploratory tests trên UNFIXED code để surface counterexamples và xác nhận bug, sau đó verify fix hoạt động đúng và preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples demonstrating bug BEFORE implementing fix. Xác nhận hoặc bác bỏ root cause analysis. Nếu bác bỏ, cần re-hypothesize.

**Test Plan**: Mở các trang admin trong browser, inspect DOM để kiểm tra xem có cột hình ảnh không, kiểm tra console log để xem `product.image` có tồn tại không. Chạy tests trên UNFIXED code để quan sát failures.

**Test Cases**:
1. **Products Page Missing Image Column**: Mở `/pages/admin/products/index.html`, kiểm tra `<thead>` không có `<th>Hình ảnh</th>` (will fail on unfixed code)
2. **Inventory Page Missing Image Column**: Mở `/pages/admin/inventory/index.html`, kiểm tra bảng không render cột ảnh (will fail on unfixed code)
3. **Orders Page Missing Product Images**: Mở `/pages/admin/orders/index.html`, click "Xem chi tiết" đơn hàng, kiểm tra không có hình ảnh sản phẩm (will fail on unfixed code)
4. **Product Data Has Image URL**: Console log `getAllProducts()`, verify rằng `product.image` tồn tại nhưng không được render (will fail on unfixed code)

**Expected Counterexamples**:
- DOM không chứa `<th>Hình ảnh</th>` trong các bảng admin
- Template string trong `loadProductsTable()` không có `<td>` cho hình ảnh
- Possible causes: missing HTML column, missing JS rendering logic, no CSS styling

### Fix Checking

**Goal**: Verify rằng với tất cả inputs thỏa bug condition, fixed function tạo ra expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := renderProductTable_fixed(input.products)
  ASSERT result.includes('<th>Hình ảnh</th>')
  ASSERT result.includes('<img') OR result.includes('🖼️')
  ASSERT imageColumnDisplayed(result)
END FOR
```

### Preservation Checking

**Goal**: Verify rằng với tất cả inputs không thỏa bug condition (các tương tác khác), fixed function tạo ra kết quả giống original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT renderProductTable_original(input) = renderProductTable_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing được khuyến nghị cho preservation checking vì:
- Tự động generate nhiều test cases across input domain
- Catch edge cases mà manual unit tests có thể bỏ sót
- Cung cấp strong guarantees rằng behavior không thay đổi cho non-buggy inputs

**Test Plan**: Quan sát behavior trên UNFIXED code trước cho các tương tác không liên quan đến cột ảnh (edit, delete, update stock), sau đó viết property-based tests capturing behavior đó.

**Test Cases**:
1. **Edit Product Preservation**: Quan sát rằng click "Sửa" button mở form đúng trên unfixed code, sau đó verify behavior này tiếp tục sau fix
2. **Delete Product Preservation**: Quan sát rằng click "Xóa" button xóa sản phẩm đúng trên unfixed code, sau đó verify behavior này tiếp tục sau fix
3. **Stock Update Preservation**: Quan sát rằng thay đổi số lượng tồn kho trong inventory page hoạt động đúng trên unfixed code, sau đó verify behavior này tiếp tục sau fix
4. **Responsive Layout Preservation**: Quan sát rằng scroll ngang trên mobile hoạt động đúng trên unfixed code, sau đó verify behavior này tiếp tục sau fix
5. **Low Stock Alert Preservation**: Quan sát rằng cảnh báo sắp hết hàng hiển thị đúng trên unfixed code, sau đó verify behavior này tiếp tục sau fix

### Unit Tests

- Test render cột hình ảnh với product có image URL hợp lệ
- Test render placeholder với product không có image URL
- Test render placeholder với product có image URL rỗng
- Test colspan được cập nhật đúng trong empty message
- Test CSS styling được apply đúng cho thumbnail

### Property-Based Tests

- Generate random product arrays với các image URL khác nhau (valid, invalid, empty, undefined) và verify cột ảnh render đúng
- Generate random user interactions (edit, delete, update stock) và verify behavior không thay đổi
- Test across nhiều screen sizes để verify responsive layout preservation

### Integration Tests

- Test full flow: mở products page → verify cột ảnh hiển thị → click edit → verify form mở đúng → save → verify bảng update với ảnh
- Test full flow: mở inventory page → verify cột ảnh hiển thị → update stock → verify cảnh báo sắp hết hàng vẫn hoạt động
- Test full flow: mở orders page → click xem chi tiết → verify hình ảnh sản phẩm hiển thị trong modal/alert
