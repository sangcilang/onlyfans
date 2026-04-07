# Bugfix Requirements Document

## Introduction

Các trang quản trị admin (dashboard, orders, products, users, posts, activity) hiện không hiển thị hình ảnh sản phẩm trong bảng dữ liệu. Mặc dù form nhập liệu có trường "URL hình ảnh" để lưu đường dẫn ảnh sản phẩm, nhưng các bảng hiển thị danh sách không có cột ảnh, khiến admin không thể xem trước sản phẩm một cách trực quan. Điều này ảnh hưởng đến trải nghiệm quản lý và khả năng nhận diện sản phẩm nhanh chóng.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN admin truy cập trang products (pages/admin/products/) THEN bảng danh sách sản phẩm không hiển thị cột hình ảnh

1.2 WHEN admin truy cập trang inventory (pages/admin/inventory/) THEN bảng quản lý kho không hiển thị cột hình ảnh sản phẩm

1.3 WHEN admin truy cập trang orders (pages/admin/orders/) THEN bảng đơn hàng không hiển thị hình ảnh sản phẩm trong chi tiết đơn

1.4 WHEN admin truy cập trang dashboard (pages/admin/dashboard/) THEN các thống kê và bảng không hiển thị hình ảnh sản phẩm

1.5 WHEN sản phẩm có URL hình ảnh được lưu trong dữ liệu THEN hình ảnh không được render ra màn hình trong bất kỳ bảng admin nào

### Expected Behavior (Correct)

2.1 WHEN admin truy cập trang products THEN bảng danh sách sản phẩm SHALL hiển thị cột "Hình ảnh" với thumbnail sản phẩm (kích thước 50x50px, border-radius 8px)

2.2 WHEN admin truy cập trang inventory THEN bảng quản lý kho SHALL hiển thị cột "Hình ảnh" với thumbnail sản phẩm để dễ nhận diện

2.3 WHEN admin truy cập trang orders THEN bảng đơn hàng SHALL hiển thị hình ảnh sản phẩm trong cột "Sản phẩm" hoặc cột riêng

2.4 WHEN sản phẩm có URL hình ảnh hợp lệ THEN hệ thống SHALL render thẻ <img> với src từ product.image

2.5 WHEN sản phẩm không có URL hình ảnh hoặc URL không hợp lệ THEN hệ thống SHALL hiển thị placeholder icon (🖼️ hoặc ảnh mặc định)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN admin xem các cột khác trong bảng (ID, Tên, Giá, Tồn kho, v.v.) THEN hệ thống SHALL CONTINUE TO hiển thị đúng dữ liệu như hiện tại

3.2 WHEN admin thực hiện các thao tác chỉnh sửa, xóa sản phẩm THEN các chức năng này SHALL CONTINUE TO hoạt động bình thường

3.3 WHEN admin nhập URL hình ảnh trong form thêm/sửa sản phẩm THEN dữ liệu SHALL CONTINUE TO được lưu vào localStorage/database

3.4 WHEN bảng có nhiều cột và cần scroll ngang THEN responsive layout với table-container SHALL CONTINUE TO hoạt động đúng

3.5 WHEN admin truy cập từ mobile/tablet THEN layout responsive hiện tại SHALL CONTINUE TO duy trì, chỉ thêm cột ảnh với kích thước phù hợp

3.6 WHEN trang inventory hiển thị cảnh báo sản phẩm sắp hết hàng THEN chức năng này SHALL CONTINUE TO hoạt động như cũ

3.7 WHEN trang dashboard hiển thị biểu đồ và thống kê THEN các chart SHALL CONTINUE TO render đúng

