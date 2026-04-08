# Requirements Document

## Introduction

Tính năng Dashboard Time Filter cho phép admin lọc dữ liệu biểu đồ theo các khoảng thời gian khác nhau (tuần, tháng, năm) thay vì chỉ hiển thị dữ liệu cố định 7 ngày gần đây. Tất cả biểu đồ trên dashboard sẽ được cập nhật đồng bộ khi admin thay đổi bộ lọc thời gian.

## Glossary

- **Dashboard**: Trang tổng quan hiển thị các biểu đồ và thống kê cho admin
- **Time_Filter**: Bộ lọc thời gian cho phép chọn khoảng thời gian hiển thị dữ liệu
- **Chart**: Biểu đồ hiển thị dữ liệu (line chart, pie chart, bar chart)
- **Revenue_Chart**: Biểu đồ doanh thu theo thời gian (line chart)
- **Order_Status_Chart**: Biểu đồ trạng thái đơn hàng (pie chart)
- **Top_Products_Chart**: Biểu đồ top sản phẩm bán chạy (bar chart)
- **New_Users_Chart**: Biểu đồ người dùng mới (line chart)
- **Time_Period**: Khoảng thời gian được chọn (week, month, year)
- **LocalStorage**: Nơi lưu trữ dữ liệu orders và users

## Requirements

### Requirement 1: Time Filter UI Component

**User Story:** Là admin, tôi muốn có bộ lọc thời gian trên dashboard, để tôi có thể chọn khoảng thời gian xem dữ liệu biểu đồ.

#### Acceptance Criteria

1. THE Dashboard SHALL hiển thị Time_Filter component phía trên các biểu đồ
2. THE Time_Filter SHALL cung cấp 3 tùy chọn: "Tuần (7 ngày)", "Tháng (30 ngày)", "Năm (12 tháng)"
3. THE Time_Filter SHALL hiển thị tùy chọn "Tuần (7 ngày)" là mặc định khi tải trang
4. THE Time_Filter SHALL cho phép admin chọn một trong ba tùy chọn thời gian
5. WHEN admin chọn một Time_Period, THE Time_Filter SHALL hiển thị trạng thái active cho tùy chọn đó

### Requirement 2: Revenue Chart Time Filtering

**User Story:** Là admin, tôi muốn biểu đồ doanh thu cập nhật theo khoảng thời gian đã chọn, để tôi có thể phân tích xu hướng doanh thu trong các khoảng thời gian khác nhau.

#### Acceptance Criteria

1. WHEN Time_Period là "Tuần", THE Revenue_Chart SHALL hiển thị doanh thu của 7 ngày gần nhất
2. WHEN Time_Period là "Tháng", THE Revenue_Chart SHALL hiển thị doanh thu của 30 ngày gần nhất
3. WHEN Time_Period là "Năm", THE Revenue_Chart SHALL hiển thị doanh thu tổng hợp theo 12 tháng gần nhất
4. THE Revenue_Chart SHALL tính doanh thu từ orders trong LocalStorage với status khác "Đã hủy"
5. THE Revenue_Chart SHALL cập nhật ngay lập tức khi admin thay đổi Time_Period

### Requirement 3: Order Status Chart Time Filtering

**User Story:** Là admin, tôi muốn biểu đồ trạng thái đơn hàng cập nhật theo khoảng thời gian đã chọn, để tôi có thể theo dõi phân bố trạng thái đơn hàng trong từng khoảng thời gian.

#### Acceptance Criteria

1. WHEN Time_Period là "Tuần", THE Order_Status_Chart SHALL hiển thị phân bố trạng thái của orders trong 7 ngày gần nhất
2. WHEN Time_Period là "Tháng", THE Order_Status_Chart SHALL hiển thị phân bố trạng thái của orders trong 30 ngày gần nhất
3. WHEN Time_Period là "Năm", THE Order_Status_Chart SHALL hiển thị phân bố trạng thái của orders trong 12 tháng gần nhất
4. THE Order_Status_Chart SHALL lọc orders từ LocalStorage dựa trên createdAt timestamp
5. THE Order_Status_Chart SHALL cập nhật ngay lập tức khi admin thay đổi Time_Period

### Requirement 4: Top Products Chart Time Filtering

**User Story:** Là admin, tôi muốn biểu đồ top sản phẩm bán chạy cập nhật theo khoảng thời gian đã chọn, để tôi có thể xác định sản phẩm bán chạy trong từng khoảng thời gian cụ thể.

#### Acceptance Criteria

1. WHEN Time_Period là "Tuần", THE Top_Products_Chart SHALL hiển thị top 5 sản phẩm có nhiều đơn hàng nhất trong 7 ngày gần nhất
2. WHEN Time_Period là "Tháng", THE Top_Products_Chart SHALL hiển thị top 5 sản phẩm có nhiều đơn hàng nhất trong 30 ngày gần nhất
3. WHEN Time_Period là "Năm", THE Top_Products_Chart SHALL hiển thị top 5 sản phẩm có nhiều đơn hàng nhất trong 12 tháng gần nhất
4. THE Top_Products_Chart SHALL đếm số lượng sản phẩm từ orders trong LocalStorage trong khoảng thời gian đã chọn
5. THE Top_Products_Chart SHALL cập nhật ngay lập tức khi admin thay đổi Time_Period

### Requirement 5: New Users Chart Time Filtering

**User Story:** Là admin, tôi muốn biểu đồ người dùng mới cập nhật theo khoảng thời gian đã chọn, để tôi có thể theo dõi tăng trưởng người dùng trong các khoảng thời gian khác nhau.

#### Acceptance Criteria

1. WHEN Time_Period là "Tuần", THE New_Users_Chart SHALL hiển thị số người dùng mới theo từng ngày trong 7 ngày gần nhất
2. WHEN Time_Period là "Tháng", THE New_Users_Chart SHALL hiển thị số người dùng mới theo từng ngày trong 30 ngày gần nhất
3. WHEN Time_Period là "Năm", THE New_Users_Chart SHALL hiển thị số người dùng mới theo từng tháng trong 12 tháng gần nhất
4. THE New_Users_Chart SHALL đếm users từ LocalStorage dựa trên createdAt timestamp
5. THE New_Users_Chart SHALL cập nhật ngay lập tức khi admin thay đổi Time_Period

### Requirement 6: Data Filtering Logic

**User Story:** Là admin, tôi muốn dữ liệu được lọc chính xác theo khoảng thời gian, để tôi có thể tin tưởng vào tính chính xác của các biểu đồ.

#### Acceptance Criteria

1. THE Dashboard SHALL tính toán ngày bắt đầu dựa trên Time_Period đã chọn (7, 30, hoặc 365 ngày trước)
2. THE Dashboard SHALL lọc orders và users có createdAt timestamp nằm trong khoảng thời gian đã chọn
3. WHEN không có dữ liệu trong khoảng thời gian đã chọn, THE Chart SHALL hiển thị biểu đồ trống với giá trị 0
4. THE Dashboard SHALL sử dụng múi giờ local của trình duyệt để so sánh thời gian
5. THE Dashboard SHALL xử lý chính xác các trường hợp chuyển tháng và chuyển năm

### Requirement 7: Chart Synchronization

**User Story:** Là admin, tôi muốn tất cả biểu đồ cập nhật đồng bộ khi tôi thay đổi bộ lọc thời gian, để tôi có cái nhìn nhất quán về dữ liệu.

#### Acceptance Criteria

1. WHEN admin thay đổi Time_Period, THE Dashboard SHALL cập nhật tất cả 4 biểu đồ cùng lúc
2. THE Dashboard SHALL duy trì Time_Period đã chọn khi admin tương tác với các biểu đồ (hover, click)
3. THE Dashboard SHALL không reload trang khi thay đổi Time_Period
4. THE Dashboard SHALL sử dụng Chart.js destroy và reinitialize để cập nhật biểu đồ
5. WHEN cập nhật biểu đồ, THE Dashboard SHALL giữ nguyên cấu hình màu sắc và style của biểu đồ

### Requirement 8: Performance and User Experience

**User Story:** Là admin, tôi muốn việc chuyển đổi giữa các khoảng thời gian diễn ra mượt mà, để tôi có trải nghiệm sử dụng tốt.

#### Acceptance Criteria

1. THE Dashboard SHALL cập nhật tất cả biểu đồ trong vòng 500ms sau khi admin thay đổi Time_Period
2. THE Dashboard SHALL không hiển thị lỗi console khi chuyển đổi Time_Period
3. THE Dashboard SHALL duy trì responsive layout của Time_Filter trên mobile và desktop
4. THE Dashboard SHALL hiển thị Time_Filter với style nhất quán với giao diện admin hiện tại
5. WHEN dữ liệu lớn (>1000 records), THE Dashboard SHALL vẫn cập nhật biểu đồ mượt mà
