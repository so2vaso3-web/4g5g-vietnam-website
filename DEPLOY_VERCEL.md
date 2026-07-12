# 🚀 Hướng Dẫn Deploy Website Lên Vercel

## Cách 1: Deploy Từ Vercel Dashboard (Khuyên Dùng)

### Bước 1: Push Code Lên GitHub/GitLab/Bitbucket

```bash
# Nếu chưa có git repo
git init
git add .
git commit -m "Initial commit - Vietnam Network Website"

# Tạo repo mới trên GitHub và push
git remote add origin https://github.com/username/vietnam-network-website.git
git branch -M main
git push -u origin main
```

### Bước 2: Import Project Vào Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Chọn repository **"vietnam-network-website"** từ danh sách
4. Click **"Import"**

### Bước 3: Cấu Hình Project

#### Framework Preset:
- **Framework Preset**: Next.js (tự động detect)

#### Environment Variables:
Thêm các biến môi trường sau:

```
MASTER_KEY=your-master-key-here
```

**Lưu ý**: 
- Tạo MASTER_KEY bằng lệnh: `npm run generate-key`
- Hoặc tạo random string dài ít nhất 32 ký tự

#### Build Settings:
- **Build Command**: `npm run build` (mặc định)
- **Output Directory**: `.next` (mặc định)
- **Install Command**: `npm install` (mặc định)

### Bước 4: Thêm Redis Database (Upstash)

1. Trong Vercel Dashboard, vào **Storage** tab
2. Click **"Create Database"**
3. Chọn **"Upstash Redis"**
4. Chọn plan (Free tier có sẵn)
5. Tạo database và copy connection string

#### Thêm Redis Environment Variables:
```
KV_URL=your-redis-url
KV_REST_API_URL=your-redis-rest-url
KV_REST_API_TOKEN=your-redis-token
KV_REST_API_READ_ONLY_TOKEN=your-redis-readonly-token
```

### Bước 5: Deploy!

1. Click **"Deploy"**
2. Đợi build hoàn tất (thường 2-5 phút)
3. Website sẽ có URL dạng: `vietnam-network-website.vercel.app`

---

## Cách 2: Deploy Bằng Vercel CLI

### Bước 1: Cài Đặt Vercel CLI

```bash
npm i -g vercel
```

### Bước 2: Login Vercel

```bash
vercel login
```

### Bước 3: Deploy

```bash
cd d:\vietnam-network-website
vercel
```

Làm theo hướng dẫn:
- **Set up and deploy?** → Y
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → N (tạo project mới)
- **Project name?** → `vietnam-network-website` (hoặc tên bạn muốn)
- **Directory?** → `./` (mặc định)

### Bước 4: Thêm Environment Variables

```bash
vercel env add MASTER_KEY
# Nhập giá trị MASTER_KEY khi được hỏi
```

### Bước 5: Deploy Production

```bash
vercel --prod
```

---

## Cách 3: Deploy Như Subdomain/Path Của Project Hiện Có

Nếu bạn muốn deploy như một subdomain của project hiện có:

### Option A: Deploy Như Subdomain

1. Trong Vercel Dashboard, vào project hiện có
2. Vào **Settings** → **Domains**
3. Thêm domain mới: `vietnam-network.yourdomain.com`
4. Deploy project này và point domain về nó

### Option B: Deploy Như Monorepo

1. Tạo folder mới trong project hiện có
2. Copy code vào folder đó
3. Cấu hình `vercel.json` để route đúng

---

## ⚙️ Cấu Hình Sau Khi Deploy

### 1. Cấu Hình Domain (Nếu Có)

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Cập nhật DNS records theo hướng dẫn

### 2. Kiểm Tra Environment Variables

Đảm bảo các biến sau đã được set:
- ✅ `MASTER_KEY`
- ✅ `KV_URL` (nếu dùng Redis)
- ✅ `KV_REST_API_URL`
- ✅ `KV_REST_API_TOKEN`

### 3. Test Website

1. Truy cập URL Vercel: `https://your-project.vercel.app`
2. Test các chức năng:
   - Trang chủ
   - Admin panel: `/admin`
   - Thanh toán
   - Chat widget

---

## 🔧 Troubleshooting

### Lỗi Build Failed

**Nguyên nhân**: Thiếu dependencies hoặc lỗi TypeScript

**Giải pháp**:
```bash
# Test build local trước
npm run build

# Nếu lỗi, sửa và commit lại
git add .
git commit -m "Fix build errors"
git push
```

### Lỗi Environment Variables

**Nguyên nhân**: Chưa set MASTER_KEY

**Giải pháp**:
1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm `MASTER_KEY` với giá trị đã tạo
3. Redeploy

### Lỗi Redis Connection

**Nguyên nhân**: Chưa tạo Redis database hoặc thiếu env vars

**Giải pháp**:
1. Tạo Upstash Redis trong Vercel Storage
2. Copy các env vars và thêm vào project
3. Redeploy

---

## 📝 Checklist Trước Khi Deploy

- [ ] Code đã được test local (`npm run dev`)
- [ ] Build thành công (`npm run build`)
- [ ] Đã tạo MASTER_KEY
- [ ] Đã push code lên Git
- [ ] Đã tạo Redis database (nếu cần)
- [ ] Đã set tất cả environment variables
- [ ] Đã test các chức năng chính

---

## 🎉 Sau Khi Deploy Thành Công

1. **Truy cập Admin Panel**: `https://your-project.vercel.app/admin`
2. **Đăng nhập** với MASTER_KEY đã tạo
3. **Cấu hình Settings**:
   - Thông tin website
   - Payment methods (MoMo, ZaloPay, Bank)
   - Telegram bot (nếu có)
   - Upload logos và QR codes
4. **Test thanh toán** với đơn hàng thử

---

## 💡 Tips

- **Auto Deploy**: Mỗi khi push code lên Git, Vercel sẽ tự động deploy
- **Preview Deployments**: Mỗi PR sẽ có preview URL riêng
- **Analytics**: Bật Vercel Analytics để theo dõi traffic
- **Backup**: Export dữ liệu thường xuyên từ Admin Panel

---

Chúc bạn deploy thành công! 🚀








