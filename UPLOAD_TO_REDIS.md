# Hướng Dẫn Upload Dữ Liệu và Logo lên Redis

## Cách 1: Upload qua Admin Panel (Khuyến nghị)

1. **Truy cập Admin Panel:**
   - Mở website: `https://your-project.vercel.app/admin`
   - Đăng nhập với username và password

2. **Upload Logo Website:**
   - Vào tab **"Cài Đặt"** (Settings)
   - Tìm phần **"Thông Tin Website"**
   - Click **"Chọn file"** trong phần **"Logo Website"**
   - Chọn file logo từ máy tính (file: `C:\Users\so2va\Downloads\51deff58-7eda-440d-8f61-d9ac98f93c13.jpg`)
   - Logo sẽ tự động được convert sang base64 và lưu
   - Click **"Lưu Cài Đặt"** để lưu logo

3. **Dữ liệu tự động sync:**
   - Khi bạn lưu cài đặt trong Admin Panel, dữ liệu sẽ tự động được lưu vào Redis (Upstash KV)
   - Không cần làm gì thêm!

## Cách 2: Upload bằng Script (Nâng cao)

Nếu bạn muốn upload dữ liệu từ máy local lên Redis:

1. **Set biến môi trường:**
   ```bash
   export KV_REST_API_URL="your-redis-url"
   export KV_REST_API_TOKEN="your-redis-token"
   ```

2. **Chạy script:**
   ```bash
   npm run upload-to-redis
   ```

   Script sẽ:
   - Đọc logo từ `logo-base64.txt` (nếu có)
   - Upload tất cả dữ liệu từ localStorage lên Redis
   - Thêm logo vào adminSettings

## Lưu ý

- Logo đã được convert sang base64 và lưu trong file `logo-base64.txt`
- Kích thước logo: ~70KB
- Logo sẽ được hiển thị trên header của website sau khi upload
- Dữ liệu sẽ tự động sync giữa localStorage và Redis khi bạn sử dụng Admin Panel








