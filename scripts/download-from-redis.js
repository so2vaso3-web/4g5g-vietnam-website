/**
 * Script để download dữ liệu từ Redis (Upstash KV) về localStorage
 * Chạy script này để restore dữ liệu từ Redis về local
 */

const fs = require('fs');
const path = require('path');

async function downloadFromRedis() {
  try {
    // Kiểm tra biến môi trường
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('❌ Missing KV_REST_API_URL or KV_REST_API_TOKEN');
      console.log('💡 Set environment variables first:');
      console.log('   export KV_REST_API_URL="..."');
      console.log('   export KV_REST_API_TOKEN="..."');
      console.log('\n💡 Hoặc tạo file .env.local với:');
      console.log('   KV_REST_API_URL=...');
      console.log('   KV_REST_API_TOKEN=...');
      process.exit(1);
    }

    const { kv } = require('@vercel/kv');
    console.log('✅ Connected to Redis');

    // Download dữ liệu từ Redis
    const keys = ['orders', 'packages', 'adminSettings', 'websiteContent', 'chatMessages', 'visitorStats', 'uniqueVisitors'];
    const data = {};

    for (const key of keys) {
      try {
        const value = await kv.get(key);
        if (value !== null && value !== undefined) {
          data[key] = value;
          console.log(`✅ Downloaded ${key}`);
        } else {
          console.log(`⚠️  ${key} is empty or not found`);
        }
      } catch (e) {
        console.error(`❌ Error downloading ${key}:`, e.message);
      }
    }

    // Tạo file backup localStorage
    const backupPath = path.join(__dirname, '..', 'localStorage-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n✅ Backup saved to: ${backupPath}`);

    // Tạo file HTML để import vào localStorage
    const htmlPath = path.join(__dirname, '..', 'restore-localStorage.html');
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Restore LocalStorage from Redis</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff; }
    .container { max-width: 800px; margin: 0 auto; }
    .section { background: #2a2a2a; padding: 20px; margin: 10px 0; border-radius: 8px; }
    button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
    button:hover { background: #45a049; }
    .success { color: #4CAF50; }
    .error { color: #f44336; }
    pre { background: #1a1a1a; padding: 10px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Restore LocalStorage from Redis Backup</h1>
    <div class="section">
      <h2>Instructions:</h2>
      <ol>
        <li>Click "Restore All Data" button below</li>
        <li>Check the console for any errors</li>
        <li>Refresh your website (F5)</li>
        <li>Go to Admin Panel to verify data</li>
      </ol>
    </div>
    <div class="section">
      <button onclick="restoreAll()">Restore All Data</button>
      <button onclick="clearAll()">Clear All LocalStorage</button>
      <button onclick="showData()">Show Current Data</button>
    </div>
    <div id="result" class="section"></div>
  </div>

  <script>
    const backupData = ${JSON.stringify(data, null, 2)};

    function restoreAll() {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<h3>Restoring data...</h3>';
      
      try {
        let restored = 0;
        let errors = 0;

        for (const [key, value] of Object.entries(backupData)) {
          try {
            if (value !== null && value !== undefined) {
              localStorage.setItem(key, JSON.stringify(value));
              restored++;
              console.log('✅ Restored:', key);
            }
          } catch (e) {
            errors++;
            console.error('❌ Error restoring', key, ':', e);
          }
        }

        resultDiv.innerHTML = \`
          <h3 class="success">✅ Restore Complete!</h3>
          <p>Restored: \${restored} items</p>
          <p>Errors: \${errors} items</p>
          <p><strong>Please refresh the page (F5) to see the changes.</strong></p>
        \`;
      } catch (e) {
        resultDiv.innerHTML = \`<h3 class="error">❌ Error: \${e.message}</h3>\`;
      }
    }

    function clearAll() {
      if (confirm('Are you sure you want to clear ALL localStorage data?')) {
        localStorage.clear();
        document.getElementById('result').innerHTML = '<h3 class="success">✅ LocalStorage cleared!</h3>';
      }
    }

    function showData() {
      const resultDiv = document.getElementById('result');
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
      resultDiv.innerHTML = \`
        <h3>Current LocalStorage Data:</h3>
        <pre>\${JSON.stringify(data, null, 2)}</pre>
      \`;
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
    console.log(`✅ HTML restore file created: ${htmlPath}`);
    console.log(`\n📝 To restore data:`);
    console.log(`   1. Open ${htmlPath} in your browser`);
    console.log(`   2. Click "Restore All Data" button`);
    console.log(`   3. Refresh your website`);

    console.log('\n🎉 Download completed!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Chạy script
downloadFromRedis();

