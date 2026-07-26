# 📦 Hướng Dẫn Push Code Lên GitHub

## Bước 1: Tạo Repository Mới Trên GitHub

1. Đăng nhập vào [github.com](https://github.com)
2. Click nút **"+"** ở góc trên phải → Chọn **"New repository"**
3. Điền thông tin:
   - **Repository name**: `vietnam-network-website`
   - **Description**: "Vietnam Network Website - Next.js with Payment Integration"
   - **Visibility**: 
     - ✅ **Private** (khuyên dùng - code không public)
     - Hoặc Public (nếu muốn open source)
   - ❌ **KHÔNG** tích "Add a README file" (vì đã có code)
   - ❌ **KHÔNG** tích "Add .gitignore" (đã có sẵn)
   - ❌ **KHÔNG** tích "Choose a license"
4. Click **"Create repository"**

## Bước 2: Copy URL Repository

Sau khi tạo xong, GitHub sẽ hiển thị URL dạng:
```
https://github.com/username/vietnam-network-website.git
```

**Copy URL này lại!**

## Bước 3: Chạy Lệnh Trong Terminal

Mở PowerShell hoặc Command Prompt tại thư mục `d:\vietnam-network-website` và chạy:

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit - Vietnam Network Website"

# Thêm remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/vietnam-network-website.git

# Đổi tên branch thành main
git branch -M main

# Push code lên GitHub
git push -u origin main
```

## Bước 4: Xác Thực (Nếu Cần)

- Nếu GitHub yêu cầu đăng nhập, nhập username/password
- Hoặc dùng Personal Access Token (khuyên dùng)

### Tạo Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Chọn quyền: `repo` (full control)
4. Copy token và dùng thay password khi push

## ✅ Kiểm Tra

Sau khi push thành công:
1. Refresh trang GitHub repository
2. Bạn sẽ thấy tất cả code đã được upload
3. URL: `https://github.com/username/vietnam-network-website`

## 🚀 Tiếp Theo: Deploy Lên Vercel

Sau khi code đã trên GitHub:
1. Vào [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Chọn repository `vietnam-network-website`
4. Deploy!

---

## 💡 Tips

- **Lần đầu push**: Có thể mất vài phút nếu code nhiều
- **Lần sau**: Chỉ cần `git add .`, `git commit -m "message"`, `git push`
- **Kiểm tra**: Luôn kiểm tra `.gitignore` để không push file nhạy cảm (.env, node_modules, etc.)








