'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Minus, ChevronUp, Send, Smile, Headphones } from 'lucide-react';

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
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const userScrolledUpRef = useRef(false);
  const prevMessagesCountRef = useRef(0);
  const lastMessagesRef = useRef<Message[]>([]);

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

    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
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

      const messageMap = new Map<string, Message>();

      if (typeof window !== 'undefined') {
        const localMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const visitorLocalMessages = localMessages.filter((m: Message) => m.visitorId === visitorId);
        visitorLocalMessages.forEach((msg: Message) => {
          const isAdmin =
            msg.isAdmin === true ||
            (typeof msg.isAdmin === 'string' && msg.isAdmin === 'true') ||
            (typeof msg.isAdmin === 'number' && msg.isAdmin === 1);
          if (!isAdmin) {
            messageMap.set(msg.id, { ...msg, isAdmin: false });
          }
        });
      }

      serverMessages.forEach((msg: Message) => {
        if (msg.visitorId && msg.visitorId === visitorId) {
          const isAdmin =
            msg.isAdmin === true ||
            (typeof msg.isAdmin === 'string' && msg.isAdmin === 'true') ||
            (typeof msg.isAdmin === 'number' && msg.isAdmin === 1);
          messageMap.set(msg.id, { ...msg, isAdmin });
        }
      });

      allMessages = Array.from(messageMap.values()).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      const lastMessageIds = new Set(lastMessagesRef.current.map((m) => m.id));
      const currentMessageIds = new Set(allMessages.map((m) => m.id));

      const isFirstLoad = lastMessagesRef.current.length === 0;

      const hasNewMessageIds = allMessages.some((msg) => !lastMessageIds.has(msg.id));
      const hasRemovedMessageIds = lastMessagesRef.current.some(
        (msg) => !currentMessageIds.has(msg.id),
      );

      const hasChangedContent = allMessages.some((msg) => {
        const lastMsg = lastMessagesRef.current.find((m) => m.id === msg.id);
        return lastMsg && lastMsg.message !== msg.message;
      });

      if (
        isFirstLoad ||
        hasNewMessageIds ||
        hasRemovedMessageIds ||
        hasChangedContent ||
        lastMessagesRef.current.length !== allMessages.length
      ) {
        prevMessagesCountRef.current = allMessages.length;
        lastMessagesRef.current = allMessages.map((m) => ({ ...m }));
        setMessages(allMessages.map((m) => ({ ...m })));

        if (isFirstLoad || hasNewMessageIds) {
          const messagesWithReadStatus = allMessages.map((msg) => {
            if (msg.isAdmin && !msg.read) {
              return { ...msg, read: true };
            }
            return msg;
          });

          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messagesWithReadStatus }),
          }).catch((err) => console.error('Error updating read status:', err));
        }
      }

      shouldAutoScrollRef.current = false;

      const hasWelcome = allMessages.some(
        (m) => m.isAdmin && (m.message?.includes('Chào mừng') || m.message?.includes('Xin chào')),
      );
      setHasWelcomeMessage(hasWelcome);

      // Update unread badge (exclude welcome)
      if (!isFirstLoad) {
        const unread = allMessages.filter(
          (m) =>
            m.isAdmin &&
            !m.read &&
            !m.id?.startsWith('welcome-') &&
            !m.message?.includes('Chào mừng'),
        ).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId && isOpen) {
      loadMessages();
      const interval = setInterval(() => {
        if (isOpen && !isMinimized) loadMessages();
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
        message:
          'Chào mừng bạn ghé thăm website. Hãy gửi cho chúng tôi bất kỳ câu hỏi nào của bạn. Thanks for getting in touch with us. Please send us any questions you may have!',
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

  // Watch for unread (when chat closed)
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      return;
    }
    if (typeof window === 'undefined' || !visitorId) return;
    const compute = () => {
      const all = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      const unread = all.filter(
        (m: Message) =>
          m.visitorId === visitorId &&
          m.isAdmin &&
          !m.read &&
          !m.id?.startsWith('welcome-') &&
          !m.message?.includes('Chào mừng'),
      ).length;
      setUnreadCount(unread);
    };
    compute();
    const id = setInterval(compute, 3000);
    return () => clearInterval(id);
  }, [isOpen, visitorId]);

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

    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));

    setMessages([...messages, newMessage]);
    setMessage('');
    shouldAutoScrollRef.current = true;
    userScrolledUpRef.current = false;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    Promise.allSettled([
      (async () => {
        try {
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
              if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 200));
              else throw e;
            }
          }

          if (!response || !response.ok) {
            console.error('Failed to fetch messages from server');
            return;
          }

          const data = await response.json();
          const existingMessages =
            data.success && Array.isArray(data.messages) ? data.messages : [];

          const messageIds = new Set(existingMessages.map((m: Message) => m.id));
          if (!messageIds.has(newMessage.id)) {
            const updatedMessages = [...existingMessages, newMessage];

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
                if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 200));
                else throw e;
              }
            }
          }
        } catch (error) {
          console.error('Error saving message to server:', error);
        }
      })(),

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
      }).catch((error) => {
        console.error('Error sending Telegram notification:', error);
      }),
    ]);

    setTimeout(() => {
      loadMessages();
    }, 300);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'chiều' : 'sáng';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Mở chat"
          className="group fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-10px_rgba(37,99,235,0.7)] sm:bottom-6 sm:right-6"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-90" />
          <MessageCircle className="relative h-6 w-6" strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-lg ring-2 ring-bg-base">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="chat-widget-modal fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated shadow-card sm:bottom-6 sm:right-6"
          style={{
            height: isMinimized ? 'auto' : 'min(560px, calc(100vh - 6rem))',
            maxHeight: 'calc(100vh - 4rem)',
          }}
        >
          {/* Header */}
          <div className="relative flex flex-shrink-0 items-center justify-between gap-2 border-b border-border bg-gradient-brand px-4 py-3 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]"
            />
            <div className="relative flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                aria-label={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? (
                  <ChevronUp className="h-4 w-4" strokeWidth={2.2} />
                ) : (
                  <Minus className="h-4 w-4" strokeWidth={2.2} />
                )}
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25">
                <Headphones className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold leading-tight">
                  Hỗ trợ trò chuyện trực tiếp
                </h3>
                <p className="truncate text-xs text-white/85 leading-tight">
                  Chúng tôi ở đây để giúp bạn!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 space-y-2 overflow-y-auto bg-bg-base/40 p-3"
                style={{ minHeight: 0 }}
              >
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-text-secondary">
                    Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdminMsg = msg.isAdmin === true;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAdminMsg ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className="flex max-w-[80%] flex-col">
                          <div
                            className={[
                              'rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm',
                              isAdminMsg
                                ? 'rounded-bl-sm border border-border bg-white/5 text-text-primary'
                                : 'rounded-br-sm bg-gradient-to-r from-fuchsia-500 to-brand-500 text-white',
                            ].join(' ')}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                          </div>
                          <span
                            className={[
                              'mt-1 text-[10px] text-text-secondary',
                              isAdminMsg ? 'text-left' : 'text-right',
                            ].join(' ')}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex-shrink-0 border-t border-border bg-bg-elevated/60 p-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn của bạn..."
                    className="min-w-0 flex-1 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
                    title="Emoji"
                    aria-label="Emoji"
                  >
                    <Smile className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    aria-label="Gửi tin nhắn"
                    className={[
                      'inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-all duration-200',
                      message.trim()
                        ? 'bg-gradient-to-r from-fuchsia-500 to-brand-500 text-white shadow-glow-blue hover:scale-105'
                        : 'bg-white/5 text-text-secondary/60',
                    ].join(' ')}
                  >
                    <Send className="h-4 w-4" strokeWidth={2} />
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
