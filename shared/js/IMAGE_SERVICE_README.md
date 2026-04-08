# Image Service Module

Module xử lý ảnh cho hệ thống đánh giá sản phẩm.

## Chức năng

### 1. Validate Image File
Kiểm tra định dạng và kích thước file ảnh.

```javascript
const result = validateImageFile(file);
// hoặc
const result = kiemTraFileAnh(file);

if (result.valid) {
    console.log('File hợp lệ');
} else {
    console.error(result.error);
}
```

**Quy tắc:**
- Định dạng: JPEG, PNG, GIF
- Kích thước tối đa: 2MB

### 2. Convert to Base64
Chuyển đổi file ảnh sang chuỗi base64.

```javascript
try {
    const base64String = await convertImageToBase64(file);
    // hoặc
    const base64String = await chuyenAnhSangBase64(file);
    
    console.log('Base64:', base64String);
} catch (error) {
    console.error(error.message);
}
```

### 3. Compress Image
Nén ảnh để giảm kích thước.

```javascript
try {
    const compressed = await compressImage(base64String, 500); // 500KB
    // hoặc
    const compressed = await nenAnh(base64String, 500);
    
    console.log('Ảnh đã nén');
} catch (error) {
    console.error(error.message);
}
```

### 4. Process Multiple Images
Xử lý nhiều ảnh cùng lúc (validate, convert, compress).

```javascript
try {
    const images = await processImages(fileList, true, 200);
    // hoặc
    const images = await xuLyAnh(fileList, true, 200);
    
    console.log(`Đã xử lý ${images.length} ảnh`);
} catch (error) {
    console.error(error.message);
}
```

**Tham số:**
- `fileList`: FileList hoặc Array của File objects
- `compress`: true/false - có nén ảnh không (mặc định: true)
- `maxSizeKB`: kích thước tối đa mỗi ảnh sau nén (mặc định: 500KB)

## Hằng số

```javascript
MAX_IMAGE_SIZE_MB = 2           // Kích thước tối đa mỗi file
MAX_IMAGE_SIZE_BYTES = 2097152  // 2MB in bytes
ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif']
MAX_IMAGES_PER_REVIEW = 3       // Số ảnh tối đa mỗi đánh giá
```

## Ví dụ sử dụng trong form

```html
<input type="file" id="imageInput" accept="image/jpeg,image/png,image/gif" multiple>
<button onclick="handleUpload()">Tải ảnh lên</button>
<div id="preview"></div>

<script src="shared/js/image-service.js"></script>
<script>
async function handleUpload() {
    const input = document.getElementById('imageInput');
    const files = input.files;
    
    try {
        // Xử lý tất cả ảnh
        const images = await processImages(files, true, 200);
        
        // Hiển thị preview
        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        images.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.style.maxWidth = '200px';
            preview.appendChild(imgElement);
        });
        
        // Lưu vào review
        // reviewData.images = images;
        
    } catch (error) {
        alert(error.message);
    }
}
</script>
```

## Thông báo lỗi (tiếng Việt)

- "Không có file nào được chọn"
- "Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF"
- "Kích thước ảnh không được vượt quá 2MB (ảnh hiện tại: X.XX MB)"
- "Không thể đọc file ảnh. Vui lòng thử lại."
- "Không thể nén ảnh. Vui lòng thử ảnh khác."
- "Chỉ được tải lên tối đa 3 ảnh"
- "Không thể xử lý ảnh. Vui lòng thử lại."

## Requirements

Module này đáp ứng các yêu cầu:
- **4.1**: Chấp nhận định dạng JPEG, PNG, GIF
- **4.2**: Validate kích thước < 2MB
- **4.3**: Chuyển đổi sang base64
- **4.4**: Giới hạn tối đa 3 ảnh
- **4.5**: Thông báo lỗi bằng tiếng Việt

## Testing

Mở file `test-image-service.html` trong trình duyệt để test các chức năng:
1. Validate file ảnh
2. Chuyển đổi sang base64
3. Nén ảnh
4. Xử lý nhiều ảnh
5. Test các hàm tiếng Việt
