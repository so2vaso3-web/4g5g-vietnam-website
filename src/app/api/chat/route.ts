import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'chatMessages';

interface Message {
  id: string;
  visitorId: string;
  name?: string;
  email?: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  read: boolean;
}

export async function GET() {
  try {
    let messages = storage.get(STORAGE_KEY);
    
    if (messages instanceof Promise) {
      messages = await messages;
    }
    
    // Nếu không có messages trong storage và có KV, thử load từ KV
    if ((!messages || !Array.isArray(messages) || messages.length === 0) && 
        process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = require('@vercel/kv');
        const kvMessages = await kv.get(STORAGE_KEY);
        if (kvMessages && Array.isArray(kvMessages) && kvMessages.length > 0) {
          messages = kvMessages;
          // Sync lại vào storage
          storage.set(STORAGE_KEY, messages);
        }
      } catch (e) {
        console.error('Error loading chat messages from KV:', e);
        // Không throw error, tiếp tục với messages rỗng
      }
    }
    
    // Đảm bảo luôn trả về array hợp lệ
    const validMessages = Array.isArray(messages) ? messages : [];
    
    return NextResponse.json({ 
      success: true, 
      messages: validMessages,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error in GET /api/chat:', error);
    // Trả về empty array thay vì error để client không bị crash
    return NextResponse.json({ 
      success: true, 
      messages: [],
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, id, adminReply } = body;

    // Nếu có messages array, thay thế toàn bộ
    if (Array.isArray(messages)) {
      // Validate messages trước khi save - Cho phép cả tin nhắn admin (có thể không có email/name)
      const validMessages = messages.filter((m: Message) => {
        if (!m || !m.id || !m.visitorId || !m.message || !m.timestamp || typeof m.isAdmin === 'undefined') {
          console.warn('Invalid message filtered out:', m);
          return false;
        }
        return true;
      });
      
      console.log(`Saving ${validMessages.length} messages (${messages.length} total, ${messages.length - validMessages.length} filtered)`);
      
      // Save vào storage TRƯỚC (sync, đảm bảo luôn thành công)
      try {
        storage.set(STORAGE_KEY, validMessages);
        console.log('Messages saved to storage successfully');
      } catch (storageError) {
        console.error('Error saving to storage:', storageError);
        return NextResponse.json(
          { success: false, error: 'Failed to save to storage', details: String(storageError) },
          { status: 500 }
        );
      }
      
      // Save vào KV nếu có (async, không block response - nhưng log lỗi nếu có)
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        (async () => {
          try {
            const { kv } = require('@vercel/kv');
            await kv.set(STORAGE_KEY, validMessages);
            console.log('Chat messages saved to Vercel KV successfully');
          } catch (kvError) {
            console.error('Error saving chat messages to KV (non-blocking):', kvError);
            // Không throw, chỉ log error - storage đã lưu thành công rồi
          }
        })();
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Chat messages saved successfully',
        count: validMessages.length,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      });
    }

    // Nếu có id và adminReply, cập nhật message
    if (id && adminReply) {
      const allMessages = storage.get(STORAGE_KEY) || [];
      const updatedMessages = allMessages.map((m: Message) => 
        m.id === id ? { ...m, adminReply, read: true } : m
      );
      storage.set(STORAGE_KEY, updatedMessages);
      
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          const { kv } = require('@vercel/kv');
          await kv.set(STORAGE_KEY, updatedMessages);
        } catch (e) {
          console.error('Error saving chat messages to KV:', e);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Reply saved successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save chat messages' },
      { status: 500 }
    );
  }
}
