'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  visitorId: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  read: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [visitorId, setVisitorId] = useState<string>('');
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const userScrolledUpRef = useRef(false);
  const prevMessagesCountRef = useRef(0);
  const lastMessagesRef = useRef<Message[]>([]); // Lưu messages cuối cùng để so sánh

  // Get or create visitor ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('visitorId');
      if (!id) {
        id = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitorId', id);
      }
      setVisitorId(id);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!visitorId) return;
    
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      // Relative URL hoạt động tốt trên cả localhost và production server với Next.js
      // Chỉ thêm timestamp khi cần thiết để giảm cache miss
      const response = await fetch(`/api/chat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        cache: 'no-store',
      });

      let allMessages: Message[] = [];
      let serverMessages: Message[] = [];
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.messages)) {
          serverMessages = data.messages;
        }
      }

      // SERVER LÀ SOURCE OF TRUTH - ĐẢM BẢO TIN NHẮN ADMIN LUÔN HIỂN THỊ
      const messageMap = new Map<string, Message>();
      
      // BƯỚC 1: Thêm tin nhắn từ localStorage (chỉ tin nhắn của khách, không phải admin)
      if (typeof window !== 'undefined') {
        const localMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const visitorLocalMessages = localMessages.filter((m: Message) => m.visitorId === visitorId);
        visitorLocalMessages.forEach((msg: Message) => {
          const isAdmin = msg.isAdmin === true || (typeof msg.isAdmin === 'string' && msg.isAdmin === 'true') || (typeof msg.isAdmin === 'number' && msg.isAdmin === 1);
          // CHỈ thêm tin nhắn của khách từ local (KHÔNG thêm admin từ local)
          if (!isAdmin) {
            messageMap.set(msg.id, { ...msg, isAdmin: false });
          }
        });
      }
      
      // BƯỚC 2: Thêm TẤT CẢ tin nhắn từ server (ƯU TIÊN - GHI ĐÈ - bao gồm cả ADMIN và khách)
      // QUAN TRỌNG: Phải lấy TẤT CẢ tin nhắn có visitorId khớp, bao gồm cả tin nhắn ADMIN
      serverMessages.forEach((msg: Message) => {
        // Kiểm tra visitorId khớp (cả tin nhắn của khách và admin đều có cùng visitorId)
        if (msg.visitorId && msg.visitorId === visitorId) {
          const isAdmin = msg.isAdmin === true || (typeof msg.isAdmin === 'string' && msg.isAdmin === 'true') || (typeof msg.isAdmin === 'number' && msg.isAdmin === 1);
          // Server messages LUÔN được ưu tiên và ghi đè (bao gồm cả tin nhắn ADMIN)
          messageMap.set(msg.id, { ...msg, isAdmin });
        }
      });
      
      // Sắp xếp theo thời gian
      allMessages = Array.from(messageMap.values()).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Đảm bảo messages luôn được set - KHÔNG BỎ QUA BẤT KỲ TIN NHẮN NÀO
      // So sánh chính xác để chỉ update khi thực sự có thay đổi về nội dung (không phải read status)
      const lastMessageIds = new Set(lastMessagesRef.current.map(m => m.id));
      const currentMessageIds = new Set(allMessages.map(m => m.id));
      
      // LUÔN UPDATE lần đầu (khi chưa có messages)
      const isFirstLoad = lastMessagesRef.current.length === 0;
      
      // Kiểm tra tin nhắn mới (ID mới) hoặc tin nhắn bị xóa (ID cũ không còn)
      const hasNewMessageIds = allMessages.some(msg => !lastMessageIds.has(msg.id));
      const hasRemovedMessageIds = lastMessagesRef.current.some(msg => !currentMessageIds.has(msg.id));
      
      // Kiểm tra nội dung tin nhắn có thay đổi không (chỉ so sánh message, không so read status)
      const hasChangedContent = allMessages.some(msg => {
        const lastMsg = lastMessagesRef.current.find(m => m.id === msg.id);
        return lastMsg && lastMsg.message !== msg.message;
      });
      
      // UPDATE KHI: lần đầu load, có tin nhắn mới, có tin nhắn bị xóa, hoặc nội dung thay đổi
      // KHÔNG UPDATE khi chỉ có read status thay đổi (tránh flickering)
      if (isFirstLoad || hasNewMessageIds || hasRemovedMessageIds || hasChangedContent || lastMessagesRef.current.length !== allMessages.length) {
        prevMessagesCountRef.current = allMessages.length;
        lastMessagesRef.current = allMessages.map(m => ({ ...m })); // Deep copy
        setMessages(allMessages.map(m => ({ ...m }))); // Deep copy để React nhận diện thay đổi
        
        // Đánh dấu read status và cập nhật lên server CHỈ KHI CÓ TIN NHẮN MỚI hoặc lần đầu load
        if (isFirstLoad || hasNewMessageIds) {
          const messagesWithReadStatus = allMessages.map(msg => {
            if (msg.isAdmin && !msg.read) {
              return { ...msg, read: true };
            }
            return msg;
          });
          
          // Cập nhật read status lên server (async, không block)
          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messagesWithReadStatus }),
          }).catch(err => console.error('Error updating read status:', err));
        }
      }
      
      // TẮT HOÀN TOÀN AUTO-SCROLL - Không tự động cuộn khi có tin nhắn mới
      shouldAutoScrollRef.current = false;
      
      // Check for welcome message
      const hasWelcome = allMessages.some(m => 
        m.isAdmin && (m.message?.includes('Chào mừng') || m.message?.includes('Xin chào'))
      );
      setHasWelcomeMessage(hasWelcome);
      
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId && isOpen) {
      loadMessages();
      // CHỈ POLL KHI CHAT ĐANG MỞ - 3s để nhận tin nhắn admin nhanh hơn
      const interval = setInterval(() => {
        if (isOpen && !isMinimized) {
          loadMessages();
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [visitorId, loadMessages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !hasWelcomeMessage && visitorId) {
      const welcomeMsg: Message = {
        id: `welcome-${visitorId}`,
        visitorId,
        name: 'CMSNT LTD',
        email: '',
        message: 'Chào mừng bạn ghé thăm website. Hãy gửi cho chúng tôi bất kỳ câu hỏi nào của bạn. Thanks for getting in touch with us. Please send us any questions you may have!',
        timestamp: new Date().toISOString(),
        isAdmin: true,
        read: false,
      };
      
      const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      if (!allMessages.find((m: Message) => m.id === welcomeMsg.id)) {
        allMessages.push(welcomeMsg);
        localStorage.setItem('chatMessages', JSON.stringify(allMessages));
        setMessages([welcomeMsg]);
        setHasWelcomeMessage(true);
      }
    }
  }, [isOpen, hasWelcomeMessage, visitorId]);

  // Check if user is near bottom of messages
  const checkIfNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // Consider "near bottom" if within 50px (very strict)
    return distanceFromBottom < 50;
  };

  // TẮT HOÀN TOÀN - Không cần theo dõi scroll nữa vì đã tắt auto-scroll

  // TẮT HOÀN TOÀN AUTO-SCROLL - Chỉ scroll khi user tự gửi tin nhắn
  // useEffect này đã bị tắt để không tự động cuộn khi có tin nhắn mới

  const handleSendMessage = async () => {
    if (!message.trim() || !visitorId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      visitorId,
      name: 'Bạn',
      email: '',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isAdmin: false,
      read: false,
    };

    // Save to localStorage
    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));
    
    setMessages([...messages, newMessage]);
    setMessage('');
    // User sent a message, always scroll to bottom
    shouldAutoScrollRef.current = true;
    userScrolledUpRef.current = false;
    // Force scroll to bottom when user sends message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    // Send to server - Lưu tin nhắn vào database để admin có thể xem
    // Sử dụng Promise.allSettled để đảm bảo cả 2 requests đều được thực hiện, không block nhau
    Promise.allSettled([
      // Request 1: Lưu tin nhắn lên server
      (async () => {
        try {
          // Lấy tất cả tin nhắn hiện tại từ server với retry
          let response;
          let retries = 3;
          while (retries > 0) {
            try {
              response = await fetch('/api/chat', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache',
                },
                cache: 'no-store',
              });
              if (response.ok) break;
            } catch (e) {
              retries--;
              if (retries > 0) await new Promise(resolve => setTimeout(resolve, 200));
              else throw e;
            }
          }
          
          if (!response || !response.ok) {
            console.error('Failed to fetch messages from server');
            return;
          }
          
          const data = await response.json();
          const existingMessages = data.success && Array.isArray(data.messages) ? data.messages : [];
          
          // Merge: Tránh duplicate bằng cách check ID
          const messageIds = new Set(existingMessages.map((m: Message) => m.id));
          if (!messageIds.has(newMessage.id)) {
            const updatedMessages = [...existingMessages, newMessage];
            
            // Lưu lên server với retry
            retries = 3;
            while (retries > 0) {
              try {
                const saveResponse = await fetch('/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messages: updatedMessages,
                  }),
                });
                if (saveResponse.ok) break;
              } catch (e) {
                retries--;
                if (retries > 0) await new Promise(resolve => setTimeout(resolve, 200));
                else throw e;
              }
            }
          }
        } catch (error) {
          console.error('Error saving message to server:', error);
        }
      })(),
      
      // Request 2: Gửi thông báo Telegram (không block)
      fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Khách hàng',
          email: '',
          message: newMessage.message,
          visitorId,
          isReply: false,
        }),
      }).catch(error => {
        console.error('Error sending Telegram notification:', error);
      })
    ]);

    // Reload messages after a short delay để nhận tin nhắn từ admin
    setTimeout(() => {
      loadMessages();
    }, 300);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'chiều' : 'sáng';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-gradient-to-r from-red-600 to-blue-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
        style={{ borderRadius: '50%' }}
        aria-label="Mở chat"
      >
        <i className="fas fa-comments text-xl text-white"></i>
        
        {(() => {
          if (typeof window !== 'undefined' && visitorId) {
            const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            const unreadAdminMessages = allMessages.filter((m: Message) => 
              m.visitorId === visitorId && 
              m.isAdmin && 
              !m.read &&
              !m.id?.startsWith('welcome-') &&
              !m.message?.includes('Chào mừng')
            );
            if (unreadAdminMessages.length > 0) {
              return (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white animate-pulse">
                  {unreadAdminMessages.length}
                </span>
              );
            }
          }
          return null;
        })()}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="chat-widget-modal fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-xl border-2 border-slate-600 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden bg-slate-800"
          style={{
            width: isMinimized ? '320px' : '320px',
            height: isMinimized ? 'auto' : '500px',
            backgroundColor: '#1e293b',
            background: '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            opacity: 1,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          } as React.CSSProperties}
        >
          {/* Header - Always visible */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-xl p-3 flex items-center justify-between text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-white/80 w-8 h-8 flex items-center justify-center transition-colors"
              >
                <i className={`fas ${isMinimized ? 'fa-chevron-up' : 'fa-minus'} text-sm`}></i>
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <i className="fas fa-headset text-white"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Hỗ trợ trò chuyện trực tiếp</h3>
                <p className="text-xs text-white/90 leading-tight">Chúng tôi ở đây để giúp bạn!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 hover:text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Đóng chat"
              title="Đóng chat"
            >
              <i className="fas fa-times text-base font-bold"></i>
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-slate-800" style={{ backgroundColor: '#1e293b', background: '#1e293b', minHeight: 0, maxHeight: '400px' }}>
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-xs">Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isAdminMsg = msg.isAdmin === true;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdminMsg ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className="flex flex-col max-w-[80%]">
                            <div
                              className={`rounded-lg p-2 shadow-md ${
                                isAdminMsg
                                  ? 'bg-gray-700'
                                  : ''
                              }`}
                              style={
                                !isAdminMsg
                                  ? {
                                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                                      color: '#ffffff',
                                    }
                                  : {
                                      backgroundColor: '#374151',
                                      color: '#ffffff',
                                    }
                              }
                            >
                              <p className="text-xs whitespace-pre-wrap break-words leading-relaxed" style={{ color: '#ffffff' }}>
                                {msg.message}
                              </p>
                            </div>
                            <span className={`text-[10px] text-gray-400 mt-0.5 ${isAdminMsg ? 'text-left' : 'text-right'}`}>
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area - Luôn hiển thị ở cuối */}
              <div className="p-2.5 border-t flex-shrink-0 bg-slate-800" style={{ backgroundColor: '#1e293b', background: '#1e293b', borderColor: '#374151' }}>
                <div className="flex items-center gap-2 flex-nowrap">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn của bạn..."
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border-0"
                    style={{ backgroundColor: '#334155', color: '#ffffff', borderColor: '#9333ea' }}
                  />
                  <button 
                    className="text-gray-400 hover:text-white w-9 h-9 min-w-[36px] flex items-center justify-center transition-colors flex-shrink-0"
                    title="Emoji"
                  >
                    <i className="fas fa-smile text-sm"></i>
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`w-9 h-9 min-w-[36px] flex items-center justify-center rounded-lg transition-colors flex-shrink-0 ${
                      message.trim()
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600'
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Gửi tin nhắn"
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

