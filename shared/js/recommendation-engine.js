/**
 * Recommendation Engine Module
 * 
 * Module thuần JavaScript để tính toán sản phẩm gợi ý dựa trên:
 * - Cùng category
 * - Cùng khoảng giá (±30%)
 * - Bán chạy nhất
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1, 5.5
 */

/**
 * Chuyển chuỗi `sold` ("1,2k", "10k+", "300", "5,6k") thành số nguyên để so sánh.
 * 
 * @param {string|null|undefined} soldStr - Chuỗi số lượng đã bán
 * @returns {number} - Số nguyên đại diện cho số lượng đã bán
 * 
 * Examples:
 * - "1,2k" → 1200
 * - "10k+" → 10000
 * - "300" → 300
 * - "5,6k" → 5600
 * - null, undefined, "" → 0
 * 
 * Requirements: 3.5
 */
function parseSoldCount(soldStr) {
  // Xử lý edge cases
  if (!soldStr || soldStr === '') {
    return 0;
  }

  // Chuyển thành string để xử lý
  const str = String(soldStr).toLowerCase().trim();
  
  if (str === '') {
    return 0;
  }

  // Loại bỏ dấu "+" nếu có (ví dụ: "10k+")
  const cleanStr = str.replace('+', '');

  // Kiểm tra nếu có "k" (nghìn)
  if (cleanStr.includes('k')) {
    // Loại bỏ "k" và dấu phẩy, chuyển thành số
    const numStr = cleanStr.replace('k', '').replace(',', '.');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : Math.floor(num * 1000);
  }

  // Nếu không có "k", chỉ là số thông thường
  const num = parseInt(cleanStr, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Kiểm tra xem giá của một sản phẩm có nằm trong khoảng ±30% của giá tham chiếu không.
 * 
 * @param {number} price - Giá sản phẩm cần kiểm tra
 * @param {number} referencePrice - Giá tham chiếu
 * @returns {boolean} - true nếu price nằm trong khoảng [referencePrice * 0.7, referencePrice * 1.3]
 * 
 * Requirements: 3.4
 */
function isInPriceRange(price, referencePrice) {
  if (typeof price !== 'number' || typeof referencePrice !== 'number') {
    return false;
  }

  if (referencePrice <= 0) {
    return false;
  }

  const lowerBound = referencePrice * 0.7;
  const upperBound = referencePrice * 1.3;

  return price >= lowerBound && price <= upperBound;
}

/**
 * Tính toán danh sách sản phẩm gợi ý.
 * 
 * Thuật toán:
 * 1. Nếu allProducts.length < 2 → trả về []
 * 2. Nếu currentProductId không tồn tại trong allProducts → trả về []
 * 3. Ưu tiên 1: Lọc sản phẩm cùng category (bỏ qua nếu category rỗng)
 * 4. Ưu tiên 2: Bổ sung sản phẩm trong khoảng giá ±30% cho đến khi đủ 4
 * 5. Ưu tiên 3: Bổ sung sản phẩm bán chạy nhất (sort theo parseSoldCount giảm dần) cho đến khi đủ 4
 * 6. Luôn loại trừ sản phẩm hiện tại và không trùng lặp trong kết quả
 * 7. Trả về tối đa 4 sản phẩm
 * 
 * @param {string} currentProductId - ID sản phẩm hiện tại
 * @param {Product[]} allProducts - Toàn bộ danh sách sản phẩm
 * @returns {Product[]} - Tối đa 4 sản phẩm gợi ý (không chứa sản phẩm hiện tại)
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1, 5.5
 */
function getRecommendations(currentProductId, allProducts) {
  // 1. Nếu allProducts.length < 2 → trả về []
  if (!allProducts || allProducts.length < 2) {
    return [];
  }

  // 2. Tìm sản phẩm hiện tại
  const currentProduct = allProducts.find(p => p.id === currentProductId);
  
  // Nếu currentProductId không tồn tại trong allProducts → trả về []
  if (!currentProduct) {
    return [];
  }

  // Lọc ra các sản phẩm ứng viên (loại trừ sản phẩm hiện tại)
  const candidates = allProducts.filter(p => p.id !== currentProductId);

  if (candidates.length === 0) {
    return [];
  }

  const result = [];
  const MAX_RECOMMENDATIONS = 4;

  // 3. Ưu tiên 1: Cùng category (bỏ qua nếu category rỗng)
  if (currentProduct.category && currentProduct.category.trim() !== '') {
    const sameCategory = candidates.filter(p => 
      p.category && p.category === currentProduct.category
    );
    
    // Thêm tối đa 4 sản phẩm cùng category
    for (let i = 0; i < sameCategory.length && result.length < MAX_RECOMMENDATIONS; i++) {
      result.push(sameCategory[i]);
    }
  }

  // 4. Ưu tiên 2: Cùng khoảng giá (±30%), chưa có trong result
  if (result.length < MAX_RECOMMENDATIONS) {
    const priceRange = candidates.filter(p => 
      !result.includes(p) && 
      isInPriceRange(p.price, currentProduct.price)
    );

    for (let i = 0; i < priceRange.length && result.length < MAX_RECOMMENDATIONS; i++) {
      result.push(priceRange[i]);
    }
  }

  // 5. Ưu tiên 3: Bán chạy nhất, chưa có trong result
  if (result.length < MAX_RECOMMENDATIONS) {
    const bestsellers = candidates
      .filter(p => !result.includes(p))
      .sort((a, b) => parseSoldCount(b.sold) - parseSoldCount(a.sold));

    for (let i = 0; i < bestsellers.length && result.length < MAX_RECOMMENDATIONS; i++) {
      result.push(bestsellers[i]);
    }
  }

  // 6. Trả về tối đa 4 sản phẩm
  return result.slice(0, MAX_RECOMMENDATIONS);
}
