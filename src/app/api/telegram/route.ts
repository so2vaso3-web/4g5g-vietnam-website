import { NextRequest, NextResponse } from 'next/server';
import { readSettingsFromKV } from '@/lib/settings-storage';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

async function getTelegramSettings(): Promise<{ botToken: string; chatId: string } | null> {
  try {
    let settings = await readSettingsFromKV(true);
    
    if (!settings || typeof settings !== 'object' || !settings.telegramBotToken || !settings.telegramChatId) {
      console.log('KV/Redis settings not found or incomplete, trying file system fallback...');
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const possiblePaths = [
          path.join(process.cwd(), 'data', 'settings.json'),
          path.join(process.cwd(), 'data', 'adminSettings.json'),
        ];
        
        for (const settingsPath of possiblePaths) {
          try {
            const fileContent = await fs.readFile(settingsPath, 'utf-8');
            const fileSettings = JSON.parse(fileContent);
            if (fileSettings && typeof fileSettings === 'object') {
              settings = fileSettings;
              console.log(`Loaded settings from file system: ${settingsPath}`);
              break;
            }
          } catch (fileError) {
            continue;
          }
        }
      } catch (fileError) {
        console.log('File system fallback failed:', fileError);
      }
    }
    
    if (settings && typeof settings === 'object') {
      const hasToken = !!settings.telegramBotToken;
      const hasChatId = !!settings.telegramChatId;
      if (hasToken && hasChatId) {
        const botToken = String(settings.telegramBotToken).trim();
        const chatId = String(settings.telegramChatId).trim();
        
        if (!botToken.includes(':')) {
          console.error('Invalid bot token format (should contain colon)');
          return null;
        }
        
        if (!chatId.match(/^-?\d+$/)) {
          console.error('Invalid chat ID format (should be numeric)');
          return null;
        }
        
        return {
          botToken,
          chatId,
        };
      } else {
        console.warn('Telegram settings missing:', { hasToken, hasChatId });
      }
    }
  } catch (error) {
    console.error('Error reading Telegram settings:', error);
  }
  return null;
}

async function sendToTelegram(
  botToken: string,
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials:', { hasToken: !!botToken, hasChatId: !!chatId });
      return false;
    }

    const trimmedToken = botToken.trim();
    const trimmedChatId = chatId.trim();
    const chatIdNum = isNaN(Number(trimmedChatId)) ? trimmedChatId : Number(trimmedChatId);
    
    const url = `${TELEGRAM_API_URL}${trimmedToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatIdNum,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    
    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.description || data.error_code || 'Unknown error',
      });
      return false;
    }
    
    console.log('Telegram message sent successfully to chat:', chatIdNum);
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message: messageText, visitorId, isReply } = body;

    if (!messageText) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const telegramSettings = await getTelegramSettings();

    if (!telegramSettings) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Telegram not configured. Please configure Telegram Bot Token and Chat ID in Admin Settings.' 
        },
        { status: 400 }
      );
    }

    let telegramMessage: string;
    
    if (isReply) {
      telegramMessage = `
✅ <b>Admin Reply Sent</b>

👤 <b>To:</b> ${name || 'Unknown'}
📧 <b>Email:</b> ${email || 'Not provided'}
🆔 <b>Visitor ID:</b> ${visitorId || 'Unknown'}

💬 <b>Reply:</b>
${messageText}

⏰ <b>Time:</b> ${new Date().toLocaleString('vi-VN')}
      `.trim();
    } else {
      telegramMessage = `
🔔 <b>New Chat Message</b>

👤 <b>Name:</b> ${name || 'Anonymous'}
📧 <b>Email:</b> ${email || 'Not provided'}
🆔 <b>Visitor ID:</b> ${visitorId || 'Unknown'}

💬 <b>Message:</b>
${messageText}

⏰ <b>Time:</b> ${new Date().toLocaleString('vi-VN')}
      `.trim();
    }

    const success = await sendToTelegram(
      telegramSettings.botToken,
      telegramSettings.chatId,
      telegramMessage
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Message sent to Telegram successfully',
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send message to Telegram. Please check: 1) Bot token is correct, 2) Chat ID is correct, 3) Bot has been started (send /start to bot), 4) Bot has permission to send messages to this chat.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/telegram:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
