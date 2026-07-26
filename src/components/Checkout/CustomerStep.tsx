'use client';

import { useMemo, useState } from 'react';
import { User, Mail, Phone, ShieldAlert, ArrowRight } from 'lucide-react';
import { CheckoutCustomerInfo, formatPhone } from './types';

interface Props {
  info: CheckoutCustomerInfo;
  errors: Record<string, string>;
  onChange: (info: CheckoutCustomerInfo) => void;
  onEmailBlur: () => void;
  onPhoneBlur: () => void;
  onContinue: () => void;
  isValid: boolean;
}

export default function CustomerStep({
  info,
  errors,
  onChange,
  onEmailBlur,
  onPhoneBlur,
  onContinue,
  isValid,
}: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fillPercent = useMemo(() => {
    let n = 0;
    if (info.name.trim()) n += 1;
    if (info.email.trim()) n += 1;
    if (info.phone.trim()) n += 1;
    return Math.round((n / 3) * 100);
  }, [info]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-bold text-white sm:text-2xl">Thông tin liên hệ</h2>
        <p className="text-xs text-white/60 sm:text-sm">
          Chúng tôi sẽ dùng thông tin này để kích hoạt gói và gửi xác nhận đơn hàng.
        </p>
      </header>

      <div className="rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-3 text-amber-100 sm:p-4">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-amber-400/20 text-amber-200 sm:h-9 sm:w-9">
            <ShieldAlert className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs font-semibold sm:text-sm">Vui lòng nhập chính xác</p>
            <p className="text-[11px] leading-relaxed text-amber-100/80 sm:text-xs">
              Sai email hoặc số điện thoại có thể khiến gói cước không được kích hoạt hoặc chậm trễ trong
              việc giao nhận.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        <Field
          id="checkout-name"
          label="Họ và tên"
          icon={<User className="h-4 w-4" strokeWidth={2.2} />}
          placeholder="Nguyễn Văn A"
          value={info.name}
          onChange={(v) => onChange({ ...info, name: v })}
          error={touched.name ? errors.name : undefined}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        />
        <Field
          id="checkout-email"
          label="Email"
          type="email"
          icon={<Mail className="h-4 w-4" strokeWidth={2.2} />}
          placeholder="ban@example.com"
          value={info.email}
          onChange={(v) => onChange({ ...info, email: v })}
          onBlur={() => {
            setTouched((t) => ({ ...t, email: true }));
            onEmailBlur();
          }}
          error={touched.email ? errors.email : undefined}
        />
        <Field
          id="checkout-phone"
          label="Số điện thoại"
          type="tel"
          icon={<Phone className="h-4 w-4" strokeWidth={2.2} />}
          placeholder="(012) 345-6789"
          value={info.phone}
          onChange={(v) => onChange({ ...info, phone: formatPhone(v) })}
          onBlur={() => {
            setTouched((t) => ({ ...t, phone: true }));
            onPhoneBlur();
          }}
          error={touched.phone ? errors.phone : undefined}
          hint="10 chữ số, bắt đầu bằng 0 — ví dụ: 0912345678"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-300 transition-all duration-500"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold text-white/60 sm:text-xs">{fillPercent}%</span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!isValid}
        className={`group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:text-base ${
          isValid
            ? 'bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 text-white shadow-[0_18px_45px_-15px_rgba(34,211,238,0.7)] hover:brightness-110'
            : 'cursor-not-allowed bg-white/10 text-white/40'
        }`}
      >
        Tiếp tục thanh toán
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
      </button>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  error,
  hint,
}: FieldProps) {
  const hasError = Boolean(error);
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px]"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-2xl border bg-white/[0.04] transition-all duration-200 ${
          hasError
            ? 'border-rose-400/60 ring-2 ring-rose-400/30'
            : 'border-white/10 focus-within:border-brand-400/60 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-brand-400/25'
        }`}
      >
        <span className="flex h-11 w-11 flex-none items-center justify-center text-white/55 sm:h-12 sm:w-12">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent px-1 pr-3 text-base text-white placeholder:text-white/35 focus:outline-none sm:pr-4"
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-300">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] text-white/45 sm:text-xs">{hint}</p>
      ) : null}
    </div>
  );
}