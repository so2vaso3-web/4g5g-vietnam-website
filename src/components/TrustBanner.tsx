'use client';

import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Clock, Award, X } from 'lucide-react';

const ITEMS = [
  { icon: Truck, label: 'Kích hoạt tức thì' },
  { icon: ShieldCheck, label: 'Thanh toán bảo mật' },
  { icon: Clock, label: 'Hỗ trợ 24/7' },
  { icon: Award, label: 'Đối tác chính thức' },
];

export default function TrustBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasClosed = localStorage.getItem('trustBannerClosed');
    setVisible(!hasClosed);
    const onUpdate = () => setVisible(!localStorage.getItem('trustBannerClosed'));
    window.addEventListener('storage', onUpdate);
    window.addEventListener('bannerClosed', onUpdate);
    return () => {
      window.removeEventListener('storage', onUpdate);
      window.removeEventListener('bannerClosed', onUpdate);
    };
  }, []);

  const close = () => {
    localStorage.setItem('trustBannerClosed', '1');
    window.dispatchEvent(new Event('bannerClosed'));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg-elevated/80 backdrop-blur-md">
      <div className="container-app flex items-center justify-between gap-3 py-2.5">
        <div className="flex flex-1 items-center gap-3 overflow-hidden">
          <span className="hidden items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-blue sm:inline-flex">
            <Award className="h-3 w-3" strokeWidth={2.4} />
            Verified
          </span>
          <div className="marquee gap-8">
            {[...ITEMS, ...ITEMS].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-none items-center gap-2 text-xs font-medium text-text-secondary sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-300" strokeWidth={2} />
                  <span>{item.label}</span>
                  <span className="ml-6 hidden h-1 w-1 rounded-full bg-text-secondary/50 sm:inline-block" />
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Đóng banner"
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
