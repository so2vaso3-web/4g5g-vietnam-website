/**
 * Script để upload dữ liệu từ localStorage lên Redis (Upstash KV)
 * Chạy script này sau khi đã set biến môi trường KV_*
 */

const fs = require('fs');
const path = require('path');

// Đọc logo base64
let logoBase64 = '';
try {
  const logoPath = path.join(__dirname, '..', 'logo-base64.txt');
  if (fs.existsSync(logoPath)) {
    logoBase64 = fs.readFileSync(logoPath, 'utf-8').trim();
    console.log('✅ Logo loaded');
  }
} catch (e) {
  console.log('⚠️ Logo not found, skipping...');
}

// Load dữ liệu từ localStorage (nếu có file backup)
const dataDir = path.join(__dirname, '..', 'data');
const localStorageBackup = path.join(__dirname, '..', 'localStorage-backup.json');

async function uploadToRedis() {
  try {
    // Kiểm tra biến môi trường
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('❌ Missing KV_REST_API_URL or KV_REST_API_TOKEN');
      console.log('💡 Set environment variables first:');
      console.log('   export KV_REST_API_URL="..."');
      console.log('   export KV_REST_API_TOKEN="..."');
      process.exit(1);
    }

    const { kv } = require('@vercel/kv');
    console.log('✅ Connected to Redis');

    // Đọc dữ liệu từ file backup hoặc data directory
    let data = {};
    
    // Thử đọc từ localStorage backup
    if (fs.existsSync(localStorageBackup)) {
      console.log('📂 Reading from localStorage backup...');
      const backupData = JSON.parse(fs.readFileSync(localStorageBackup, 'utf-8'));
      data = backupData;
    } else {
      // Thử đọc từ data directory
      console.log('📂 Reading from data directory...');
      const files = ['orders.json', 'packages.json', 'adminSettings.json', 'websiteContent.json', 'chatMessages.json'];
      for (const file of files) {
        const filePath = path.join(dataDir, file);
        if (fs.existsSync(filePath)) {
          const key = file.replace('.json', '');
          data[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          console.log(`  ✅ Loaded ${key}`);
        }
      }
    }

    // Upload dữ liệu
    const keys = ['orders', 'packages', 'adminSettings', 'websiteContent', 'chatMessages', 'visitorStats', 'uniqueVisitors'];
    
    for (const key of keys) {
      if (data[key] !== undefined) {
        try {
          await kv.set(key, data[key]);
          console.log(`✅ Uploaded ${key}`);
        } catch (e) {
          console.error(`❌ Error uploading ${key}:`, e.message);
        }
      } else {
        // Initialize với giá trị mặc định
        if (key === 'orders' || key === 'packages' || key === 'chatMessages' || key === 'visitorStats' || key === 'uniqueVisitors') {
          await kv.set(key, []);
          console.log(`✅ Initialized ${key} as empty array`);
        } else if (key === 'adminSettings') {
          const defaultSettings = {
            websiteName: 'Mạng Việt Nam',
            defaultLanguage: 'vi',
            autoApproveOrders: false,
            emailNotifications: false,
            ordersPerPage: 10,
            facebook: 'https://www.facebook.com/HOTRODATA/',
            carrierLogos: {},
            paymentLogos: {},
            paymentQRCodes: {},
          };
          // Thêm logo nếu có
          if (logoBase64) {
            defaultSettings.websiteLogo = logoBase64;
            console.log('  ✅ Added website logo');
          }
          await kv.set(key, defaultSettings);
          console.log(`✅ Initialized ${key} with defaults`);
        } else if (key === 'websiteContent') {
          await kv.set(key, {});
          console.log(`✅ Initialized ${key} as empty object`);
        }
      }
    }

    // Nếu có logo và chưa có trong adminSettings, thêm vào
    if (logoBase64) {
      try {
        const settings = await kv.get('adminSettings') || {};
        if (!settings.websiteLogo) {
          settings.websiteLogo = logoBase64;
          await kv.set('adminSettings', settings);
          console.log('✅ Added logo to adminSettings');
        }
      } catch (e) {
        console.error('❌ Error adding logo:', e.message);
      }
    }

    console.log('\n🎉 Upload completed!');
    console.log('💡 Check your website to verify data is loaded');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Chạy script
uploadToRedis();








