# Hướng dẫn thiết lập Google Sheets & Apps Script cho RSVP

Để tính năng RSVP hoạt động, bạn cần tạo một Web App trên Google Apps Script để kết nối với Google Sheets. Hãy làm theo các bước sau:

## 1. Tạo Google Sheets
1. Truy cập [Google Sheets](https://sheets.new) và tạo một bảng tính mới.
2. Đặt tên bảng tính (ví dụ: `Danh sách RSVP Lễ Tốt Nghiệp`).
3. Đổi tên sheet hiện tại ở dưới cùng (mặc định là "Trang tính 1" hoặc "Sheet1") thành `RSVP`.
4. Ở dòng 1 (dòng tiêu đề), nhập các tên cột sau:
   - A1: `Timestamp`
   - B1: `Token`
   - C1: `Tên khách`
   - D1: `Trạng thái`
   - E1: `IP`

## 2. Tạo Apps Script
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Đổi tên dự án ở góc trên bên trái (ví dụ: `RSVP_Backend`).
3. Xóa nội dung trong file `Code.gs` và dán toàn bộ đoạn code dưới đây vào:

```javascript
const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();
    const token = data.token;
    const name = data.name;
    const status = data.status; // 'Tham dự' hoặc 'Không tham dự'
    const ip = "N/A"; // Không lấy được IP trực tiếp từ Apps Script một cách dễ dàng
    
    // Tìm kiếm xem token/name đã tồn tại chưa (để update nếu họ đổi ý)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < values.length; i++) {
      // Ưu tiên tìm theo token (nếu có), không thì tìm theo tên
      if ((token && values[i][1] === token) || (!token && values[i][2] === name)) {
        rowIndex = i + 1; // getValues() là 0-indexed, rows trong sheet là 1-indexed
        break;
      }
    }
    
    if (rowIndex > -1) {
      // Cập nhật record hiện tại
      sheet.getRange(rowIndex, 1).setValue(timestamp);
      sheet.getRange(rowIndex, 3).setValue(name);
      sheet.getRange(rowIndex, 4).setValue(status);
    } else {
      // Thêm record mới
      sheet.appendRow([timestamp, token, name, status, ip]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success' }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const results = [];
    // Bắt đầu từ 1 để bỏ qua header
    for (let i = 1; i < values.length; i++) {
      results.push({
        timestamp: values[i][0],
        token: values[i][1],
        name: values[i][2],
        status: values[i][3]
      });
    }
    
    // Nếu gọi doGet để validate (ví dụ: ?action=check&token=...)
    if (e.parameter.action === 'check' && e.parameter.token) {
      const found = results.find(r => r.token === e.parameter.token);
      return ContentService.createTextOutput(JSON.stringify({
        'exists': !!found,
        'data': found || null
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success', 'data': results }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý CORS (Preflight request)
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}
```

## 3. Triển khai (Deploy)
1. Nhấn nút **Lưu** (biểu tượng đĩa mềm) hoặc bấm `Ctrl + S` / `Cmd + S`.
2. Ở góc trên bên phải, bấm vào nút **Triển khai (Deploy)** > **Triển khai mới (New deployment)**.
3. Bấm vào biểu tượng bánh răng (⚙️) kế bên "Chọn loại (Select type)" và chọn **Ứng dụng web (Web app)**.
4. Cấu hình:
   - Mô tả: `Phiên bản 1` (hoặc gì cũng được)
   - Chạy dưới tư cách: **Tôi (Me)**
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)** *(RẤT QUAN TRỌNG)*
5. Bấm **Triển khai (Deploy)**.
6. Khi có popup yêu cầu cấp quyền (Authorize access), hãy:
   - Chọn tài khoản Google của bạn.
   - Trình duyệt có thể hiện cảnh báo "Google hasn't verified this app" (Google chưa xác minh ứng dụng này) > Nhấn **Nâng cao (Advanced)** > **Đi tới ... (không an toàn) / Go to ... (unsafe)**.
   - Nhấn **Cho phép (Allow)**.
7. Đợi một chút, bạn sẽ nhận được một **URL Ứng dụng web (Web app URL)** bắt đầu bằng `https://script.google.com/macros/s/.../exec`.
8. **Copy URL này**.

## 4. Cập nhật vào mã nguồn React
Mở file `src/App.jsx`, tìm phần `CONFIG` và thêm `GOOGLE_SCRIPT_URL` với giá trị bạn vừa copy:

```javascript
const CONFIG = {
  // ... các config hiện có
  GOOGLE_SCRIPT_URL: "DÁN_URL_CỦA_BẠN_VÀO_ĐÂY",
};
```
*(Nếu bạn chưa có, tính năng RSVP sẽ báo lỗi khi gửi)*
