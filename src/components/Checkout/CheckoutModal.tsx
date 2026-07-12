'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Package } from '@/types';
import { addOrderToServer } from '@/lib/useOrders';
import StepIndicator from './StepIndicator';
import PlanSummaryPanel from './PlanSummaryPanel';
import CustomerStep from './CustomerStep';
import PaymentStep from './PaymentStep';
import QRStep from './QRStep';
import SuccessPanel from './SuccessPanel';
import {
  CheckoutCustomerInfo,
  CheckoutMethod,
  CheckoutSettingsShape,
  CheckoutStep,
  formatVND,
} from './types';

interface Props {
  pkg: Package;
  onClose: () => void;
}

const METHOD_LABEL: Record<CheckoutMethod, string> = {
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  bank: 'Chuyển khoản',
};

export default function CheckoutModal({ pkg, onClose }: Props) {
  const [step, setStep] = useState<CheckoutStep>('customer');
  const [info, setInfo] = useState<CheckoutCustomerInfo>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<CheckoutSettingsShape | null>(null);
  const [method, setMethod] = useState<CheckoutMethod>('momo');
  const [success, setSuccess] = useState<null | {
    orderId: string;
    method: CheckoutMethod;
    createdAt: string;
  }>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const read = () => {
      try {
        const raw = localStorage.getItem('adminSettings');
        if (raw) setSettings(JSON.parse(raw));
      } catch {
        /* noop */
      }
    };
    read();
    window.addEventListener('storage', read);
    window.addEventListener('settingsUpdated', read);
    const interval = window.setInterval(read, 1500);
    return () => {
      window.removeEventListener('storage', read);
      window.removeEventListener('settingsUpdated', read);
      window.clearInterval(interval);
    };
  }, []);

  const available = useMemo(
    () => ({
      momo: !!settings?.paymentQRCodes?.momo,
      zalopay: !!settings?.paymentQRCodes?.zalopay,
      bank: !!(
        settings?.bankInfo?.bankName &&
        (settings?.bankInfo?.accountNumber || settings?.bankInfo?.qrCodeUrl)
      ),
    }),
    [settings]
  );

  useEffect(() => {
    if (available.momo) setMethod('momo');
    else if (available.zalopay) setMethod('zalopay');
    else if (available.bank) setMethod('bank');
  }, [available.momo, available.zalopay, available.bank]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    setStep('customer');
    setInfo({ name: '', email: '', phone: '' });
    setErrors({});
    setSuccess(null);
  }, [pkg.id]);

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('0');
  };

  const isFormValid =
    info.name.trim() !== '' && isValidEmail(info.email) && isValidPhone(info.phone);

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!info.name.trim()) next.name = 'Vui lòng nhập họ tên';
    if (!info.email.trim()) next.email = 'Vui lòng nhập email';
    else if (!isValidEmail(info.email))
      next.email = 'Email không hợp lệ. Ví dụ: ten@example.com';
    if (!info.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại';
    else if (!isValidPhone(info.phone))
      next.phone = 'Số điện thoại cần 10 chữ số và bắt đầu bằng 0';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [info]);

  const handleEmailBlur = () => {
    if (info.email && !isValidEmail(info.email)) {
      setErrors((p) => ({ ...p, email: 'Email không hợp lệ. Ví dụ: ten@example.com' }));
    } else if (info.email && isValidEmail(info.email)) {
      setErrors((p) => {
        const c = { ...p };
        delete c.email;
        return c;
      });
    }
  };

  const handlePhoneBlur = () => {
    if (info.phone && !isValidPhone(info.phone)) {
      setErrors((p) => ({ ...p, phone: 'Số điện thoại cần 10 chữ số và bắt đầu bằng 0' }));
    } else if (info.phone && isValidPhone(info.phone)) {
      setErrors((p) => {
        const c = { ...p };
        delete c.phone;
        return c;
      });
    }
  };

  const handleContinueCustomer = () => {
    if (validate()) setStep('method');
  };

  const handleContinueMethod = () => setStep('qr');

  const paymentContent = useMemo(
    () => `THANHTOAN ${pkg.name.replace(/\s+/g, '').toUpperCase()}`,
    [pkg.name]
  );

  const handleCompleteOrder = async () => {
    const orderId = `ORD-${Date.now()}`;
    const order = {
      orderId,
      planId: pkg.id,
      packageId: pkg.id,
      planName: pkg.name,
      packageName: pkg.name,
      carrier: pkg.carrier,
      price: pkg.price,
      amount: pkg.price,
      paymentMethod: method,
      status: 'pending' as const,
      customerName: info.name,
      customerEmail: info.email,
      customerPhone: info.phone,
      customerNotes: '',
      name: info.name,
      email: info.email,
      phone: info.phone,
      notes: '',
      createdAt: new Date().toISOString(),
    };

    try {
      const ok = await addOrderToServer(order);
      if (!ok) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    } catch {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    try {
      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: order.customerName,
          email: order.customerEmail,
          message: `🛒 <b>Đơn Hàng Mới - ${METHOD_LABEL[method]}</b>

📦 <b>Mã đơn:</b> ${order.orderId}
📱 <b>Gói:</b> ${order.planName}
🏢 <b>Nhà mạng:</b> ${order.carrier}
💰 <b>Số tiền:</b> ${order.price.toLocaleString('vi-VN')}₫
💳 <b>Phương thức:</b> ${METHOD_LABEL[method]}
👤 <b>Khách hàng:</b> ${order.customerName || 'N/A'}
📧 <b>Email:</b> ${order.customerEmail || 'N/A'}
📞 <b>SĐT:</b> ${order.customerPhone || 'N/A'}
📝 <b>Ghi chú:</b> ${order.customerNotes || 'Không có'}

⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}

⚠️ <b>Trạng thái:</b> Chờ thanh toán`,
          visitorId: `order-${order.orderId}`,
          isReply: false,
        }),
      }).catch(() => undefined);
    } catch {
      /* noop */
    }

    setSuccess({ orderId, method, createdAt: order.createdAt });
  };

  const handleInfoChange = (next: CheckoutCustomerInfo) => {
    setInfo(next);
    setErrors((prev) => {
      const c = { ...prev };
      if (c.name && next.name.trim()) delete c.name;
      if (c.email && next.email.trim() && isValidEmail(next.email)) delete c.email;
      if (c.phone && next.phone.trim() && isValidPhone(next.phone)) delete c.phone;
      return c;
    });
  };

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-scroll fixed inset-0 z-[120] flex items-stretch justify-center overflow-y-auto overscroll-contain bg-slate-950/80 px-0 py-0 backdrop-blur-md sm:items-center sm:px-4 sm:py-6 lg:px-8"
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-slate-950/95 shadow-[0_30px_120px_-30px_rgba(2,6,23,0.95)] ring-1 ring-white/5 sm:my-0 sm:min-h-0 sm:rounded-[28px] lg:rounded-[32px]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-md sm:static sm:gap-4 sm:px-6 sm:py-5 sm:backdrop-blur-none lg:px-8 lg:py-6">
          <div className="flex-1 space-y-2.5 sm:space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 sm:px-3">
              Thanh toán an toàn · 256-bit SSL
            </span>
            <h1 className="text-lg font-extrabold leading-tight text-white sm:text-2xl">
              {success ? 'Đặt hàng thành công' : 'Hoàn tất đơn hàng của bạn'}
            </h1>
            <StepIndicator step={step} success={Boolean(success)} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <div className="relative grid gap-0 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* Summary */}
          <div className="border-b border-white/10 p-4 sm:p-6 md:border-b-0 md:border-r md:p-7 lg:p-8">
            <PlanSummaryPanel
              pkg={pkg}
              paymentLabel={success ? METHOD_LABEL[success.method] : METHOD_LABEL[method]}
              compact={success ? true : false}
            />
          </div>

          {/* Step content */}
          <div className="p-4 sm:p-6 md:p-7 lg:p-8">
            {success ? (
              <SuccessPanel
                pkg={pkg}
                orderId={success.orderId}
                customerName={info.name}
                customerEmail={info.email}
                customerPhone={info.phone}
                paymentLabel={METHOD_LABEL[success.method]}
                onClose={onClose}
              />
            ) : step === 'customer' ? (
              <CustomerStep
                info={info}
                errors={errors}
                onChange={handleInfoChange}
                onEmailBlur={handleEmailBlur}
                onPhoneBlur={handlePhoneBlur}
                onContinue={handleContinueCustomer}
                isValid={isFormValid}
              />
            ) : step === 'method' ? (
              <PaymentStep
                method={method}
                onChange={setMethod}
                available={available}
                onBack={() => setStep('customer')}
                onContinue={handleContinueMethod}
              />
            ) : (
              <QRStep
                method={method}
                pkgPrice={pkg.price}
                pkgName={pkg.name}
                email={info.email}
                settings={settings}
                content={paymentContent}
                onBack={() => setStep('method')}
                onComplete={handleCompleteOrder}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-white/10 bg-slate-950/95 px-4 py-3 text-[11px] text-white/55 backdrop-blur-md sm:static sm:bg-white/[0.02] sm:px-6 sm:backdrop-blur-none lg:px-8">
          <span className="truncate">Mạng Việt Nam · Hỗ trợ 24/7</span>
          <span className="font-semibold text-white/80">Tổng: {formatVND(pkg.price)}</span>
        </div>
      </div>
    </div>
  );
}