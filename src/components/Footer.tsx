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
} from 'lucide-react';

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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-blue">
                <Signal className="h-5 w-5 text-white" strokeWidth={2.2} />
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
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/5 text-text-secondary transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-text-primary"
                >
                  <span className="text-lg font-bold leading-none" aria-hidden>
                    f
                  </span>
                </a>
              )}
              {settings.zalo && (
                <a
                  href={settings.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/5 text-text-secondary transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-text-primary"
                >
                  <MessengerIcon className="h-4.5 w-4.5" />
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
