'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Package } from '@/types';
import CustomerInfoForm from './PaymentModal/CustomerInfoForm';
import PaymentMethodSelector from './PaymentModal/PaymentMethodSelector';
import { addOrderToServer } from '@/lib/useOrders';

interface PaymentModalProps {
  pkg: Package;
  onClose: () => void;
}

export default function PaymentModal({ pkg, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'customer-info' | 'payment-method' | 'payment-qr'>('customer-info');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Memoize payment settings to avoid repeated localStorage reads
  const paymentSettings = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const settings = localStorage.getItem('adminSettings');
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (e) {
      console.error('Error loading payment settings:', e);
    }
    return null;
  }, []); // Only read once on mount
  
  // Initialize payment method based on settings
  const getInitialPaymentMethod = useCallback((): 'momo' | 'zalopay' | 'bank' => {
    if (!paymentSettings) return 'momo';
    // Priority: MoMo > ZaloPay > Bank
    if (paymentSettings.paymentQRCodes?.momo) {
      return 'momo';
    } else if (paymentSettings.paymentQRCodes?.zalopay) {
      return 'zalopay';
    } else if (paymentSettings.bankInfo?.bankName && paymentSettings.bankInfo?.accountNumber) {
      return 'bank';
    }
    return 'momo'; // Default to MoMo if no settings
  }, [paymentSettings]);
  
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'zalopay' | 'bank'>(() => getInitialPaymentMethod());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
  const [copiedContent, setCopiedContent] = useState(false);

  // Generate payment content - memoized
  const getPaymentContent = useCallback(() => {
    return `THANHTOAN ${pkg.name.replace(/\s+/g, '').toUpperCase()}`;
  }, [pkg.name]);

  // Memoize bank QR URL calculation
  const bankQRUrlData = useMemo(() => {
    if (!paymentSettings?.bankInfo?.accountNumber) return null;
    
    const accountNumber = paymentSettings.bankInfo.accountNumber || '';
    const isAccountNumberUrl = accountNumber.startsWith('http://') || accountNumber.startsWith('https://') || accountNumber.startsWith('data:image');
    
    let bankQRUrl = paymentSettings.bankInfo.qrCodeUrl || '';
    if (!bankQRUrl && isAccountNumberUrl) {
      bankQRUrl = accountNumber;
    }
    
    const dynamicQRUrl = bankQRUrl && bankQRUrl.includes('vietqr.io') 
      ? `${bankQRUrl}?amount=${pkg.price}&addInfo=${encodeURIComponent(`Thanh toan goi ${pkg.name}`)}`
      : bankQRUrl;
    
    return {
      accountNumber,
      isAccountNumberUrl,
      dynamicQRUrl,
    };
  }, [paymentSettings, pkg.price, pkg.name]);

  // Copy payment content to clipboard
  const handleCopyContent = async () => {
    const content = getPaymentContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  // Auto-select Vietnam payment method if configured
  useEffect(() => {
    if (step === 'payment-method' && paymentSettings) {
      // Check for Vietnam payment methods (priority: MoMo > ZaloPay > Bank)
      if (paymentSettings.paymentQRCodes?.momo) {
        setPaymentMethod('momo');
      } else if (paymentSettings.paymentQRCodes?.zalopay) {
        setPaymentMethod('zalopay');
      } else if (paymentSettings.bankInfo?.bankName && paymentSettings.bankInfo?.accountNumber) {
        setPaymentMethod('bank');
      }
    }
  }, [step, paymentSettings]);


  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate phone number (Vietnam format: 10 digits, can start with 0)
  const isValidPhone = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's 10 digits and starts with 0
    return cleaned.length === 10 && cleaned.startsWith('0');
  };

  const isFormValid = () => {
    return (
      customerInfo.name.trim() !== '' &&
      customerInfo.email.trim() !== '' &&
      isValidEmail(customerInfo.email) &&
      customerInfo.phone.trim() !== '' &&
      isValidPhone(customerInfo.phone)
    );
  };

  const validateCustomerInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!isValidEmail(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ. Ví dụ: nguyenvana@gmail.com';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!isValidPhone(customerInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số, bắt đầu bằng 0. Ví dụ: 0123456789';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation on blur
  const handleEmailBlur = () => {
    if (customerInfo.email.trim() && !isValidEmail(customerInfo.email)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ. Ví dụ: nguyenvana@gmail.com' }));
    } else if (customerInfo.email.trim() && isValidEmail(customerInfo.email)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handlePhoneBlur = () => {
    if (customerInfo.phone.trim() && !isValidPhone(customerInfo.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số, bắt đầu bằng 0' }));
    } else if (customerInfo.phone.trim() && isValidPhone(customerInfo.phone)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    if (validateCustomerInfo()) {
      setStep('payment-method');
    }
  };

  // Chuyển sang bước hiện QR code để thanh toán
  const handleContinueToPayment = () => {
    setStep('payment-qr');
  };

  // Hoàn tất đơn hàng sau khi khách đã thanh toán
  const handleCompleteOrder = async () => {
    // Vietnam Payment Methods (MoMo, ZaloPay, Bank) - Save order after payment
    if (paymentMethod === 'momo' || paymentMethod === 'zalopay' || paymentMethod === 'bank') {
      const order = {
        orderId: `ORD-${Date.now()}`,
        planId: pkg.id,
        packageId: pkg.id, // Alias for compatibility
        planName: pkg.name,
        packageName: pkg.name, // Alias for compatibility
        carrier: pkg.carrier,
        price: pkg.price,
        amount: pkg.price, // Alias for compatibility
        paymentMethod,
        status: 'pending' as const,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerNotes: '',
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        notes: '',
        createdAt: new Date().toISOString(),
      };

      // QUAN TRỌNG: Gửi đơn hàng lên server ngay lập tức để đồng bộ với tất cả thiết bị
      try {
        const success = await addOrderToServer(order);
        if (!success) {
          // Nếu gửi lên server thất bại, vẫn lưu vào localStorage để không mất dữ liệu
          console.warn('Failed to save order to server, saving to localStorage only');
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push(order);
          localStorage.setItem('orders', JSON.stringify(orders));
        }
        // Nếu thành công, addOrderToServer đã tự động load lại từ server và cập nhật localStorage
      } catch (error) {
        console.error('Error saving order:', error);
        // Fallback: lưu vào localStorage nếu có lỗi
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      // Send Telegram notification for new Vietnam payment order (non-blocking)
      const paymentMethodNames: Record<string, string> = {
        momo: 'MoMo',
        zalopay: 'ZaloPay',
        bank: 'Chuyển Khoản Ngân Hàng',
      };
      
      fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: order.customerName || 'Unknown',
          email: order.customerEmail || 'Not provided',
          message: `🛒 <b>Đơn Hàng Mới - ${paymentMethodNames[paymentMethod]}</b>

📦 <b>Mã đơn:</b> ${order.orderId}
📱 <b>Gói:</b> ${order.planName}
🏢 <b>Nhà mạng:</b> ${order.carrier}
💰 <b>Số tiền:</b> ${order.price.toLocaleString('vi-VN')}₫
💳 <b>Phương thức:</b> ${paymentMethodNames[paymentMethod]}
👤 <b>Khách hàng:</b> ${order.customerName || 'N/A'}
📧 <b>Email:</b> ${order.customerEmail || 'N/A'}
📞 <b>SĐT:</b> ${order.customerPhone || 'N/A'}
📝 <b>Ghi chú:</b> ${order.customerNotes || 'Không có'}

⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}

⚠️ <b>Trạng thái:</b> Chờ thanh toán`,
          visitorId: `order-${order.orderId}`,
          isReply: false,
        }),
      }).catch(err => console.error('Failed to send Telegram notification:', err));

      // Show success message in modal
      setSuccessOrder(order);
      setPaymentSuccess(true);
      return;
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    // Limit to 10 digits for Vietnam phone numbers
    const limited = cleaned.slice(0, 10);
    if (limited.length >= 10) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
    }
    return limited;
  };

  const carrierNames: Record<string, string> = {
    verizon: 'Verizon',
    att: 'AT&T',
    tmobile: 'T-Mobile',
    uscellular: 'US Cellular',
    mintmobile: 'Mint Mobile',
    cricket: 'Cricket Wireless',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1f3a] rounded-xl p-2.5 sm:p-6 md:p-8 max-w-2xl w-full max-h-[92vh] sm:max-h-[95vh] overflow-y-auto border border-gray-700 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress indicator - Only show if not success */}
        {!paymentSuccess && (
          <div className="flex items-center justify-center mb-2 sm:mb-4 gap-2">
            <div className={`h-1 rounded-full transition-all duration-300 ${step === 'customer-info' ? 'w-10 bg-gray-300' : 'w-6 bg-gray-600'}`}></div>
            <div className={`h-1 rounded-full transition-all duration-300 ${step === 'payment-method' ? 'w-10 bg-gray-300' : step === 'payment-qr' ? 'w-10 bg-gray-300' : 'w-6 bg-gray-600'}`}></div>
            <div className={`h-1 rounded-full transition-all duration-300 ${step === 'payment-qr' ? 'w-10 bg-gray-300' : 'w-6 bg-gray-600'}`}></div>
              </div>
        )}

        <div className="flex justify-between items-center mb-2 sm:mb-4">
              <div>
            <h2 className="text-sm sm:text-2xl md:text-3xl font-semibold text-white">
              {paymentSuccess ? 'Đơn Hàng Đã Được Xác Nhận' : 
               step === 'payment-qr' ? 'Thanh Toán' : 
               step === 'payment-method' ? 'Chọn Phương Thức Thanh Toán' : 
               'Thông Tin Khách Hàng'}
            </h2>
            {!paymentSuccess && (
              <p className="text-gray-400 text-[9px] sm:text-sm mt-0.5">
                Bước {step === 'customer-info' ? '1' : step === 'payment-method' ? '2' : '3'} / 3
              </p>
            )}
            </div>
            <button
              onClick={onClose}
            className="text-gray-400 hover:text-white text-lg sm:text-2xl transition-colors min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded hover:bg-gray-700"
            >
            ×
            </button>
          </div>

        {/* Plan Summary Card - Only show if not success */}
        {!paymentSuccess && (
          <div className="mb-1.5 sm:mb-4 p-2 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1 uppercase tracking-wide truncate">{carrierNames[pkg.carrier]}</div>
                <h3 className="font-semibold text-sm sm:text-lg mb-0.5 sm:mb-1 text-white truncate">{pkg.name}</h3>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-semibold text-white">
                    {pkg.price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-gray-400 text-[10px] sm:text-sm">/ {pkg.period}</span>
        </div>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                <div className="text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Tổng cộng</div>
                <div className="text-base sm:text-xl font-semibold text-white">{pkg.price.toLocaleString('vi-VN')}₫</div>
              </div>
            </div>
          </div>
        )}

            {paymentSuccess && successOrder ? (
              <div className="space-y-4 sm:space-y-6 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <i className="fas fa-check-circle text-green-400 text-2xl sm:text-4xl"></i>
              </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-green-400 mb-1.5 sm:mb-2">Đặt Hàng Thành Công!</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Đơn hàng của bạn đã được tiếp nhận</p>
            </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 sm:p-6 border border-gray-700 space-y-2 sm:space-y-4 text-left">
                  <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-700 text-xs sm:text-sm">
                    <span className="text-gray-400">Mã đơn hàng:</span>
                    <span className="font-mono text-white font-semibold text-[10px] sm:text-sm truncate ml-2">{successOrder.orderId}</span>
              </div>
                  <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-700 text-xs sm:text-sm">
                    <span className="text-gray-400">Gói cước:</span>
                    <span className="text-white font-semibold truncate ml-2">{successOrder.planName}</span>
              </div>
                  <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-700 text-xs sm:text-sm">
                    <span className="text-gray-400">Nhà mạng:</span>
                    <span className="text-white capitalize truncate ml-2">{carrierNames[successOrder.carrier]}</span>
              </div>
                  <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-700 text-xs sm:text-sm">
                    <span className="text-gray-400">Số tiền:</span>
                    <span className="text-white font-semibold text-base sm:text-xl">{successOrder.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-400">Phương thức thanh toán:</span>
                    <span className="text-orange-400 font-semibold uppercase truncate ml-2">
                      {paymentMethod === 'momo' ? 'MoMo' :
                       paymentMethod === 'zalopay' ? 'ZaloPay' :
                       paymentMethod === 'bank' ? 'Chuyển Khoản Ngân Hàng' :
                       'MoMo'}
                    </span>
            </div>
          </div>

                <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                  >
                    <i className="fas fa-check text-white"></i>
                    <span className="text-white">Hoàn tất</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 'customer-info' ? (
              <CustomerInfoForm
                customerInfo={customerInfo}
                errors={errors}
                onCustomerInfoChange={(info) => {
                  setCustomerInfo(info);
                  // Clear errors when user starts typing
                  if (errors.name && info.name) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.name;
                      return newErrors;
                    });
                  }
                  if (errors.email && info.email) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }
                  if (errors.phone && info.phone) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.phone;
                      return newErrors;
                    });
                  }
                }}
                onEmailBlur={handleEmailBlur}
                onPhoneBlur={handlePhoneBlur}
                onContinue={handleContinue}
                isFormValid={isFormValid}
                formatPhoneNumber={formatPhoneNumber}
              />
        ) : step === 'payment-method' ? (
          <div className="space-y-2 sm:space-y-4">
            <div>
              <h3 className="text-sm sm:text-xl font-semibold mb-0.5 sm:mb-1 text-white">
                Chọn Phương Thức Thanh Toán
              </h3>
              <p className="text-gray-400 text-[10px] sm:text-sm hidden sm:block">Chọn phương thức thanh toán bạn muốn sử dụng</p>
            </div>

            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              availableMethods={{
                momo: !!paymentSettings?.paymentQRCodes?.momo,
                zalopay: !!paymentSettings?.paymentQRCodes?.zalopay,
                bank: !!(paymentSettings?.bankInfo?.bankName && paymentSettings?.bankInfo?.accountNumber),
              }}
            />

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-700 sticky bottom-0 bg-[#1a1f3a] -mx-2.5 sm:-mx-6 md:-mx-8 px-2.5 sm:px-6 md:px-8 pb-2 sm:pb-0 z-10">
              <button
                onClick={() => setStep('customer-info')}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                style={{ color: '#ffffff' }}
              >
                <i className="fas fa-arrow-left" style={{ color: '#ffffff' }}></i>
                <span style={{ color: '#ffffff' }}>Quay lại</span>
              </button>
              {(paymentMethod === 'momo' || paymentMethod === 'zalopay' || paymentMethod === 'bank') && (
                <button
                  onClick={handleContinueToPayment}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px] bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-green-500/50"
                  style={{ color: '#ffffff' }}
                >
                  <i className="fas fa-arrow-right" style={{ color: '#ffffff' }}></i>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Tiếp Tục Thanh Toán</span>
                </button>
              )}
            </div>
          </div>
        ) : step === 'payment-qr' ? (
          <div className="space-y-2 sm:space-y-4">
            {/* MoMo Payment QR */}
            {paymentMethod === 'momo' && paymentSettings?.paymentQRCodes?.momo && (
                  <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
                    <div className="bg-gradient-to-br from-pink-500/10 via-pink-500/10 to-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-mobile-alt text-xl text-white"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-pink-400 mb-2">Thanh Toán MoMo</h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Quét QR code bên dưới bằng ứng dụng MoMo để thanh toán. Số tiền <span className="font-bold text-white">{pkg.price.toLocaleString('vi-VN')}₫</span> sẽ được tự động điền.
                          </p>
                          
                          <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={paymentSettings.paymentQRCodes.momo}
                              alt="MoMo QR Code"
                              className="max-w-[250px] max-h-[250px] w-full h-full object-contain"
                            />
                          </div>
                          
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Số tiền:</span>
                                <span className="ml-2 font-semibold text-white">{pkg.price.toLocaleString('vi-VN')}₫</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Phương thức:</span>
                                <span className="ml-2 font-semibold text-pink-400">MoMo</span>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-700">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-gray-400 text-xs">Nội dung chuyển khoản:</span>
                                  <button
                                    onClick={handleCopyContent}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
                                    title="Sao chép nội dung"
                                  >
                                    {copiedContent ? (
                                      <>
                                        <i className="fas fa-check text-xs"></i>
                                        <span>Đã sao chép</span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-copy text-xs"></i>
                                        <span>Sao chép</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="rounded-lg p-2 border border-gray-600">
                                  <span className="font-mono text-white text-sm font-semibold break-all">
                                    {getPaymentContent()}
                                  </span>
                                </div>
                                <p className="text-yellow-400 text-[10px] mt-1">
                                  <i className="fas fa-exclamation-triangle mr-1"></i>
                                  Vui lòng ghi chú đúng nội dung trên khi thanh toán
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-xs text-yellow-300 flex items-start gap-2">
                              <i className="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                              <span>Vui lòng quét QR code và hoàn tất thanh toán. Chúng tôi sẽ liên hệ với bạn tại <span className="text-white font-semibold">{customerInfo.email || 'email của bạn'}</span> sau khi xác nhận thanh toán.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            )}

            {/* ZaloPay Payment QR */}
            {paymentMethod === 'zalopay' && paymentSettings?.paymentQRCodes?.zalopay && (
                  <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
                    <div className="bg-gradient-to-br from-green-500/10 via-green-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                          <i className="fab fa-zalo text-xl text-white"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-400 mb-2">Thanh Toán ZaloPay</h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Quét QR code bên dưới bằng ứng dụng ZaloPay để thanh toán. Số tiền <span className="font-bold text-white">{pkg.price.toLocaleString('vi-VN')}₫</span> sẽ được tự động điền.
                          </p>
                          
                          <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={paymentSettings.paymentQRCodes.zalopay}
                              alt="ZaloPay QR Code"
                              className="max-w-[250px] max-h-[250px] w-full h-full object-contain"
                            />
                          </div>
                          
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Số tiền:</span>
                                <span className="ml-2 font-semibold text-white">{pkg.price.toLocaleString('vi-VN')}₫</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Phương thức:</span>
                                <span className="ml-2 font-semibold text-green-400">ZaloPay</span>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-700">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-gray-400 text-xs">Nội dung chuyển khoản:</span>
                                  <button
                                    onClick={handleCopyContent}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
                                    title="Sao chép nội dung"
                                  >
                                    {copiedContent ? (
                                      <>
                                        <i className="fas fa-check text-xs"></i>
                                        <span>Đã sao chép</span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-copy text-xs"></i>
                                        <span>Sao chép</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="rounded-lg p-2 border border-gray-600">
                                  <span className="font-mono text-white text-sm font-semibold break-all">
                                    {getPaymentContent()}
                                  </span>
                                </div>
                                <p className="text-yellow-400 text-[10px] mt-1">
                                  <i className="fas fa-exclamation-triangle mr-1"></i>
                                  Vui lòng ghi chú đúng nội dung trên khi thanh toán
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-xs text-yellow-300 flex items-start gap-2">
                              <i className="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                              <span>Vui lòng quét QR code và hoàn tất thanh toán. Chúng tôi sẽ liên hệ với bạn tại <span className="text-white font-semibold">{customerInfo.email || 'email của bạn'}</span> sau khi xác nhận thanh toán.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            )}

            {/* Bank Payment QR */}
            {paymentMethod === 'bank' && paymentSettings?.bankInfo?.bankName && paymentSettings?.bankInfo?.accountNumber && bankQRUrlData && (
                  <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
                    <div className="bg-gradient-to-br from-green-500/10 via-green-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-university text-xl text-white"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-400 mb-2">Chuyển Khoản Ngân Hàng</h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Quét QR code hoặc chuyển khoản theo thông tin bên dưới. Số tiền: <span className="font-bold text-white">{pkg.price.toLocaleString('vi-VN')}₫</span>
                          </p>
                          
                          {bankQRUrlData.dynamicQRUrl && (
                            <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={bankQRUrlData.dynamicQRUrl}
                                alt="QR Code Chuyển Khoản"
                                className="max-w-[250px] max-h-[250px] w-full h-full object-contain"
                                onError={(e) => {
                                  // Nếu load ảnh lỗi, ẩn div chứa QR code
                                  const target = e.target as HTMLImageElement;
                                  if (target.parentElement) {
                                    target.parentElement.style.display = 'none';
                                  }
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-3">
                            {paymentSettings.bankInfo.bankName && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Ngân hàng:</span>
                                <span className="font-semibold text-white text-sm">{paymentSettings.bankInfo.bankName}</span>
                              </div>
                            )}
                            {bankQRUrlData.accountNumber && !bankQRUrlData.isAccountNumberUrl && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Số tài khoản:</span>
                                <span className="font-semibold text-white text-sm font-mono">{bankQRUrlData.accountNumber}</span>
                              </div>
                            )}
                            {paymentSettings.bankInfo.accountHolder && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Chủ tài khoản:</span>
                                <span className="font-semibold text-white text-sm uppercase">{paymentSettings.bankInfo.accountHolder}</span>
                              </div>
                            )}
                            {paymentSettings.bankInfo.branch && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Chi nhánh:</span>
                                <span className="font-semibold text-white text-sm">{paymentSettings.bankInfo.branch}</span>
                              </div>
                            )}
                            <div className="pt-3 border-t border-gray-700">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Số tiền:</span>
                                <span className="font-semibold text-white text-lg">{pkg.price.toLocaleString('vi-VN')}₫</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-gray-400 text-xs">Nội dung chuyển khoản:</span>
                                  <button
                                    onClick={handleCopyContent}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
                                    title="Sao chép nội dung"
                                  >
                                    {copiedContent ? (
                                      <>
                                        <i className="fas fa-check text-xs"></i>
                                        <span>Đã sao chép</span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-copy text-xs"></i>
                                        <span>Sao chép</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="rounded-lg p-2 border border-gray-600">
                                  <span className="font-mono text-white text-sm font-semibold break-all">
                                    {getPaymentContent()}
                                  </span>
                                </div>
                                <p className="text-yellow-400 text-[10px] mt-1">
                                  <i className="fas fa-exclamation-triangle mr-1"></i>
                                  Vui lòng ghi chú đúng nội dung trên khi chuyển khoản
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-xs text-yellow-300 flex items-start gap-2">
                              <i className="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                              <span>Vui lòng chuyển khoản đúng số tiền và ghi chú nội dung chuyển khoản. Chúng tôi sẽ liên hệ với bạn tại <span className="text-white font-semibold">{customerInfo.email || 'email của bạn'}</span> sau khi xác nhận thanh toán.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            )}


            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-700 sticky bottom-0 bg-[#1a1f3a] -mx-2.5 sm:-mx-6 md:-mx-8 px-2.5 sm:px-6 md:px-8 pb-2 sm:pb-0 z-10">
              <button
                onClick={() => setStep('payment-method')}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                style={{ color: '#ffffff' }}
              >
                <i className="fas fa-arrow-left" style={{ color: '#ffffff' }}></i>
                <span style={{ color: '#ffffff' }}>Quay lại</span>
              </button>
              {(paymentMethod === 'momo' || paymentMethod === 'zalopay' || paymentMethod === 'bank') && (
                <button
                  onClick={handleCompleteOrder}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px] bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-green-500/50"
                  style={{ color: '#ffffff' }}
                >
                  <i className="fas fa-check-circle" style={{ color: '#ffffff' }}></i>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Hoàn Tất Đơn Hàng</span>
                </button>
              )}
            </div>
          </div>
                ) : null}
              </>
            )}
      </div>
    </div>
  );
}

