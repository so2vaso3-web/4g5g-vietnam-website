'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ShoppingCart,
  Scale,
  X,
  Tag,
  Star,
  Crown,
  Flame,
  Sparkles,
  Wifi,
  Gauge,
  Database,
  Layers,
  Infinity as InfinityIcon,
  Heart,
} from 'lucide-react';
import { Package } from '@/types';
import PaymentModal from './PaymentModal';
import Modal from './ui/Modal';
import { Button } from './ui/Button';

const BADGE_CONFIG: Record<string, { icon: any; className: string }> = {
  'TIẾT KIỆM': {
    icon: Tag,
    className: 'from-emerald-500/30 to-cyan-500/30 text-emerald-200 border-emerald-400/30',
  },
  'BEST VALUE': {
    icon: Star,
    className: 'from-amber-500/30 to-orange-500/30 text-amber-200 border-amber-400/30',
  },
  PREMIUM: {
    icon: Crown,
    className: 'from-fuchsia-500/30 to-purple-500/30 text-fuchsia-200 border-fuchsia-400/30',
  },
  NEW: {
    icon: Sparkles,
    className: 'from-brand-500/30 to-accent/30 text-brand-200 border-brand-400/30',
  },
  HOT: {
    icon: Flame,
    className: 'from-orange-500/30 to-red-500/30 text-orange-200 border-orange-400/30',
  },
};

const CARRIER_NAMES: Record<string, string> = {
  Viettel: 'Viettel',
  Vinaphone: 'Vinaphone',
  MobiFone: 'MobiFone',
  Vietnamobile: 'Vietnamobile',
  Gmobile: 'Gmobile',
  iTel: 'iTel',
  Wintel: 'Wintel',
  VNSKY: 'VNSKY',
  Local: 'Local',
};

interface PlanCardProps {
  pkg: Package;
  isInCompareList?: boolean;
  onToggleCompare?: (planId: string) => void;
}

export default function PlanCard({ pkg, isInCompareList = false, onToggleCompare }: PlanCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [carrierLogos, setCarrierLogos] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const settings = localStorage.getItem('adminSettings');
    if (!settings) return;
    try {
      const parsed = JSON.parse(settings);
      if (parsed.carrierLogos) setCarrierLogos(parsed.carrierLogos);
    } catch {
      /* noop */
    }
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('ul') ||
      target.closest('li') ||
      target.closest('.more-features-link')
    ) {
      return;
    }
    setShowPaymentModal(true);
  };

  const handleMoreFeatures = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowFeaturesModal(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCompare) onToggleCompare(pkg.id);
  };

  const badgeCfg = pkg.badge ? BADGE_CONFIG[pkg.badge] : undefined;
  const BadgeIcon = badgeCfg?.icon;
  const discountPct =
    pkg.originalPrice && pkg.originalPrice > pkg.price
      ? Math.round((1 - pkg.price / pkg.originalPrice) * 100)
      : 0;

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleCardClick}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-card-hover sm:p-6"
      >
        {/* Glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.18) 40%, transparent 70%)',
            WebkitMaskImage:
              'linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: 1,
          }}
        />

        {/* Top row */}
        <div className="relative mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {carrierLogos[pkg.carrier] ? (
              <div className="rounded-lg border border-border bg-white p-1.5 shadow-inner-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={carrierLogos[pkg.carrier]}
                  alt={CARRIER_NAMES[pkg.carrier] || pkg.carrier}
                  className="h-5 w-auto object-contain sm:h-6"
                />
              </div>
            ) : (
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {CARRIER_NAMES[pkg.carrier] || pkg.carrier}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isInCompareList && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.2} />
                <span className="hidden sm:inline">Đang so sánh</span>
              </span>
            )}
            {badgeCfg && BadgeIcon && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border bg-gradient-to-r px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeCfg.className}`}
              >
                <BadgeIcon className="h-3 w-3" strokeWidth={2.2} />
                {pkg.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title + description */}
        <div className="relative">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-text-primary sm:text-lg">
            {pkg.name}
          </h3>
          {pkg.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
              {pkg.description}
            </p>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2">
            {pkg.originalPrice && (
              <span className="text-xs text-text-secondary line-through sm:text-sm">
                {pkg.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-2xl font-extrabold text-gradient sm:text-3xl">
              {pkg.price.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-xs text-text-secondary sm:text-sm">
              /{pkg.validity || 'tháng'}
            </span>
            {discountPct > 0 && (
              <span className="ml-auto inline-flex items-center rounded-md bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                -{discountPct}%
              </span>
            )}
          </div>
        </div>

        {/* Features list */}
        <ul className="relative mt-5 flex-1 space-y-2.5">
          <li className="flex items-center gap-2.5 text-sm text-text-primary">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/20">
              <Database className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="truncate font-medium">{pkg.data} Data</span>
          </li>
          <li className="flex items-center gap-2.5 text-sm text-text-primary">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-accent/15 text-accent-400 ring-1 ring-accent/30">
              <Gauge className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="truncate font-medium">Tốc độ {pkg.speed}</span>
          </li>
          {pkg.hotspot && (
            <li className="flex items-center gap-2.5 text-sm text-text-primary">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
                <Wifi className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
              <span className="truncate font-medium">Phát WiFi</span>
            </li>
          )}
          {pkg.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center">
                <CheckCircle2
                  className="h-4 w-4 text-emerald-400"
                  strokeWidth={2.4}
                />
              </span>
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
          {pkg.features.length > 3 && (
            <li
              className="more-features-link mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-brand-300 transition-colors hover:text-brand-200"
              onClick={handleMoreFeatures}
            >
              +{pkg.features.length - 3} tính năng khác
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="relative mt-5 flex items-stretch gap-2">
          <Button
            onClick={handleBuyNow}
            size="md"
            leftIcon={<ShoppingCart className="h-4 w-4" strokeWidth={2} />}
            className="flex-1"
          >
            Mua ngay
          </Button>
          <button
            type="button"
            onClick={handleCompare}
            aria-label={isInCompareList ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
            title={isInCompareList ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
            className={[
              'inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border transition-all duration-200',
              isInCompareList
                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                : 'border-border bg-white/5 text-text-secondary hover:border-brand-500/40 hover:text-text-primary',
            ].join(' ')}
          >
            {isInCompareList ? (
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Scale className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal pkg={pkg} onClose={() => setShowPaymentModal(false)} />
      )}

      {/* Features modal */}
      <Modal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        title="Tất cả tính năng"
        description={`${pkg.name} · ${pkg.price.toLocaleString('vi-VN')}₫ /${pkg.validity || 'tháng'}`}
        size="md"
      >
        <ul className="space-y-2.5">
          <li className="flex items-center gap-3 text-text-primary">
            <CheckCircle2
              className="h-4 w-4 flex-none text-emerald-400"
              strokeWidth={2.2}
            />
            <span className="font-medium">{pkg.data} Data</span>
          </li>
          <li className="flex items-center gap-3 text-text-primary">
            <CheckCircle2
              className="h-4 w-4 flex-none text-emerald-400"
              strokeWidth={2.2}
            />
            <span className="font-medium">Tốc độ {pkg.speed}</span>
          </li>
          {pkg.hotspot && (
            <li className="flex items-center gap-3 text-text-primary">
              <CheckCircle2
                className="h-4 w-4 flex-none text-emerald-400"
                strokeWidth={2.2}
              />
              <span className="font-medium">Phát WiFi</span>
            </li>
          )}
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-text-secondary">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 flex-none text-emerald-400"
                strokeWidth={2.2}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowFeaturesModal(false)}>Đóng</Button>
        </div>
      </Modal>
    </>
  );
}
