import { NextRequest, NextResponse } from 'next/server';
import { readSettingsFromKV, saveSettingsToKV } from '@/lib/settings-storage';
import { encryptSettings } from '@/lib/encryption';

/**
 * POST /api/admin/reset - Reset admin credentials
 * Body: { username: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Đọc settings hiện tại
    let settings = await readSettingsFromKV(true) || {};
    
    // Cập nhật admin credentials
    settings.adminUsername = username;
    settings.adminPassword = password;

    // Lưu lại (đã encrypt)
    await saveSettingsToKV(settings, encryptSettings);

    return NextResponse.json({
      success: true,
      message: 'Admin credentials đã được đặt lại thành công',
    });
  } catch (error: any) {
    console.error('Error resetting admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset admin credentials' },
      { status: 500 }
    );
  }
}











