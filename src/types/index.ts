export interface Package {
  id: string;
  carrier: 'verizon' | 'att' | 'tmobile' | 'uscellular' | 'mintmobile' | 'cricket' | 'Viettel' | 'Vinaphone' | 'MobiFone' | 'Vietnamobile' | 'Gmobile' | 'iTel' | 'Wintel' | 'VNSKY' | 'Local';
  name: string;
  price: number;
  originalPrice?: number;
  period?: 'month' | 'year';
  data: string;
  speed: string;
  validity?: string;
  callMinutes?: string;
  sms?: string;
  hotspot?: boolean;
  features: string[];
  badge?: string;
  description?: string;
}

export interface Order {
  orderId: string;
  id?: string; // Alias for orderId for backward compatibility
  planId?: string;
  packageId?: string;
  planName?: string;
  packageName?: string;
  carrier: string;
  price: number;
  amount?: number; // Alias for price
  paymentMethod: 'paypal' | 'crypto' | 'fpayment' | 'momo' | 'zalopay' | 'bank';
  status: 'pending' | 'completed' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNotes?: string;
  // Backward compatibility
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  isRead?: boolean;
  // Payment verification
  paymentId?: string;
  transactionHash?: string;
  paymentVerified?: boolean;
  verifiedAt?: string;
}

export interface AdminSettings {
  adminUsername?: string;
  adminPassword?: string;
  websiteName?: string;
  websiteLogo?: string; // Base64 encoded logo
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  businessHours?: string;
  description?: string;
  zalo?: string;
  facebook?: string;
  paypalEnabled?: boolean;
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalMode?: 'sandbox' | 'live';
  paypalCurrency?: string;
  paypalReturnUrl?: string;
  paypalCancelUrl?: string;
  cryptoEnabled?: boolean;
  cryptoGateway?: string;
  bitcoinAddress?: string;
  ethereumAddress?: string;
  ethereumNetwork?: 'ethereum' | 'bsc';
  usdtAddress?: string;
  usdtNetwork?: 'tron';
  bnbAddress?: string;
  bnbNetwork?: 'bsc';
  apiKey?: string;
  defaultLanguage?: string;
  autoApproveOrders?: boolean;
  emailNotifications?: boolean;
  ordersPerPage?: number;
  carrierLogos?: {
    verizon?: string;
    att?: string;
    tmobile?: string;
    uscellular?: string;
    mintmobile?: string;
    cricket?: string;
  };
  paymentLogos?: {
    momo?: string;
    zalopay?: string;
  };
  paymentQRCodes?: {
    momo?: string;
    zalopay?: string;
  };
  bankInfo?: {
    bankName?: string;
    qrCodeUrl?: string; // URL ảnh QR code từ VietQR (VD: https://img.vietqr.io/image/...)
    accountNumber?: string;
    accountHolder?: string;
    branch?: string;
  };
  telegramBotToken?: string;
  telegramChatId?: string;
  fpaymentEnabled?: boolean;
  fpaymentMerchantId?: string;
  fpaymentApiKey?: string;
  fpaymentMode?: 'sandbox' | 'live';
}

export interface WebsiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    title: string;
    content: string;
  };
  contact: {
    title: string;
    content: string;
  };
}



