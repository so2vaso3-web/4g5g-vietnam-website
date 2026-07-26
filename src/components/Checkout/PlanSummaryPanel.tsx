import { Database, Gauge, Wifi, ShieldCheck, Sparkles, Tag, Clock, ReceiptText } from 'lucide-react';
import { Package } from '@/types';
import { VIET_CARRIERS, formatVND } from './types';

interface Props {
  pkg: Package;
  paymentLabel?: string;
  compact?: boolean;
}

export default function PlanSummaryPanel({ pkg, paymentLabel, compact }: Props) {
  const carrier = VIET_CARRIERS[pkg.carrier] || pkg.carrier;
  const original = pkg.originalPrice;
  const discount =
    original && original > pkg.price ? Math.round((1 - pkg.price / original) * 100) : 0;

  return (
    <aside className="relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1d3a] via-[#0d1730] to-[#091027] p-4 text-white shadow-[0_30px_80px_-30px_rgba(8,15,40,0.9)] sm:gap-5 sm:rounded-[26px] sm:p-6 lg:rounded-[28px]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-brand-500/35 blur-3xl sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />

      <header className="relative flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
          <ReceiptText className="h-3 w-3" strokeWidth={2.2} />
          Tóm tắt đơn
        </span>
        {pkg.badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/30 to-orange-500/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 ring-1 ring-amber-300/30">
            <Sparkles className="h-3 w-3" strokeWidth={2.2} />
            {pkg.badge}
          </span>
        )}
      </header>

      <div className="relative space-y-1.5 sm:space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 sm:text-[11px]">
          {carrier}
        </p>
        <h3 className="text-lg font-bold leading-tight text-balance sm:text-2xl">{pkg.name}</h3>
        {pkg.description && !compact && (
          <p className="text-xs leading-relaxed text-white/70 line-clamp-3 sm:text-sm">
            {pkg.description}
          </p>
        )}
      </div>

      <ul className="relative grid grid-cols-1 gap-2 text-sm sm:gap-2.5">
        <SummaryRow
          icon={<Database className="h-4 w-4" strokeWidth={2.2} />}
          label="Dung lượng"
          value={pkg.data}
        />
        <SummaryRow
          icon={<Gauge className="h-4 w-4" strokeWidth={2.2} />}
          label="Tốc độ"
          value={pkg.speed}
        />
        {pkg.validity && (
          <SummaryRow
            icon={<Clock className="h-4 w-4" strokeWidth={2.2} />}
            label="Thời hạn"
            value={pkg.validity}
          />
        )}
        {pkg.hotspot && (
          <SummaryRow
            icon={<Wifi className="h-4 w-4" strokeWidth={2.2} />}
            label="Phát WiFi"
            value="Đi kèm"
          />
        )}
      </ul>

      <div className="relative mt-auto space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:space-y-3 sm:p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
            Thành tiền
          </span>
          {original && original > pkg.price && (
            <span className="text-xs text-white/50 line-through">{formatVND(original)}</span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-3">
          <span className="text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl">
            {formatVND(pkg.price)}
          </span>
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200 ring-1 ring-emerald-400/30 sm:text-xs">
              <Tag className="h-3 w-3" strokeWidth={2.2} /> -{discount}%
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.2} />
            Thanh toán bảo mật
          </span>
          {paymentLabel ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white/85">
              {paymentLabel}
            </span>
          ) : (
            <span>VNĐ · {pkg.period === 'year' ? 'năm' : 'tháng'}</span>
          )}
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 sm:py-2.5">
      <span className="inline-flex min-w-0 items-center gap-2 text-white/70">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-white/10 text-cyan-200">
          {icon}
        </span>
        <span className="truncate text-sm">{label}</span>
      </span>
      <span className="truncate text-right text-sm font-semibold text-white">{value}</span>
    </li>
  );
}