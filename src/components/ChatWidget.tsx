'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Zap } from 'lucide-react';

const DEFAULT_FACEBOOK_URL = 'https://www.facebook.com/HOTRODATA/';

function getMessengerUrl(facebook?: string): string | null {
  const url = (facebook?.trim() || DEFAULT_FACEBOOK_URL).trim();

  if (/^m\.me\//i.test(url)) {
    return `https://${url}`;
  }

  if (url.includes('m.me/')) {
    return url.startsWith('http') ? url : `https://${url.replace(/^\/\//, '')}`;
  }

  if (url.includes('messenger.com/t/')) {
    return url.startsWith('http') ? url : `https://${url.replace(/^\/\//, '')}`;
  }

  const idMatch = url.match(/[?&]id=(\d+)/);
  if (idMatch) {
    return `https://m.me/${idMatch[1]}`;
  }

  const pageMatch = url.match(/facebook\.com\/([^/?#]+)/i);
  if (
    pageMatch &&
    !['share', 'sharer', 'profile.php', 'pages', 'groups', 'events', 'watch'].includes(
      pageMatch[1].toLowerCase(),
    )
  ) {
    return `https://m.me/${pageMatch[1]}`;
  }

  if (!url.includes('/') && !url.includes('.')) {
    return `https://m.me/${url}`;
  }

  return url.startsWith('http') ? url : `https://${url}`;
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.891 1.436 5.464 3.681 7.133V22l3.373-1.848c.896.248 1.842.381 2.946.381 5.523 0 10-4.145 10-9.29C22 6.145 17.523 2 12 2zm1.073 12.367-2.664-2.842-5.196 2.842 5.715-6.075 2.732 2.842 5.122-2.842-5.709 6.077z" />
    </svg>
  );
}

export default function ChatWidget() {
  const [messengerUrl, setMessengerUrl] = useState<string | null>(() => getMessengerUrl());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMessengerUrl = () => {
      const saved = localStorage.getItem('adminSettings');
      let facebook: string | undefined;

      if (saved) {
        try {
          facebook = JSON.parse(saved).facebook;
        } catch {
          facebook = undefined;
        }
      }

      setMessengerUrl(getMessengerUrl(facebook));
    };

    const syncFromServer = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            localStorage.setItem('adminSettings', JSON.stringify(data.settings));
            setMessengerUrl(getMessengerUrl(data.settings.facebook));
            return;
          }
        }
      } catch {
        /* ignore */
      }

      loadMessengerUrl();
    };

    loadMessengerUrl();
    syncFromServer();

    window.addEventListener('storage', loadMessengerUrl);
    window.addEventListener('settingsUpdated', loadMessengerUrl);

    const interval = setInterval(loadMessengerUrl, 1000);

    return () => {
      window.removeEventListener('storage', loadMessengerUrl);
      window.removeEventListener('settingsUpdated', loadMessengerUrl);
      clearInterval(interval);
    };
  }, []);

  if (!messengerUrl) return null;

  return (
    <a
      href={messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn qua Messenger"
      title="Nhắn qua Messenger"
      className="group fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-2xl border border-brand-400/40 bg-gradient-brand text-white shadow-[0_12px_40px_-12px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-12px_rgba(37,99,235,0.8)] sm:bottom-6 sm:right-6"
    >
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-2xl ring-2 ring-brand-400/30 transition-all duration-500 group-hover:ring-brand-300/50" />
      
      <span className="relative hidden rounded-xl bg-white/10 px-3 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 sm:inline-block">
        Hỗ trợ 24/7
      </span>
      
      <span className="relative inline-flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
        {/* Ring */}
        <span className="absolute inset-0 rounded-2xl bg-white/10" />
        <span className="absolute inset-0 rounded-2xl bg-white/5" />
        <MessengerIcon className="relative h-6 w-6 sm:h-7 sm:w-7" />
        {/* Notification dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent sm:h-3.5 sm:w-3.5" />
        </span>
      </span>
    </a>
  );
}
