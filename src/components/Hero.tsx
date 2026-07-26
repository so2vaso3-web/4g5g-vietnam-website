'use client';

import { useEffect, useState } from 'react';
import {
  Rocket,
  ArrowRight,
  Info,
  Lock,
  Award,
  BadgeCheck,
  Sparkles,
  Signal,
  ShieldCheck,
  Crown,
  Gem,
  Zap,
  Globe,
  TowerControl,
  Waves,
  Radio,
} from 'lucide-react';
import { Button } from './ui/Button';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Bảo mật SSL', color: 'text-emerald-400' },
  { icon: Lock, label: 'Tuân thủ PCI', color: 'text-brand-400' },
  { icon: BadgeCheck, label: 'Đối tác chứng nhận', color: 'text-amber-400' },
  { icon: Award, label: 'Nhà phân phối chính thức', color: 'text-cyan-400' },
  { icon: Crown, label: 'Dịch vụ tốt nhất 2025', color: 'text-fuchsia-400' },
];

export default function Hero() {
  const [content, setContent] = useState({
    title: 'Gói Cước 4G & 5G Cao Cấp',
    subtitle: 'Mạng Lưới Phủ Sóng Tốt Nhất',
    description:
      'Chọn từ 9 nhà mạng hàng đầu Việt Nam với giá cả và phủ sóng không thể đánh bại.',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const websiteContent = localStorage.getItem('websiteContent');
    if (!websiteContent) return;
    try {
      const parsed = JSON.parse(websiteContent);
      if (parsed.hero) setContent(parsed.hero);
    } catch {
      /* noop */
    }
  }, []);

  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkBanner = () => {
      const hasClosedBanner = localStorage.getItem('trustBannerClosed');
      setBannerVisible(!hasClosedBanner);
    };
    checkBanner();
    window.addEventListener('bannerClosed', checkBanner);
    return () => window.removeEventListener('bannerClosed', checkBanner);
  }, []);

  return (
    <section
      id="home"
      className={[
        'relative overflow-hidden pt-32 sm:pt-40',
        bannerVisible ? 'md:pt-44' : 'md:pt-36',
        'pb-20 sm:pb-28',
      ].join(' ')}
    >
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand-500/30 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-accent/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[500px] w-[90%] max-w-5xl rounded-full bg-brand-500/10 blur-[120px]"
      />

      {/* Animated grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)',
        }}
      />

      {/* Floating ornaments - hiện đại hơn */}
      <div
        aria-hidden
        className="absolute right-[8%] top-32 hidden md:block"
      >
        <div className="group relative h-20 w-20 animate-float-slow">
          <div className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-50" />
          <div className="absolute inset-0 rotate-6 rounded-2xl border border-brand-400/40 bg-gradient-to-br from-brand-500/30 to-accent/20 backdrop-blur-md transition-all duration-500 group-hover:rotate-12" />
          <Radio className="absolute inset-0 m-auto h-8 w-8 text-brand-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" strokeWidth={1.8} />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute left-[6%] bottom-32 hidden md:block"
      >
        <div className="group relative h-16 w-16 animate-float-slow">
          <div className="absolute inset-0 rounded-full bg-accent opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-50" />
          <div className="absolute inset-0 rounded-full border border-accent/40 bg-gradient-to-br from-accent/30 to-fuchsia-500/20 backdrop-blur-md transition-all duration-500 group-hover:scale-110" />
          <Waves className="absolute inset-0 m-auto h-7 w-7 text-accent-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" strokeWidth={1.8} />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute right-[20%] bottom-48 hidden lg:block"
      >
        <div className="group relative h-14 w-14 animate-float-slow">
          <div className="absolute inset-0 rounded-xl bg-emerald-500 opacity-20 blur-lg transition-opacity duration-500 group-hover:opacity-50" />
          <div className="absolute inset-0 rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/25 to-cyan-500/15 backdrop-blur-md transition-all duration-500 group-hover:rotate-12" />
          <TowerControl className="absolute inset-0 m-auto h-6 w-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" strokeWidth={1.8} />
        </div>
      </div>

      <div className="container-app relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            <Rocket className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span className="hidden sm:inline">
              Được tin dùng bởi 50.000+ khách hàng trên toàn quốc
            </span>
            <span className="sm:hidden">50.000+ khách hàng</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient">{content.title}</span>
          </h1>

          <p className="mt-5 text-lg font-medium text-text-secondary sm:text-xl md:text-2xl">
            {content.subtitle}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base md:text-lg">
            {content.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={2} />}
              onClick={() => {
                document
                  .getElementById('plans')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto"
            >
              Xem gói cước
            </Button>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Info className="h-4 w-4" strokeWidth={2} />}
              onClick={() => {
                document
                  .getElementById('about')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto"
            >
              Tìm hiểu thêm
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {TRUST_BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={i}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-white/[0.07] hover:text-text-primary"
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${badge.color}`}
                    strokeWidth={2.2}
                  />
                  <span className="hidden sm:inline">{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* Stats grid */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: '9+', label: 'Nhà mạng', icon: TowerControl },
              { value: '35+', label: 'Gói cước', icon: Gem },
              { value: '50K', label: 'Khách hàng', icon: Globe },
              { value: '24/7', label: 'Hỗ trợ', icon: Zap },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="glass group relative overflow-hidden rounded-2xl px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="relative text-2xl font-extrabold text-gradient sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="relative mt-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
