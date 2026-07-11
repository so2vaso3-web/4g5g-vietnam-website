/**
 * Script để đặt lại tài khoản admin
 * Chạy: node scripts/reset-admin.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Đường dẫn đến file settings
const dataDir = path.join(process.cwd(), 'data');
const settingsFile = path.join(dataDir, 'settings.json');

// Admin mặc định
const defaultAdmin = {
  adminUsername: 'admin',
  adminPassword: 'admin123'
};

// Tạo thư mục data nếu chưa có
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Đọc settings hiện tại (nếu có)
let settings = {};
if (fs.existsSync(settingsFile)) {
  try {
    const content = fs.readFileSync(settingsFile, 'utf-8');
    settings = JSON.parse(content);
  } catch (e) {
    console.error('Error reading settings:', e);
  }
}

// Cập nhật admin credentials (không encrypt vì đây là script reset)
settings.adminUsername = defaultAdmin.adminUsername;
settings.adminPassword = defaultAdmin.adminPassword;

// Lưu lại (plain text cho script này, sẽ được encrypt khi load qua API)
fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');

console.log('✅ Đã đặt lại tài khoản admin thành công!');
console.log('📝 Thông tin đăng nhập:');
console.log(`   Username: ${defaultAdmin.adminUsername}`);
console.log(`   Password: ${defaultAdmin.adminPassword}`);
console.log('\n⚠️  Lưu ý: Hãy đổi mật khẩu sau khi đăng nhập!');
console.log(`\n📁 File settings: ${settingsFile}`);

