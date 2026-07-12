'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, Mail, Smartphone, University } from 'lucide-react';
import { CheckoutMethod, CheckoutSettingsShape, formatVND } from './types';

interface Props {
  method: CheckoutMethod;
  pkgPrice: number;
  pkgName: string;
  email: string;
  settings: CheckoutSettingsShape | null;
  content: string;
  onBack: () => void;
  onComplete: () => void;
}

interface QrSrc {
  url: string;
}

function resolveQr(
  method: CheckoutMethod,
  settings: CheckoutSettingsShape | null,
  price: number,
  pkgName: string
): QrSrc | null {
  if (!settings) return null;
  if (method === 'momo' && settings.paymentQRCodes?.momo) {
    return { url: settings.paymentQRCodes.momo };
  }
  if (method === 'zalopay' && settings.paymentQRCodes?.zalopay) {
    return { url: settings.paymentQRCodes.zalopay };
  }
  if (method === 'bank') {
    const account = settings.bankInfo?.accountNumber || '';
    const isUrl =
      account.startsWith('http://') ||
      account.startsWith('https://') ||
      account.startsWith('data:image');
    let url = settings.bankInfo?.qrCodeUrl || '';
    if (!url && isUrl) url = account;
    if (url && url.includes('vietqr.io')) {
      url = `${url}?amount=${price}&addInfo=${encodeURIComponent(`Thanh toan goi ${pkgName}`)}`;
    }
    if (!url) return null;
    return { url };
  }
  return null;
}

export default function QRStep({
  method,
  pkgPrice,
  pkgName,
  email,
  settings,
  content,
  onBack,
  onComplete,
}: Props) {
  const qr = resolveQr(method, settings, pkgPrice, pkgName);
  const [copied, setCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    setImgFailed(false);
  }, [qr?.url]);

  useEffect(() => {
    const t = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const bankFields = settings?.bankInfo;
  const showBankInfo = method === 'bank';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const headline =
    method === 'bank' ? 'Quét QR hoặc chuyển khoản thủ công' : 'Quét QR bằng ứng dụng để thanh toán';

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-bold text-white sm:text-2xl">{headline}</h2>
        <p className="text-xs text-white/60 sm:text-sm">
          Sau khi hoàn tất, nhấn{' '}
          <span className="font-semibold text-white">“Đã thanh toán”</span> để chúng tôi ghi nhận đơn
          hàng.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] p-4 sm:rounded-3xl sm:p-5">
          <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-brand-500/30 blur-3xl sm:h-40 sm:w-40" />
          <div className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-cyan-500/25 blur-3xl sm:h-40 sm:w-40" />

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              {method === 'bank' ? (
                <University className="h-3 w-3" strokeWidth={2.2} />
              ) : (
                <Smartphone className="h-3 w-3" strokeWidth={2.2} />
              )}
              {method === 'momo' ? 'MoMo' : method === 'zalopay' ? 'ZaloPay' : 'VietQR'}
            </span>
            <span className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[10px] font-semibold text-amber-100 ring-1 ring-amber-300/30">
              {minutes}:{seconds}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center sm:mt-5">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[26px] bg-gradient-to-br from-brand-400/40 via-cyan-300/40 to-emerald-300/30 blur-2xl" />
              <div className="rounded-[22px] border border-white/15 bg-white p-3 shadow-[0_20px_60px_-25px_rgba(34,211,238,0.7)] sm:rounded-[26px] sm:p-4">
                {qr && !imgFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={qr.url}
                    src={qr.url}
                    alt="QR thanh toán"
                    onError={() => setImgFailed(true)}
                    className="h-48 w-48 object-contain sm:h-56 sm:w-56 lg:h-64 lg:w-64"
                  />
                ) : (
                  <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 text-center text-xs text-slate-500 sm:h-56 sm:w-56 lg:h-64 lg:w-64 sm:text-sm">
                    <University className="h-7 w-7 text-slate-400 sm:h-8 sm:w-8" strokeWidth={1.6} />
                    <p>Không tìm thấy QR. Vui lòng chuyển khoản theo thông tin bên cạnh.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center sm:mt-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-xs">Số tiền</p>
            <p className="mt-1 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              {formatVND(pkgPrice)}
            </p>
            <p className="mt-1 text-[11px] text-white/55 sm:text-xs">{pkgName}</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {showBankInfo && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm sm:p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:mb-3 sm:text-[11px]">
                Thông tin tài khoản
              </p>
              <dl className="divide-y divide-white/5">
                {bankFields?.bankName && <Row label="Ngân hàng" value={bankFields.bankName} />}
                {bankFields?.accountNumber && !bankFields.accountNumber.startsWith('http') && (
                  <Row label="Số tài khoản" value={bankFields.accountNumber} mono />
                )}
                {bankFields?.accountHolder && (
                  <Row label="Chủ tài khoản" value={bankFields.accountHolder.toUpperCase()} />
                )}
                {bankFields?.branch && <Row label="Chi nhánh" value={bankFields.branch} />}
              </dl>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
                Nội dung chuyển khoản
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:text-xs ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-300/40'
                    : 'bg-white/10 text-white/85 ring-1 ring-white/15 hover:bg-white/15'
                }`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={2.2} />
                )}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="mt-2 break-all rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs font-semibold text-white sm:text-sm">
              {content}
            </p>
            <p className="mt-2 text-[10px] text-amber-200/90 sm:text-[11px]">
              Vui lòng giữ nguyên nội dung để hệ thống tự động đối soát.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] p-3 text-xs text-cyan-100 sm:p-4 sm:text-sm">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-200 sm:h-9 sm:w-9">
                <Mail className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <p className="leading-relaxed">
                Sau khi nhận được thanh toán, chúng tôi sẽ liên hệ bạn tại{' '}
                <span className="font-semibold text-white break-all">{email || 'email của bạn'}</span>{' '}
                trong vòng vài phút.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/[0.08] hover:text-white sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          Đổi phương thức
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-brand-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#04111a] shadow-[0_18px_45px_-15px_rgba(16,185,129,0.7)] transition hover:brightness-110"
        >
          Tôi đã thanh toán
          <Check className="h-4 w-4 transition-transform group-hover:scale-110" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
      <dt className="text-white/55">{label}</dt>
      <dd
        className={`truncate text-right font-semibold text-white ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}