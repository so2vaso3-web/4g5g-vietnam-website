'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldCheck, LayoutDashboard, Sparkles } from 'lucide-react';

function MessengerLogo({ className }: { className?: string }) {
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

const NAV_ITEMS = [
  { href: '#home', label: 'Trang chủ' },
  { href: '#plans', label: 'Gói cước' },
  { href: '#about', label: 'Giới thiệu' },
  { href: '#contact', label: 'Liên hệ' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [websiteName, setWebsiteName] = useState('Mạng Việt Nam');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkAdminAuth = () => {
    if (typeof window === 'undefined') return;
    setIsAdmin(!!localStorage.getItem('adminSession'));
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    const loadWebsiteName = () => {
      const settings = localStorage.getItem('adminSettings');
      if (!settings) return;
      try {
        const parsed = JSON.parse(settings);
        if (parsed.websiteName && parsed.websiteName !== 'US Mobile Networks') {
          setWebsiteName(parsed.websiteName);
        } else if (parsed.websiteName === 'US Mobile Networks') {
          parsed.websiteName = 'Mạng Việt Nam';
          localStorage.setItem('adminSettings', JSON.stringify(parsed));
          setWebsiteName('Mạng Việt Nam');
        }
      } catch {
        /* noop */
      }
    };

    loadWebsiteName();
    window.addEventListener('storage', loadWebsiteName);
    const handleSettingsUpdate = () => loadWebsiteName();
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    checkAdminAuth();
    const authInterval = setInterval(checkAdminAuth, 60000);
    window.addEventListener('adminLoggedIn', checkAdminAuth);
    window.addEventListener('adminLoggedOut', checkAdminAuth);

    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('storage', loadWebsiteName);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('adminLoggedIn', checkAdminAuth);
      window.removeEventListener('adminLoggedOut', checkAdminAuth);
      clearInterval(authInterval);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'glass-strong border-b border-border-strong shadow-card'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="container-app flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={websiteName}
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
            <MessengerLogo className="h-5 w-5 text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-text-primary sm:text-lg">
              {websiteName}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-text-secondary sm:inline">
              Premium Mobile Data
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <span>{item.label}</span>
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-brand opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 lg:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
            Đã xác minh
          </span>
          {mounted && isAdmin && (
            <Link
              href="/admin"
              className="btn btn-secondary !h-10 !px-4 !text-xs"
            >
              <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
              Admin
            </Link>
          )}
          <Link
            href="#plans"
            className="btn btn-primary !h-10 !px-4 !text-xs"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Khám phá
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-xl border border-border bg-white/5 p-2 text-text-primary md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
          mobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="container-app pb-4">
          <div className="glass-strong rounded-2xl p-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <span>{item.label}</span>
                <span className="text-text-secondary">›</span>
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 px-2 pb-2">
              {mounted && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-secondary !h-11 !text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                  Admin
                </Link>
              )}
              <Link
                href="#plans"
                onClick={() => setMobileOpen(false)}
                className={[
                  'btn btn-primary !h-11 !text-sm',
                  mounted && isAdmin ? '' : 'col-span-2',
                ].join(' ')}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Khám phá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
