'use client';

import { useEffect, useState } from 'react';
import {
  Signal,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Wallet,
  Smartphone,
  Sparkles,
  Heart,
  Crown,
  Facebook,
  Send,
} from 'lucide-react';

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 5.935 2 10.74c0 3.085 1.726 5.802 4.34 7.43-.198.745-.728 2.55-.834 2.94-.13.487.179.483.376.353.157-.103 2.013-1.366 2.836-1.926.74.2 1.528.318 2.282.318 5.523 0 10-3.935 10-8.74C22 5.935 17.523 2 12 2zm2.866 11.866h-5.6c-.466 0-.846-.38-.846-.846s.38-.846.846-.846h5.6c.466 0 .846.38.846.846s-.38.846-.846.846zm-1.6-3.466h-4c-.466 0-.846-.38-.846-.846s.38-.846.846-.846h4c.466 0 .846.38.846.846s-.38.846-.846.846z" />
    </svg>
  );
}

function FacebookZaloIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function Footer() {
  const [paymentMethods, setPaymentMethods] = useState<
    Array<{ name: string; icon: 'wallet' | 'phone' }>
  >([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadSettings = () => {
      const saved = localStorage.getItem('adminSettings');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);

        const methods: Array<{ name: string; icon: 'wallet' | 'phone' }> = [];
        if (parsed.paymentLogos?.momo || parsed.paymentQRCodes?.momo) {
          methods.push({ name: 'MoMo', icon: 'wallet' });
        }
        if (parsed.paymentLogos?.zalopay || parsed.paymentQRCodes?.zalopay) {
          methods.push({ name: 'ZaloPay', icon: 'phone' });
        }
        setPaymentMethods(methods);
      } catch {
        /* noop */
      }
    };

    loadSettings();
    window.addEventListener('storage', loadSettings);
    window.addEventListener('settingsUpdated', loadSettings);
    const interval = setInterval(loadSettings, 1000);
    return () => {
      window.removeEventListener('storage', loadSettings);
      window.removeEventListener('settingsUpdated', loadSettings);
      clearInterval(interval);
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border">
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="container-app relative py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-blue">
                <Signal className="h-5 w-5 text-white" strokeWidth={2.2} />
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-accent/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-text-primary sm:text-lg">
                  Mạng Việt Nam
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  Premium Mobile Data
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              Địa chỉ bán gói cước 4G/5G uy tín từ 9 nhà mạng hàng đầu Việt Nam.
              Kích hoạt tức thì, thanh toán bảo mật, hỗ trợ 24/7.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/5 text-text-secondary transition-all hover:-translate-y-0.5 hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:shadow-[0_8px_24px_-6px_rgba(24,119,242,0.4)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                  </svg>
                </a>
              )}
              {settings.zalo && (
                <a
                  href={settings.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo"
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/5 text-text-secondary transition-all hover:-translate-y-0.5 hover:border-[#0068FF]/60 hover:bg-[#0068FF]/10 hover:text-[#0068FF] hover:shadow-[0_8px_24px_-6px_rgba(0,104,255,0.4)]"
                >
                  <ZaloIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                Thanh toán bảo mật
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
              Liên kết nhanh
            </h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                { href: '#home', label: 'Trang chủ' },
                { href: '#plans', label: 'Gói cước' },
                { href: '#about', label: 'Giới thiệu' },
                { href: '#contact', label: 'Liên hệ' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-400 transition-all group-hover:w-4" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-5">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
              Hỗ trợ
            </h4>
            <ul className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.03] p-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <Phone className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Hotline
                  </div>
                  <a
                    href={`tel:${(settings.contactPhone || '1900xxxx').replace(/\D/g, '')}`}
                    className="block truncate text-sm font-semibold text-text-primary transition-colors hover:text-brand-300"
                  >
                    {settings.contactPhone || '1900xxxx'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.03] p-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-accent/15 text-accent-400">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Email
                  </div>
                  <a
                    href={`mailto:${settings.contactEmail || 'support@mangvietnam.com'}`}
                    className="block truncate text-sm font-semibold text-text-primary transition-colors hover:text-brand-300"
                  >
                    {settings.contactEmail || 'support@mangvietnam.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.03] p-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <MapPin className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Địa chỉ
                  </div>
                  <p className="truncate text-sm font-medium text-text-primary">
                    {settings.address || 'Việt Nam'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.03] p-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
                  <Clock className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Giờ làm việc
                  </div>
                  <p className="truncate text-sm font-medium text-text-primary">
                    {settings.businessHours || 'T2 - T6: 8:00 - 17:00'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        {paymentMethods.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white/[0.03] p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                    Phương thức thanh toán
                  </div>
                  <div className="text-sm text-text-primary">
                    Hỗ trợ nhiều cổng thanh toán phổ biến
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon === 'wallet' ? Wallet : Smartphone;
                  return (
                    <div
                      key={method.name}
                      className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-white/5 px-3 py-2 text-sm font-semibold text-text-primary transition-all hover:-translate-y-0.5 hover:border-brand-500/40"
                    >
                      <Icon className="h-4 w-4 text-brand-300" strokeWidth={2} />
                      {method.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row">
          <p>© {year} Mạng Việt Nam. Đã đăng ký bản quyền.</p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.2} />
            Bảo mật SSL · Tuân thủ PCI DSS
          </p>
        </div>
      </div>
    </footer>
  );
}
