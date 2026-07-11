# 🚀 Hướng Dẫn Deploy Lên Vercel Và Cấu Hình Redis

## 📋 Bước 1: Chuẩn Bị Code Trên Git

### 1.1. Kiểm tra code đã commit và push chưa:
```bash
git status
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2. Đảm bảo các file quan trọng đã có:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `tsconfig.json`
- ✅ `.gitignore` (đã có `data/` và `.env*.local`)

---

## 📦 Bước 2: Deploy Lên Vercel

### 2.1. Tạo Project Trên Vercel

**Cách 1: Qua Vercel Dashboard (Khuyên dùng)**
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub/GitLab/Bitbucket
3. Click **"Add New Project"**
4. Chọn repository `us-network-website`
5. Vercel sẽ tự động detect Next.js
6. Click **"Deploy"**

**Cách 2: Qua Vercel CLI**
```bash
npm i -g vercel
cd C:\Users\so2va\us-network-website
vercel login
vercel
```

### 2.2. Cấu Hình Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (mặc định)
- **Build Command:** `npm run build` (tự động)
- **Output Directory:** `.next` (tự động)
- **Install Command:** `npm install` (tự động)

---

## 🔴 Bước 3: Cấu Hình Redis Trên Vercel

### 3.1. Tạo Redis Database

1. Vào Vercel Dashboard → Project của bạn
2. Vào tab **"Storage"** hoặc **"Integrations"**
3. Click **"Create Database"** hoặc **"Add Integration"**
4. Chọn **"Redis"** hoặc **"Upstash Redis"** (khuyên dùng Upstash)
5. Đặt tên database (ví dụ: `us-network-redis`)
6. Chọn region gần nhất (ví dụ: `us-east-1`)
7. Click **"Create"**

### 3.2. Lấy Redis Credentials

Sau khi tạo Redis, Vercel sẽ tự động tạo các biến môi trường:
- `KV_REST_API_URL` - URL của Redis REST API
- `KV_REST_API_TOKEN` - Token để authenticate
- `REDIS_URL` - Redis connection string (nếu dùng Redis thông thường)

**Lưu ý:** Vercel sẽ tự động inject các biến này vào project, không cần set thủ công.

---

## 🔐 Bước 4: Cấu Hình Environment Variables

### 4.1. Vào Project Settings → Environment Variables

Trong Vercel Dashboard:
1. Vào **Project Settings** → **Environment Variables**
2. Thêm các biến sau (nếu chưa có):

#### Biến Bắt Buộc:
```
KV_REST_API_URL = (tự động từ Redis integration)
KV_REST_API_TOKEN = (tự động từ Redis integration)
REDIS_URL = (tự động từ Redis integration, nếu có)
```

#### Biến Tùy Chọn (cho production):
```
NODE_ENV = production
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
```

### 4.2. Set Environment Variables Cho Tất Cả Environments
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🔑 Bước 5: Cấu Hình Master Key (Cho Encryption)

### 5.1. Tạo Master Key
```bash
# Tạo random key (32 ký tự)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 5.2. Thêm Vào Environment Variables
Trong Vercel Dashboard → Environment Variables:
```
MASTER_KEY = (paste key vừa tạo)
```

**⚠️ QUAN TRỌNG:** 
- Master Key này dùng để encrypt/decrypt sensitive data
- **KHÔNG BAO GIỜ** commit key này vào Git
- Giữ key này an toàn, nếu mất sẽ không decrypt được data cũ

---

## 🧪 Bước 6: Test Sau Khi Deploy

### 6.1. Kiểm Tra Build
1. Vào Vercel Dashboard → **Deployments**
2. Xem log build có thành công không
3. Nếu lỗi, xem chi tiết trong log

### 6.2. Test Website
1. Truy cập URL: `https://your-project.vercel.app`
2. Kiểm tra website load được không
3. Test các chức năng:
   - ✅ Admin login
   - ✅ Settings management
   - ✅ Telegram bot (sau khi config)
   - ✅ Payment (PayPal, FPayment)

### 6.3. Test Redis Connection
1. Vào Admin Settings
2. Lưu một setting bất kỳ
3. Refresh trang, kiểm tra setting còn không
4. Nếu còn → Redis hoạt động ✅

---

## 📝 Bước 7: Cấu Hình Domain (Tùy Chọn)

### 7.1. Thêm Custom Domain
1. Vào **Project Settings** → **Domains**
2. Thêm domain của bạn (ví dụ: `zenith5g.com`)
3. Follow hướng dẫn để config DNS

### 7.2. SSL Certificate
- Vercel tự động cung cấp SSL certificate
- Không cần config thêm

---

## 🔄 Bước 8: Auto-Deploy Từ Git

### 8.1. Cấu Hình Git Integration
- Vercel tự động deploy khi push code lên `main` branch
- Mỗi pull request sẽ tạo preview deployment

### 8.2. Workflow
```bash
# 1. Code locally
git add .
git commit -m "Update feature"
git push origin main

# 2. Vercel tự động deploy
# 3. Nhận notification khi deploy xong
```

---

## 🐛 Troubleshooting

### Lỗi: "KV_REST_API_URL is not defined"
**Giải pháp:**
1. Kiểm tra Redis integration đã được add chưa
2. Vào Project Settings → Environment Variables
3. Đảm bảo `KV_REST_API_URL` và `KV_REST_API_TOKEN` đã có

### Lỗi: "Cannot connect to Redis"
**Giải pháp:**
1. Kiểm tra Redis database đã được tạo chưa
2. Kiểm tra region của Redis có đúng không
3. Thử tạo lại Redis database

### Lỗi: "Build failed"
**Giải pháp:**
1. Xem log chi tiết trong Vercel Dashboard
2. Kiểm tra `package.json` có đúng dependencies không
3. Kiểm tra TypeScript errors: `npm run build` locally

### Lỗi: "Settings not saving"
**Giải pháp:**
1. Kiểm tra Redis connection
2. Kiểm tra `MASTER_KEY` đã được set chưa
3. Xem console log trong Vercel Functions logs

---

## 📊 Monitoring & Logs

### Xem Logs
1. Vào Vercel Dashboard → **Deployments**
2. Click vào deployment mới nhất
3. Xem **Function Logs** để debug

### Xem Analytics
1. Vào **Analytics** tab
2. Xem traffic, performance metrics

---

## ✅ Checklist Trước Khi Deploy

- [ ] Code đã push lên Git
- [ ] `package.json` có đầy đủ dependencies
- [ ] `.gitignore` đã ignore sensitive files
- [ ] Redis database đã được tạo
- [ ] Environment variables đã được set
- [ ] `MASTER_KEY` đã được tạo và set
- [ ] Build thành công locally: `npm run build`
- [ ] Test locally: `npm run dev`

---

## 🎉 Sau Khi Deploy Thành Công

1. **Cấu hình Admin Settings:**
   - Vào Admin Panel
   - Cấu hình Telegram Bot
   - Cấu hình PayPal
   - Cấu hình FPayment

2. **Test tất cả chức năng:**
   - ✅ Order flow
   - ✅ Payment (PayPal, FPayment)
   - ✅ Telegram notifications
   - ✅ Chat widget

3. **Monitor:**
   - Xem logs thường xuyên
   - Kiểm tra Redis usage
   - Monitor performance

---

## 📞 Support

Nếu gặp vấn đề:
1. Xem logs trong Vercel Dashboard
2. Kiểm tra Vercel Documentation: https://vercel.com/docs
3. Kiểm tra Redis/Upstash Documentation

---

**Chúc bạn deploy thành công! 🚀**



















