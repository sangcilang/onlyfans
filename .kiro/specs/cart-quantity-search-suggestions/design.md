# Design Document: Cart Quantity & Search Suggestions

## Overview

Tài liệu này mô tả thiết kế kỹ thuật cho hai tính năng UX bổ sung vào website Fan Shop (Vanilla JS + HTML + CSS, không dùng framework):

1. **Quantity Control trong giỏ hàng** — Thêm nút "−" / số lượng / "+" cho mỗi sản phẩm trong `pages/cart/`, cho phép điều chỉnh số lượng trực tiếp thay vì chỉ xóa.
2. **Search Suggestion Dropdown** — Hiển thị dropdown gợi ý sản phẩm bên dưới `#searchInput` trong header khi người dùng gõ, với debounce 300ms và tối đa 6 gợi ý.

Cả hai tính năng đều hoạt động hoàn toàn phía client, sử dụng `localStorage` làm nguồn dữ liệu chính (với Firebase là backend tùy chọn thông qua `db-adapter.js`).

---

## Architecture

### Tổng quan luồng dữ liệu

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser DOM                          │
│                                                             │
│  ┌──────────────────┐        ┌──────────────────────────┐  │
│  │  pages/cart/     │        │  Header (navigation.js)  │  │
│  │  index.html      │        │  #searchInput            │  │
│  │  script.js       │        │  #search-suggestions     │  │
│  └────────┬─────────┘        └────────────┬─────────────┘  │
│           │                               │                 │
│           ▼                               ▼                 │
│  ┌──────────────────┐        ┌──────────────────────────┐  │
│  │  shared/js/      │        │  shared/js/              │  │
│  │  cart.js         │        │  products.js             │  │
│  │  updateCartItem  │        │  getAllProducts()         │  │
│  │  Quantity()      │        │                          │  │
│  └────────┬─────────┘        └────────────┬─────────────┘  │
│           │                               │                 │
│           └──────────────┬────────────────┘                 │
│                          ▼                                  │
│                   localStorage                              │
└─────────────────────────────────────────────────────────────┘
```

### Nguyên tắc thiết kế

- **Không thêm dependency mới**: Chỉ dùng Vanilla JS thuần, không import thư viện ngoài.
- **Tách biệt logic và UI**: Logic nghiệp vụ (tính toán, lưu trữ) nằm trong `shared/js/`, UI rendering nằm trong `pages/cart/script.js` và `shared/js/navigation.js`.
- **Backward compatible**: Các hàm mới không phá vỡ API hiện có của `cart.js` và `navigation.js`.
- **Debounce tự implement**: Dùng `setTimeout`/`clearTimeout` thuần, không cần thư viện.

---

## Components and Interfaces

### Feature 1: Cart Quantity Control

#### 1.1 `shared/js/cart.js` — Hàm mới `updateCartItemQuantity`

```javascript
/**
 * Cập nhật số lượng của một Cart Item theo delta (+1 hoặc -1).
 * Nếu quantity sau khi giảm <= 0, item sẽ bị xóa khỏi giỏ hàng.
 *
 * @param {number} index - Vị trí của item trong mảng cart (0-based)
 * @param {number} delta - Thay đổi số lượng: +1 để tăng, -1 để giảm
 * @returns {Object} - { success: boolean, removed: boolean, message: string }
 */
function updateCartItemQuantity(index, delta)
```

**Hành vi:**
- Load cart từ `_loadCart()`
- Kiểm tra `index` hợp lệ (0 ≤ index < cart.length)
- Tính `newQuantity = item.quantity + delta`
- Nếu `newQuantity <= 0`: gọi `removeFromCart(index)`, trả về `{ success: true, removed: true }`
- Nếu `newQuantity >= 1`: cập nhật `item.quantity`, gọi `_saveCart(cart)`, gọi `updateCartCountUI()`, trả về `{ success: true, removed: false }`

#### 1.2 `pages/cart/script.js` — Cập nhật `renderCart()`

Thêm cột "Số lượng" vào bảng và render Quantity Control cho mỗi item:

```html
<!-- Cấu trúc HTML của Quantity Control -->
<div class="quantity-control">
  <button class="qty-btn qty-minus"
          onclick="handleQuantityChange(${index}, -1)"
          ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
  <span class="qty-display">${item.quantity}</span>
  <button class="qty-btn qty-plus"
          onclick="handleQuantityChange(${index}, +1)">+</button>
</div>
```

Thêm hàm `handleQuantityChange(index, delta)`:

```javascript
/**
 * Xử lý sự kiện thay đổi số lượng từ UI
 * @param {number} index
 * @param {number} delta
 */
function handleQuantityChange(index, delta) {
    updateCartItemQuantity(index, delta);
    renderCart(); // Re-render toàn bộ giỏ hàng
}
```

Cập nhật header bảng: thêm cột `<th>Số lượng</th>` giữa "Đơn giá" và "Thao tác".

#### 1.3 `pages/cart/index.html` — Cập nhật header bảng

Thêm `<th>Số lượng</th>` vào `<thead>`:

```html
<tr>
  <th>Tên quạt</th>
  <th>Đơn giá</th>
  <th>Số lượng</th>
  <th>Thao tác</th>
</tr>
```

#### 1.4 `pages/cart/style.css` — Style cho Quantity Control

```css
.quantity-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.qty-btn {
    width: 32px;
    height: 32px;
    border: 2px solid var(--green-primary);
    background: white;
    color: var(--green-primary);
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qty-btn:hover:not(:disabled) {
    background: var(--green-primary);
    color: white;
}

.qty-btn:disabled {
    border-color: var(--border-color);
    color: var(--text-secondary);
    cursor: not-allowed;
    opacity: 0.5;
}

.qty-display {
    min-width: 28px;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: var(--text-primary);
}
```

---

### Feature 2: Search Suggestion Dropdown

#### 2.1 `shared/js/navigation.js` — Cập nhật `renderHeader()` và thêm logic gợi ý

**Thay đổi trong `renderHeader()`**: Bọc `#searchInput` và `#search-suggestions` trong một wrapper có `position: relative`:

```html
<div class="search-container" style="position: relative;">
  <input type="text" id="searchInput" placeholder="Săn Deal Quạt Mát Chào Hè..."
         autocomplete="off">
  <button onclick="searchProduct ? searchProduct() : void(0)">🔍</button>
  <div id="search-suggestions" class="search-suggestions" style="display:none;"></div>
</div>
```

**Hàm mới `initSearchSuggestions()`** — gọi sau khi header được inject vào DOM:

```javascript
/**
 * Khởi tạo logic gợi ý tìm kiếm cho #searchInput
 * Gọi sau khi header đã được inject vào DOM
 */
function initSearchSuggestions() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('search-suggestions');
    if (!input || !dropdown) return;

    let debounceTimer = null;

    // Lắng nghe sự kiện gõ phím
    input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const query = this.value.trim();
        if (!query) {
            hideSearchSuggestions();
            return;
        }
        debounceTimer = setTimeout(() => {
            showSearchSuggestions(query);
        }, 300);
    });

    // Ẩn dropdown khi nhấn Escape
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideSearchSuggestions();
        }
    });

    // Ẩn dropdown khi click ra ngoài
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            hideSearchSuggestions();
        }
    });
}

/**
 * Lọc và hiển thị gợi ý sản phẩm
 * @param {string} query - Từ khóa tìm kiếm
 */
function showSearchSuggestions(query) {
    const dropdown = document.getElementById('search-suggestions');
    if (!dropdown) return;

    const products = getAllProducts();
    const lowerQuery = query.toLowerCase();
    const matches = products
        .filter(p => p.name.toLowerCase().includes(lowerQuery))
        .slice(0, 6);

    if (matches.length === 0) {
        dropdown.innerHTML = '<div class="suggestion-empty">Không tìm thấy sản phẩm phù hợp</div>';
    } else {
        dropdown.innerHTML = matches.map(p => `
            <div class="suggestion-item" onclick="navigateToProduct('${p.id}')">
                <span class="suggestion-name">${sanitizeInput(p.name)}</span>
                <span class="suggestion-price">${formatCurrency(p.price)}</span>
            </div>
        `).join('');
    }

    dropdown.style.display = 'block';
}

/**
 * Ẩn dropdown gợi ý
 */
function hideSearchSuggestions() {
    const dropdown = document.getElementById('search-suggestions');
    if (dropdown) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
    }
}

/**
 * Điều hướng đến trang chi tiết sản phẩm
 * @param {string} productId
 */
function navigateToProduct(productId) {
    hideSearchSuggestions();
    const basePath = getBasePath();
    window.location.href = `${basePath}product-detail/index.html?id=${productId}`;
}
```

Gọi `initSearchSuggestions()` ở cuối hàm `initNavigation()`.

#### 2.2 `shared/css/common.css` — Style cho Search Suggestion Dropdown

```css
/* Search Suggestions Dropdown */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 0 0 12px 12px;
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    overflow: hidden;
    border: 1px solid var(--border-color);
    border-top: none;
}

.suggestion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid var(--border-color);
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background: var(--green-lighter);
}

.suggestion-name {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 12px;
}

.suggestion-price {
    font-size: 13px;
    color: var(--green-dark);
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
}

.suggestion-empty {
    padding: 16px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
    font-style: italic;
}
```

---

## Data Models

### Cart Item (hiện tại và sau khi cập nhật)

```javascript
// Cấu trúc Cart Item — không thay đổi schema, quantity đã có sẵn
{
    id: string,          // UUID, tạo bởi generateId()
    name: string,        // Tên sản phẩm
    price: number,       // Đơn giá (VNĐ)
    quantity: number,    // Số lượng (>= 1), đã có trong schema hiện tại
    addedAt: string      // ISO timestamp
}
```

> **Lưu ý**: Trường `quantity` đã tồn tại trong schema `addToCart()` (khởi tạo = 1). Hàm `getCartTotal()` đã tính `price * quantity`. Chỉ cần thêm `updateCartItemQuantity()` và cập nhật UI rendering.

### Product (dùng cho Search Suggestions)

```javascript
// Cấu trúc Product — chỉ đọc, không thay đổi
{
    id: string,          // ID sản phẩm
    name: string,        // Tên sản phẩm (dùng để lọc)
    price: number,       // Giá (dùng để hiển thị)
    image: string,       // URL ảnh (không dùng trong suggestion)
    // ... các trường khác không liên quan
}
```

### Search Suggestion State (in-memory, không persist)

```javascript
// State nội bộ trong initSearchSuggestions() closure
{
    debounceTimer: number | null,  // ID của setTimeout hiện tại
    // Không có state nào khác — dropdown được render lại hoàn toàn mỗi lần
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Quantity Control hiển thị đúng số lượng

*For any* giỏ hàng với bất kỳ danh sách Cart_Item nào (mỗi item có `quantity` bất kỳ ≥ 1), khi `renderCart()` được gọi, mỗi hàng trong bảng phải hiển thị đúng giá trị `quantity` của Cart_Item tương ứng trong ô `qty-display`.

**Validates: Requirements 1.1, 1.2, 1.3**

---

### Property 2: Tăng số lượng tăng đúng 1 đơn vị

*For any* giỏ hàng với bất kỳ Cart_Item nào ở bất kỳ `quantity` nào, khi `updateCartItemQuantity(index, +1)` được gọi, `quantity` của item đó phải tăng đúng 1 đơn vị và giá trị mới phải được lưu vào localStorage.

**Validates: Requirements 2.1, 2.4**

---

### Property 3: Giảm số lượng giảm đúng 1 đơn vị (khi quantity > 1)

*For any* giỏ hàng với bất kỳ Cart_Item nào có `quantity > 1`, khi `updateCartItemQuantity(index, -1)` được gọi, `quantity` của item đó phải giảm đúng 1 đơn vị và giá trị mới phải được lưu vào localStorage.

**Validates: Requirements 3.1, 3.5**

---

### Property 4: Nút "−" bị disable khi quantity = 1

*For any* giỏ hàng chứa bất kỳ Cart_Item nào có `quantity = 1`, khi `renderCart()` được gọi, nút "−" của item đó phải có thuộc tính `disabled`.

**Validates: Requirements 3.4**

---

### Property 5: Giảm quantity từ 1 xóa item khỏi giỏ hàng

*For any* giỏ hàng với bất kỳ Cart_Item nào có `quantity = 1`, khi `updateCartItemQuantity(index, -1)` được gọi, item đó phải bị xóa khỏi mảng giỏ hàng và không còn tồn tại trong localStorage.

**Validates: Requirements 4.1**

---

### Property 6: Tổng tiền bằng tổng price × quantity

*For any* giỏ hàng với bất kỳ danh sách Cart_Item nào (mỗi item có `price` và `quantity` bất kỳ), `getCartTotal()` phải trả về đúng tổng của `price * quantity` cho tất cả items.

**Validates: Requirements 5.1, 5.3**

---

### Property 7: Gợi ý tìm kiếm không vượt quá 6 kết quả

*For any* danh sách sản phẩm với bất kỳ số lượng sản phẩm nào và bất kỳ từ khóa tìm kiếm nào, hàm lọc gợi ý phải trả về tối đa 6 sản phẩm.

**Validates: Requirements 6.2**

---

### Property 8: Gợi ý chỉ chứa sản phẩm khớp từ khóa (case-insensitive)

*For any* danh sách sản phẩm và bất kỳ từ khóa tìm kiếm nào, tất cả sản phẩm được trả về trong danh sách gợi ý phải có tên chứa từ khóa đó (không phân biệt hoa thường).

**Validates: Requirements 6.3**

---

### Property 9: Suggestion Item hiển thị đầy đủ tên và giá

*For any* sản phẩm với bất kỳ tên và giá nào, HTML được render cho Suggestion_Item phải chứa tên sản phẩm và giá được định dạng theo VNĐ.

**Validates: Requirements 7.1, 7.2**

---

### Property 10: Click gợi ý điều hướng đến đúng URL sản phẩm

*For any* sản phẩm với bất kỳ `id` nào, khi `navigateToProduct(id)` được gọi, URL điều hướng phải chứa `product-detail/index.html?id={id}` với đúng `id` của sản phẩm đó.

**Validates: Requirements 8.1**

---

## Error Handling

### Cart Quantity Control

| Tình huống | Xử lý |
|---|---|
| `index` ngoài phạm vi mảng | `updateCartItemQuantity` trả về `{ success: false, message: 'Index không hợp lệ' }`, không thay đổi cart |
| `delta` không phải +1 hoặc -1 | Hàm vẫn hoạt động (cộng delta vào quantity), nhưng UI chỉ gọi với ±1 |
| `quantity` sau khi tính ≤ 0 | Xóa item (gọi `removeFromCart`), không để quantity âm |
| localStorage không khả dụng | `_saveCart` throw error, `updateCartItemQuantity` bắt và trả về `{ success: false }` |

### Search Suggestions

| Tình huống | Xử lý |
|---|---|
| `getAllProducts()` trả về mảng rỗng | Hiển thị "Không tìm thấy sản phẩm phù hợp" |
| `getAllProducts()` throw error | Bắt lỗi trong `showSearchSuggestions`, ẩn dropdown, log lỗi ra console |
| `#searchInput` hoặc `#search-suggestions` không tồn tại trong DOM | `initSearchSuggestions` return sớm, không throw |
| Từ khóa chứa ký tự đặc biệt HTML | `sanitizeInput()` đã có sẵn trong `utils.js`, dùng để escape tên sản phẩm khi render |
| Người dùng gõ rất nhanh | Debounce 300ms đảm bảo chỉ gọi `getAllProducts()` một lần sau khi dừng gõ |

---

## Testing Strategy

### Dual Testing Approach

Tính năng này phù hợp với property-based testing vì có nhiều hàm thuần (pure functions) với logic rõ ràng: `updateCartItemQuantity`, `getCartTotal`, hàm lọc gợi ý. Thư viện PBT được chọn: **[fast-check](https://github.com/dubzzz/fast-check)** (JavaScript, không cần framework).

### Unit Tests (Example-based)

**Cart Quantity:**
- Giỏ hàng trống hiển thị thông báo trống (không có Quantity Control)
- Khi item cuối cùng bị xóa do giảm quantity, hiển thị thông báo trống
- Nút "−" enabled khi quantity = 2, disabled khi quantity = 1
- `handleQuantityChange` gọi `renderCart()` sau khi cập nhật

**Search Suggestions:**
- Dropdown ẩn khi input trống
- Dropdown ẩn khi nhấn Escape
- Dropdown ẩn khi click ra ngoài
- Hiển thị "Không tìm thấy sản phẩm phù hợp" khi không có kết quả
- Debounce: gợi ý không cập nhật ngay lập tức, chỉ sau 300ms

### Property-Based Tests

Mỗi property test chạy tối thiểu **100 iterations**. Tag format: `Feature: cart-quantity-search-suggestions, Property {N}: {mô tả ngắn}`.

**Property 1** — `Feature: cart-quantity-search-suggestions, Property 1: quantity-control-displays-correct-quantity`
- Generator: mảng Cart_Item với `quantity` ngẫu nhiên từ 1–99
- Assert: mỗi hàng rendered chứa đúng giá trị `quantity`

**Property 2** — `Feature: cart-quantity-search-suggestions, Property 2: increment-increases-by-one`
- Generator: Cart_Item với `quantity` ngẫu nhiên từ 1–98
- Assert: sau `updateCartItemQuantity(0, +1)`, `getCart()[0].quantity === oldQuantity + 1`

**Property 3** — `Feature: cart-quantity-search-suggestions, Property 3: decrement-decreases-by-one`
- Generator: Cart_Item với `quantity` ngẫu nhiên từ 2–99
- Assert: sau `updateCartItemQuantity(0, -1)`, `getCart()[0].quantity === oldQuantity - 1`

**Property 4** — `Feature: cart-quantity-search-suggestions, Property 4: minus-button-disabled-at-quantity-one`
- Generator: Cart_Item với `quantity = 1`
- Assert: nút `.qty-minus` có `disabled === true` trong rendered HTML

**Property 5** — `Feature: cart-quantity-search-suggestions, Property 5: decrement-from-one-removes-item`
- Generator: giỏ hàng với N items ngẫu nhiên, một item có `quantity = 1`
- Assert: sau `updateCartItemQuantity(index, -1)`, `getCart().length === N - 1`

**Property 6** — `Feature: cart-quantity-search-suggestions, Property 6: total-equals-sum-price-times-quantity`
- Generator: mảng Cart_Item với `price` và `quantity` ngẫu nhiên
- Assert: `getCartTotal() === items.reduce((s, i) => s + i.price * i.quantity, 0)`

**Property 7** — `Feature: cart-quantity-search-suggestions, Property 7: suggestions-max-six`
- Generator: danh sách sản phẩm ngẫu nhiên (0–50 items), từ khóa ngẫu nhiên
- Assert: `filterSuggestions(products, query).length <= 6`

**Property 8** — `Feature: cart-quantity-search-suggestions, Property 8: suggestions-all-match-query`
- Generator: danh sách sản phẩm ngẫu nhiên, từ khóa ngẫu nhiên
- Assert: tất cả kết quả có `name.toLowerCase().includes(query.toLowerCase())`

**Property 9** — `Feature: cart-quantity-search-suggestions, Property 9: suggestion-item-contains-name-and-price`
- Generator: sản phẩm với tên và giá ngẫu nhiên
- Assert: HTML rendered của Suggestion_Item chứa tên sản phẩm và giá định dạng VNĐ

**Property 10** — `Feature: cart-quantity-search-suggestions, Property 10: navigate-uses-correct-product-id`
- Generator: product ID ngẫu nhiên (string)
- Assert: URL được tạo bởi `navigateToProduct(id)` chứa `?id={id}`

### Integration Tests

- Trang giỏ hàng load đúng với dữ liệu từ localStorage
- Thay đổi quantity được persist sau khi reload trang
- Search suggestions hiển thị đúng với dữ liệu sản phẩm thực từ `getAllProducts()`
- Click suggestion điều hướng đến đúng trang product-detail
