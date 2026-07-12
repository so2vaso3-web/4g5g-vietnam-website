'use client';

import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { BankGlyph, MoMoGlyph, ZaloPayGlyph } from './BrandIcons';
import { CheckoutMethod } from './types';

interface Props {
  method: CheckoutMethod;
  onChange: (m: CheckoutMethod) => void;
  available: { momo: boolean; zalopay: boolean; bank: boolean };
  onBack: () => void;
  onContinue: () => void;
}

const OPTIONS: Array<{
  id: CheckoutMethod;
  name: string;
  blurb: string;
  badge: string;
  badgeClass: string;
  ring: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
}> = [
  {
    id: 'momo',
    name: 'Ví MoMo',
    blurb: 'Quét QR trong ứng dụng MoMo · xác nhận tức thì',
    badge: 'Phổ biến',
    badgeClass: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30',
    ring: 'from-rose-400/60 via-rose-500/30 to-transparent',
    Icon: MoMoGlyph,
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    blurb: 'Thanh toán qua ví ZaloPay · bảo mật OTP',
    badge: 'Nhanh',
    badgeClass: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30',
    ring: 'from-sky-400/60 via-sky-500/30 to-transparent',
    Icon: ZaloPayGlyph,
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    blurb: 'Hỗ trợ QR VietQR · tự động điền số tiền & nội dung',
    badge: 'VietQR',
    badgeClass: 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30',
    ring: 'from-cyan-400/60 via-cyan-500/30 to-transparent',
    Icon: BankGlyph,
  },
];

export default function PaymentStep({ method, onChange, available, onBack, onContinue }: Props) {
  const list = OPTIONS.filter((o) => available[o.id]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-2xl">Chọn phương thức thanh toán</h2>
          <p className="mt-1 text-xs text-white/60 sm:text-sm">
            Mọi giao dịch đều được mã hóa và xác nhận tự động với hệ thống.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 sm:self-auto">
          <ShieldCheck className="h-3 w-3" strokeWidth={2.2} /> Bảo mật
        </span>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/[0.08] p-4 text-sm text-rose-200">
          Hiện chưa có phương thức thanh toán nào được cấu hình. Vui lòng liên hệ hỗ trợ.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {list.map((opt) => {
            const active = method === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border bg-white/[0.04] p-3 text-left transition-all duration-300 sm:gap-4 sm:p-4 ${
                  active
                    ? 'border-white/30 bg-white/[0.07] shadow-[0_18px_50px_-25px_rgba(34,211,238,0.7)]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <span
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${opt.ring} opacity-0 transition-opacity duration-300 ${
                    active ? 'opacity-100' : 'group-hover:opacity-40'
                  }`}
                />
                <span
                  className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 transition-transform duration-300 sm:h-14 sm:w-14 ${
                    active ? 'scale-105 shadow-[0_0_30px_rgba(34,211,238,0.35)]' : ''
                  }`}
                >
                  <opt.Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white sm:text-base">{opt.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${opt.badgeClass}`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-white/60 sm:text-sm">{opt.blurb}</p>
                </div>
                <span
                  className={`relative flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-all duration-300 sm:h-6 sm:w-6 ${
                    active
                      ? 'border-emerald-300 bg-gradient-to-br from-emerald-400 to-cyan-400 text-[#04111a]'
                      : 'border-white/25 bg-transparent text-transparent'
                  }`}
                  aria-hidden
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3 sm:h-3.5 sm:w-3.5">
                    <path
                      d="M5 10.5l3.2 3.2L15 6.8"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/[0.08] hover:text-white sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          Quay lại
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={list.length === 0}
          className={`group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:text-base ${
            list.length === 0
              ? 'cursor-not-allowed bg-white/10 text-white/40'
              : 'bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 text-white shadow-[0_18px_45px_-15px_rgba(34,211,238,0.7)] hover:brightness-110'
          }`}
        >
          Tiếp tục
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}