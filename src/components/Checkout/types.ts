export type CheckoutStep = 'customer' | 'method' | 'qr';

export interface CheckoutSettingsShape {
  paymentQRCodes?: { momo?: string; zalopay?: string };
  bankInfo?: {
    bankName?: string;
    qrCodeUrl?: string;
    accountNumber?: string;
    accountHolder?: string;
    branch?: string;
  };
}

export interface CheckoutCustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export type CheckoutMethod = 'momo' | 'zalopay' | 'bank';

export const STEPS: { id: CheckoutStep; index: number; title: string; subtitle: string }[] = [
  { id: 'customer', index: 1, title: 'Thông tin', subtitle: 'Xác nhận liên hệ' },
  { id: 'method', index: 2, title: 'Thanh toán', subtitle: 'Chọn phương thức' },
  { id: 'qr', index: 3, title: 'Hoàn tất', subtitle: 'Quét QR / chuyển khoản' },
];

export const VIET_CARRIERS: Record<string, string> = {
  viettel: 'Viettel',
  vinaphone: 'Vinaphone',
  mobifone: 'MobiFone',
  vietnamobile: 'Vietnamobile',
  gmobile: 'Gmobile',
  itel: 'iTel',
  wintel: 'Wintel',
  vnsky: 'VNSKY',
  local: 'Mạng nội địa',
  verizon: 'Verizon',
  att: 'AT&T',
  tmobile: 'T-Mobile',
  uscellular: 'US Cellular',
  mintmobile: 'Mint Mobile',
  cricket: 'Cricket Wireless',
};

export function formatVND(value: number) {
  return `${value.toLocaleString('vi-VN')}₫`;
}

export function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  if (cleaned.length >= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  return cleaned;
}
