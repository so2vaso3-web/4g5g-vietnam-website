import { NextRequest, NextResponse } from 'next/server';
import { readSettingsFromKV, saveSettingsToKV } from '@/lib/settings-storage';
import { encryptSettings } from '@/lib/encryption';

export async function GET() {
  try {
    const settings = await readSettingsFromKV(true);
    if (settings && typeof settings === 'object') {
      return NextResponse.json({ success: true, settings });
    }
    return NextResponse.json({ success: true, settings: null });
  } catch (error: any) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings: newSettings } = body;

    if (!newSettings) {
      return NextResponse.json(
        { success: false, error: 'Settings are required' },
        { status: 400 }
      );
    }

    // Đọc settings hiện tại từ KV để merge
    let currentSettings = await readSettingsFromKV(true);
    
    // Merge settings mới vào settings cũ
    const mergedSettings = {
      ...currentSettings,
      ...newSettings,
    };

    // Xử lý đặc biệt cho password: nếu password mới là empty hoặc không có, giữ nguyên password cũ
    if (!newSettings.adminPassword || newSettings.adminPassword.trim() === '') {
      if (currentSettings && currentSettings.adminPassword) {
        mergedSettings.adminPassword = currentSettings.adminPassword;
        console.log('⚠️ Password empty, keeping old password');
      } else {
        // Nếu không có password cũ, dùng default
        mergedSettings.adminPassword = '123123aA@';
        console.log('⚠️ No old password found, using default password');
      }
    } else {
      console.log('✅ Password changed');
    }

    // Tương tự cho username: nếu empty, giữ nguyên username cũ
    if (!newSettings.adminUsername || newSettings.adminUsername.trim() === '') {
      if (currentSettings && currentSettings.adminUsername) {
        mergedSettings.adminUsername = currentSettings.adminUsername;
      } else {
        mergedSettings.adminUsername = 'admin';
      }
    }

    await saveSettingsToKV(mergedSettings, encryptSettings);
    console.log('✅ Settings saved to Redis/KV successfully');

    return NextResponse.json({ success: true, message: 'Settings saved to Redis/KV' });
  } catch (error: any) {
    console.error('Error saving settings to Redis/KV:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
