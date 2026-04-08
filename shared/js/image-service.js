/**
 * Image Service Module
 * Handles image validation, conversion, and compression for the review system
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

// Constants
const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_IMAGES_PER_REVIEW = 3;

/**
 * Validate image file format and size
 * @param {File} file - The image file to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
function validateImageFile(file) {
    // Check if file exists
    if (!file) {
        return {
            valid: false,
            error: 'Không có file nào được chọn'
        };
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
        return {
            valid: false,
            error: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, GIF'
        };
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return {
            valid: false,
            error: `Kích thước ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB}MB (ảnh hiện tại: ${sizeMB}MB)`
        };
    }

    return {
        valid: true,
        error: null
    };
}

/**
 * Convert image file to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} - Promise that resolves to base64 string
 */
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.valid) {
            reject(new Error(validation.error));
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            resolve(e.target.result);
        };

        reader.onerror = function(error) {
            reject(new Error('Không thể đọc file ảnh. Vui lòng thử lại.'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Compress image by reducing quality or dimensions
 * @param {string} base64String - The base64 encoded image
 * @param {number} maxSizeKB - Maximum size in kilobytes
 * @returns {Promise<string>} - Promise that resolves to compressed base64 string
 */
function compressImage(base64String, maxSizeKB = 500) {
    return new Promise((resolve, reject) => {
        try {
            // Calculate current size in KB
            const currentSizeKB = (base64String.length * 3) / 4 / 1024;

            // If already under limit, return as is
            if (currentSizeKB <= maxSizeKB) {
                resolve(base64String);
                return;
            }

            // Create an image element to load the base64 data
            const img = new Image();

            img.onload = function() {
                // Create canvas for compression
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate compression ratio
                const ratio = Math.sqrt(maxSizeKB / currentSizeKB);
                
                // Set new dimensions
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                // Draw and compress
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Try different quality levels
                let quality = 0.9;
                let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                let compressedSizeKB = (compressedBase64.length * 3) / 4 / 1024;

                // Reduce quality until size is acceptable
                while (compressedSizeKB > maxSizeKB && quality > 0.1) {
                    quality -= 0.1;
                    compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    compressedSizeKB = (compressedBase64.length * 3) / 4 / 1024;
                }

                resolve(compressedBase64);
            };

            img.onerror = function() {
                reject(new Error('Không thể nén ảnh. Vui lòng thử ảnh khác.'));
            };

            img.src = base64String;

        } catch (error) {
            reject(new Error('Lỗi khi nén ảnh: ' + error.message));
        }
    });
}

/**
 * Validate multiple images for a review
 * @param {FileList|Array} files - Array or FileList of image files
 * @returns {Object} - { valid: boolean, error: string|null }
 */
function validateImageCount(files) {
    if (!files || files.length === 0) {
        return {
            valid: true,
            error: null
        };
    }

    if (files.length > MAX_IMAGES_PER_REVIEW) {
        return {
            valid: false,
            error: `Chỉ được tải lên tối đa ${MAX_IMAGES_PER_REVIEW} ảnh`
        };
    }

    return {
        valid: true,
        error: null
    };
}

/**
 * Process multiple image files: validate, convert to base64, and optionally compress
 * @param {FileList|Array} files - Array or FileList of image files
 * @param {boolean} compress - Whether to compress images (default: true)
 * @param {number} maxSizeKB - Maximum size per image in KB (default: 500)
 * @returns {Promise<Array>} - Promise that resolves to array of base64 strings
 */
async function processImages(files, compress = true, maxSizeKB = 500) {
    try {
        // Validate count
        const countValidation = validateImageCount(files);
        if (!countValidation.valid) {
            throw new Error(countValidation.error);
        }

        const base64Images = [];
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            // Convert to base64
            const base64 = await convertImageToBase64(file);

            // Compress if needed
            const finalBase64 = compress ? await compressImage(base64, maxSizeKB) : base64;

            base64Images.push(finalBase64);
        }

        return base64Images;

    } catch (error) {
        throw new Error(error.message || 'Không thể xử lý ảnh. Vui lòng thử lại.');
    }
}

// Vietnamese aliases
const kiemTraFileAnh = validateImageFile;
const chuyenAnhSangBase64 = convertImageToBase64;
const nenAnh = compressImage;
const kiemTraSoLuongAnh = validateImageCount;
const xuLyAnh = processImages;

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        validateImageFile,
        convertImageToBase64,
        compressImage,
        validateImageCount,
        processImages,
        // Vietnamese aliases
        kiemTraFileAnh,
        chuyenAnhSangBase64,
        nenAnh,
        kiemTraSoLuongAnh,
        xuLyAnh,
        // Constants
        MAX_IMAGE_SIZE_MB,
        MAX_IMAGE_SIZE_BYTES,
        ALLOWED_FORMATS,
        MAX_IMAGES_PER_REVIEW
    };
}
