'use client';

import { Check, Copy, Mail, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Package } from '@/types';
import { VIET_CARRIERS, formatVND } from './types';

interface Props {
  pkg: Package;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentLabel: string;
  onClose: () => void;
}

export default function SuccessPanel({
  pkg,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  paymentLabel,
  onClose,
}: Props) {
  const carrier = VIET_CARRIERS[pkg.carrier] || pkg.carrier;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = orderId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1530] via-[#0b1a3a] to-[#070e22] p-5 text-white sm:rounded-[26px] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative grid gap-5 sm:grid-cols-[1fr_1.4fr] sm:items-center sm:gap-6">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/40 blur-2xl" />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-[#04111a] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.7)] sm:h-20 sm:w-20">
              <Check className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
            <Sparkles className="h-3 w-3" strokeWidth={2.2} /> Đặt hàng thành công
          </div>
          <h2 className="mt-3 text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl">
            Cảm ơn {customerName || 'bạn'}!
          </h2>
          <p className="mt-2 max-w-md text-xs text-white/70 sm:text-sm">
            Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận trong ít phút tới.
          </p>
        </div>

        <div className="relative space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
            <span className="text-white/55">Mã đơn hàng</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 sm:text-xs"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
              ) : (
                <Copy className="h-3.5 w-3.5" strokeWidth={2.2} />
              )}
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>
          <p className="break-all rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs font-semibold tracking-wide sm:text-sm">
            {orderId}
          </p>

          <dl className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
            <Item label="Nhà mạng" value={carrier} />
            <Item label="Gói cước" value={pkg.name} />
            <Item label="Phương thức" value={paymentLabel} />
            <Item label="Tổng tiền" value={formatVND(pkg.price)} highlight />
          </dl>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/10 pt-3 text-[11px] text-white/65 sm:text-xs">
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 flex-none" strokeWidth={2.2} />
              <span className="truncate">{customerEmail}</span>
            </span>
            {customerPhone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 flex-none" strokeWidth={2.2} />
                {customerPhone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-col-reverse gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/[0.08] sm:text-sm"
        >
          Đóng
        </button>
        <a
          href="#plans"
          onClick={onClose}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_-15px_rgba(34,211,238,0.7)] transition hover:brightness-110"
        >
          Tiếp tục khám phá
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

function Item({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
        {label}
      </dt>
      <dd
        className={`mt-1 truncate font-semibold ${highlight ? 'text-base text-gradient sm:text-lg' : 'text-xs text-white sm:text-sm'}`}
      >
        {value}
      </dd>
    </div>
  );
}