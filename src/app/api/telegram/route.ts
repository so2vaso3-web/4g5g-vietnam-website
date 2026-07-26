import { NextRequest, NextResponse } from 'next/server';
import { readSettingsFromKV } from '@/lib/settings-storage';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

async function getTelegramSettings(): Promise<{ botToken: string; chatId: string } | null> {
  try {
    let settings = await readSettingsFromKV(true);

    if (!settings || typeof settings !== 'object') {
      console.log('[telegram] settings not found in KV');
      return null;
    }

    const rawToken = settings.telegramBotToken;
    const rawChatId = settings.telegramChatId;
    const hasToken = !!rawToken;
    const hasChatId = !!rawChatId;

    if (!hasToken || !hasChatId) {
      console.warn('[telegram] Missing settings:', { hasToken, hasChatId });
      return null;
    }

    let botToken = String(rawToken).trim();
    let chatId = String(rawChatId).trim();

    // Auto-fallback: token still encrypted (stale KV from old key) -> return as-is
    // and let sendToTelegram fail with a clear error so we know what to fix.
    if (botToken.startsWith('encrypted:')) {
      console.error(
        '[telegram] Bot token returned by readSettingsFromKV is still encrypted. ' +
          'This usually means MASTER_KEY changed since the token was saved. ' +
          'Re-save the bot token in Admin Settings to re-encrypt with the current key.',
      );
    }

    if (!botToken.includes(':')) {
      console.error('[telegram] Invalid bot token format (should contain colon):', botToken.length);
      return null;
    }

    if (!chatId.match(/^-?\d+$/)) {
      console.error('[telegram] Invalid chat ID format (should be numeric):', chatId.length);
      return null;
    }

    return { botToken, chatId };
  } catch (error) {
    console.error('[telegram] Error reading Telegram settings:', error);
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
      console.error('[telegram] Missing credentials:', {
        hasToken: !!botToken,
        hasChatId: !!chatId,
      });
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

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok || !data.ok) {
      console.error('[telegram] API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.description || data.error_code || 'Unknown error',
        chatId: chatIdNum,
      });
      return false;
    }

    console.log('[telegram] sent OK to chat', chatIdNum);
    return true;
  } catch (error) {
    console.error('[telegram] send error:', error);
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
          error: 'Telegram not configured. Please configure Telegram Bot Token and Chat ID in Admin Settings.',
          debug: {
            hasToken: false,
            hasChatId: false,
            tokenLength: 0,
            chatId: null,
            tokenStillEncrypted: null,
          },
        },
        { status: 400 }
      );
    }

    const tokenStillEncrypted = telegramSettings.botToken.startsWith('encrypted:');

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
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message to Telegram. Check: 1) Bot token is correct, 2) Chat ID is correct, 3) Bot has been started (send /start to bot), 4) Bot has permission to send messages to this chat.',
        debug: {
          hasToken: !!telegramSettings.botToken,
          hasChatId: !!telegramSettings.chatId,
          tokenLength: telegramSettings.botToken.length,
          chatId: telegramSettings.chatId,
          tokenStillEncrypted,
          hint: tokenStillEncrypted
            ? 'Token returned by KV is still encrypted. MASTER_KEY may have changed since the token was saved. Re-save the bot token in Admin Settings.'
            : 'Token format looks OK. Verify with @BotFather and re-send /start to the bot.',
        },
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('[telegram] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
