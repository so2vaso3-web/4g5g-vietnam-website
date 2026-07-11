import { NextRequest, NextResponse } from 'next/server';
import { readSettingsFromKV } from '@/lib/settings-storage';
import { decryptSettings } from '@/lib/encryption';
import fs from 'fs';
import path from 'path';

async function readSettingsFromFile(): Promise<any> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const settingsFile = path.join(dataDir, 'settings.json');
    
    if (fs.existsSync(settingsFile)) {
      const content = fs.readFileSync(settingsFile, 'utf-8');
      const settings = JSON.parse(content);
      
      // Kiểm tra xem adminUsername có phải plain text không
      if (settings.adminUsername && typeof settings.adminUsername === 'string') {
        // Nếu không bắt đầu bằng 'encrypted:', là plain text
        if (!settings.adminUsername.startsWith('encrypted:')) {
          return settings;
        }
      }
      
      // Nếu là encrypted, thử decrypt
      try {
        return decryptSettings(settings);
      } catch (e) {
        // Nếu decrypt fail, trả về null để dùng default
        return null;
      }
    }
  } catch (e) {
    console.error('Error reading settings from file:', e);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Đọc từ KV trước, nếu không có thì đọc từ file
    let settings = await readSettingsFromKV(true);
    
    // Nếu không có trong KV, thử đọc từ file
    if (!settings || !settings.adminUsername) {
      const fileSettings = await readSettingsFromFile();
      if (fileSettings && fileSettings.adminUsername) {
        settings = fileSettings;
      }
    }
    
    // Nếu vẫn không có, dùng default
    if (!settings || !settings.adminUsername) {
      settings = {
        adminUsername: 'admin',
        adminPassword: 'admin123'
      };
    }
    
    // Simple authentication check
    if (
      settings.adminUsername === username &&
      settings.adminPassword === password
    ) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

