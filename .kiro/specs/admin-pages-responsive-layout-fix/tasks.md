# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Admin Product Image Column Missing
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test implementation details from Bug Condition in design:
    - Open products page (`pages/admin/products/index.html`) and verify `<thead>` does NOT contain `<th>Hình ảnh</th>`
    - Open inventory page (`pages/admin/inventory/index.html`) and verify table does NOT render image column
    - Open orders page, click "Xem chi tiết", verify product images are NOT displayed
    - Console log `getAllProducts()` and verify `product.image` exists but is NOT rendered
  - The test assertions should match the Expected Behavior Properties from design:
    - ASSERT table SHOULD include `<th>Hình ảnh</th>` header
    - ASSERT table rows SHOULD include `<td>` with `<img>` or placeholder icon 🖼️
    - ASSERT products with valid image URLs SHOULD display 50x50px thumbnails with border-radius 8px
    - ASSERT products without image URLs SHOULD display placeholder icon
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause:
    - Missing `<th>Hình ảnh</th>` in HTML table headers
    - Missing `<td>` with image rendering in JavaScript template strings
    - No CSS styling for `.product-thumbnail` class
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Admin Table Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Click "Sửa" button on products page → observe form opens correctly
    - Click "Xóa" button → observe product is deleted from table
    - Update stock quantity in inventory page → observe value updates correctly
    - Scroll table horizontally on mobile → observe responsive layout works
    - View low stock alerts in inventory → observe warnings display correctly
    - View dashboard charts → observe charts render correctly
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - FOR ALL edit/delete operations → behavior MUST remain unchanged
    - FOR ALL stock updates → calculation and alerts MUST remain unchanged
    - FOR ALL responsive interactions → layout MUST remain unchanged
    - FOR ALL dashboard statistics → charts MUST remain unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 3. Fix for admin product image display

  - [ ] 3.1 Add image column to products page
    - Open `pages/admin/products/index.html`
    - Add `<th>Hình ảnh</th>` in `<thead>` after `<th>ID</th>`, before `<th>Tên sản phẩm</th>`
    - Update empty message colspan from `colspan="6"` to `colspan="7"`
    - Open `pages/admin/products/script.js`
    - In `loadProductsTable()` function, add image cell rendering after `<td>${index + 1}</td>`:
      ```javascript
      <td>
        ${product.image && product.image.trim() !== '' 
          ? `<img src="${product.image}" class="product-thumbnail" alt="${sanitizeInput(product.name)}">` 
          : '<span class="image-placeholder">🖼️</span>'}
      </td>
      ```
    - _Bug_Condition: isBugCondition(input) where input.page = 'products' AND imageColumnRendered = false_
    - _Expected_Behavior: Table SHALL display "Hình ảnh" column with 50x50px thumbnails or placeholder icon_
    - _Preservation: Existing columns (ID, Tên, Giá, Badge, Đã bán, Thao tác) SHALL continue to display correctly_
    - _Requirements: 1.1, 2.1, 2.4, 2.5, 3.1_

  - [ ] 3.2 Add image column to inventory page
    - Open `pages/admin/inventory/index.html`
    - Add `<th>Hình ảnh</th>` in `<thead>` after `<th>ID</th>`
    - Update empty message colspan from `colspan="7"` to `colspan="8"`
    - Open `pages/admin/inventory/script.js`
    - In `loadInventoryTable()` function, add image cell rendering similar to products page
    - _Bug_Condition: isBugCondition(input) where input.page = 'inventory' AND imageColumnRendered = false_
    - _Expected_Behavior: Inventory table SHALL display "Hình ảnh" column for easy product identification_
    - _Preservation: Stock alerts and existing columns SHALL continue to work correctly_
    - _Requirements: 1.2, 2.2, 2.4, 2.5, 3.6_

  - [ ] 3.3 Add image display to orders page
    - Open `pages/admin/orders/script.js`
    - In `viewOrderDetails()` function, update product list rendering to include images
    - Add image display in order details modal/alert
    - Handle cases where product.image is missing or invalid
    - _Bug_Condition: isBugCondition(input) where input.page = 'orders' AND imageColumnRendered = false_
    - _Expected_Behavior: Order details SHALL display product images in product list_
    - _Preservation: Order status updates and existing functionality SHALL continue to work_
    - _Requirements: 1.3, 2.3, 2.4, 2.5, 3.2_

  - [ ] 3.4 Add CSS styling for product thumbnails
    - Open `pages/admin/style.css` (or create if doesn't exist)
    - Add CSS for `.product-thumbnail` class:
      ```css
      .product-thumbnail {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
        display: block;
      }
      ```
    - Add CSS for `.image-placeholder` class:
      ```css
      .image-placeholder {
        font-size: 24px;
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
      }
      ```
    - _Expected_Behavior: Thumbnails SHALL display with 50x50px size, 8px border-radius, cover object-fit_
    - _Preservation: Existing CSS styles SHALL not be affected_
    - _Requirements: 2.1, 2.2, 2.4, 3.4, 3.5_

  - [ ] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Admin Product Image Column Display
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify:
      - Products page displays `<th>Hình ảnh</th>` in table header
      - Inventory page displays image column
      - Orders page displays product images in details
      - Products with valid URLs show 50x50px thumbnails
      - Products without URLs show placeholder icon 🖼️
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Admin Table Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify:
      - Edit/delete operations work correctly
      - Stock updates and alerts work correctly
      - Responsive layout works on mobile/tablet
      - Dashboard charts render correctly
      - All existing columns display correct data
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run all exploration tests - verify they now PASS (bug is fixed)
  - Run all preservation tests - verify they still PASS (no regressions)
  - Manually test in browser:
    - Open products page → verify image column displays
    - Open inventory page → verify image column displays
    - Open orders page → verify product images in details
    - Test edit/delete operations → verify they work
    - Test on mobile → verify responsive layout
  - If any issues arise, ask user for clarification
  - Mark complete when all tests pass and manual verification succeeds
