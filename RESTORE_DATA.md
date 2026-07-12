# Hướng Dẫn Khôi Phục Dữ Liệu Từ Redis

## Vấn đề:
Dữ liệu (ngân hàng, ảnh, settings) đã được lưu trên Redis (Vercel) nhưng chưa sync về localStorage của trình duyệt local.

## Cách 1: Restore từ Redis về LocalStorage (Khuyến nghị)

### Bước 1: Lấy thông tin Redis từ Vercel
1. Vào Vercel Dashboard: https://vercel.com
2. Chọn project của bạn
3. Vào tab **"Storage"** → Click vào Redis database
4. Copy các thông tin:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Bước 2: Tạo file `.env.local`
Tạo file `.env.local` trong thư mục gốc của project:
```
KV_REST_API_URL=your-redis-url-here
KV_REST_API_TOKEN=your-redis-token-here
```

### Bước 3: Chạy script download
```bash
npm run download-from-redis
```

Script sẽ:
- Download tất cả dữ liệu từ Redis
- Tạo file `localStorage-backup.json`
- Tạo file `restore-localStorage.html`

### Bước 4: Restore vào trình duyệt
1. Mở file `restore-localStorage.html` trong trình duyệt
2. Click nút **"Restore All Data"**
3. Refresh website (F5)
4. Vào Admin Panel để kiểm tra

## Cách 2: Restore thủ công từ Vercel

1. Vào Admin Panel trên Vercel: `https://your-project.vercel.app/admin`
2. Vào tab **"Cài Đặt"**
3. Tất cả dữ liệu (ngân hàng, ảnh) đã được lưu ở đó
4. Chỉ cần mở lại và kiểm tra

## Cách 3: Kiểm tra localStorage hiện tại

Mở Console trong trình duyệt (F12) và chạy:
```javascript
// Xem tất cả dữ liệu
console.log('adminSettings:', localStorage.getItem('adminSettings'));
console.log('packages:', localStorage.getItem('packages'));
console.log('orders:', localStorage.getItem('orders'));

// Nếu dữ liệu null, cần restore từ Redis
```

## Lưu ý:
- Dữ liệu trên Vercel (Redis) là persistent, không bị mất
- Dữ liệu localStorage chỉ tồn tại trong trình duyệt hiện tại
- Mỗi khi chạy localhost:3000 mới, cần restore lại nếu muốn có dữ liệu

