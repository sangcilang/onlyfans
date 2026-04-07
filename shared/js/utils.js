// Cac ham tien ich cho Fan Shop

/**
 * Dinh dang so tien VND
 * @param {number} soTien - So tien can dinh dang
 * @returns {string} - So tien da dinh dang (VD: "1.500.000đ")
 */
function dinhDangTienTe(soTien) {
    if (typeof soTien !== 'number' || isNaN(soTien)) {
        return '0đ';
    }
    return soTien.toLocaleString('vi-VN') + 'đ';
}

/**
 * Lam sach du lieu dau vao de tranh XSS
 * @param {string} duLieuVao - Du lieu can lam sach
 * @returns {string} - Du lieu da duoc lam sach
 */
function lamSachDuLieu(duLieuVao) {
    if (typeof duLieuVao !== 'string') {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = duLieuVao;
    return div.innerHTML;
}

/**
 * Hien thi thong bao
 * @param {string} noiDung - Noi dung thong bao
 * @param {string} loai - Loai thong bao: 'success', 'error', 'info'
 */
function hienThiThongBao(noiDung, loai = 'info') {
    const thongBao = document.createElement('div');
    thongBao.className = `notification ${loai}`;
    thongBao.textContent = noiDung;
    
    document.body.insertBefore(thongBao, document.body.firstChild);
    
    setTimeout(() => {
        thongBao.remove();
    }, 3000);
}

/**
 * Kiem tra cac truong bat buoc
 * @param {Object} cacTruong - Object chua cac truong can kiem tra {tenTruong: giaTri}
 * @returns {Object} - {hopLe: boolean, thongBao: string}
 */
function kiemTraBatBuoc(cacTruong) {
    for (const [tenTruong, giaTri] of Object.entries(cacTruong)) {
        if (!giaTri || (typeof giaTri === 'string' && giaTri.trim() === '')) {
            return {
                hopLe: false,
                thongBao: `Vui lòng điền ${tenTruong}`
            };
        }
    }
    return {
        hopLe: true,
        thongBao: ''
    };
}

/**
 * Tao ID duy nhat
 * @returns {string} - ID duy nhat
 */
function taoId() {
    return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
}

// Backward compatibility - keep old function names
const formatCurrency = dinhDangTienTe;
const sanitizeInput = lamSachDuLieu;
const showNotification = hienThiThongBao;
const validateRequired = kiemTraBatBuoc;
const generateId = taoId;
