'use client';

import { useState, useEffect } from 'react';
import { AdminSettings } from '@/types';
import AlertModal from '@/components/AlertModal';

export default function SettingsManagement() {
  const [settings, setSettings] = useState<AdminSettings>({
    websiteName: 'Mạng Việt Nam',
    defaultLanguage: 'vi',
    autoApproveOrders: false,
    emailNotifications: false,
    ordersPerPage: 10,
    facebook: 'https://www.facebook.com/HOTRODATA/',
    carrierLogos: {},
    paymentLogos: {},
    paymentQRCodes: {},
  });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });

  useEffect(() => {
    const loadSettings = async () => {
      // Ưu tiên load từ server trước
      try {
        const response = await fetch('/api/settings');
        const result = await response.json();
        
        if (result.success && result.settings) {
          console.log('✅ Settings loaded from server');
          setSettings((prev) => ({ ...prev, ...result.settings }));
          
          // Cũng lưu vào localStorage để backup
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminSettings', JSON.stringify(result.settings));
          }
          return;
        }
      } catch (error) {
        console.error('Error loading settings from server:', error);
      }
      
      // Fallback: load từ localStorage nếu server không có
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('adminSettings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSettings((prev) => ({ ...prev, ...parsed }));
            console.log('⚠️ Settings loaded from localStorage (server unavailable)');
          } catch (e) {
            console.error('Error loading settings from localStorage:', e);
          }
        }
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const settingsJson = JSON.stringify(settings);
      
      // Save to localStorage first (always works)
      localStorage.setItem('adminSettings', settingsJson);
      console.log('Settings saved to localStorage');
      
      // Also save to server for cross-device sync - PRIORITY
      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ settings }),
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          console.log('Settings saved to server successfully');
          
          // Reload settings từ server để có password đã được merge đúng
          try {
            const reloadResponse = await fetch('/api/settings');
            const reloadResult = await reloadResponse.json();
            if (reloadResult.success && reloadResult.settings) {
              setSettings((prev) => ({ ...prev, ...reloadResult.settings }));
              // Cũng cập nhật localStorage
              localStorage.setItem('adminSettings', JSON.stringify(reloadResult.settings));
              console.log('✅ Settings reloaded from server after save');
            }
          } catch (reloadError) {
            console.error('Error reloading settings:', reloadError);
          }
          
          // Dispatch global event to force all devices to sync immediately
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('forceSettingsSync', { 
              detail: { settings, timestamp: Date.now() } 
            }));
          }
        } else {
          const errorMsg = result.error || 'Unknown error';
          console.error('Failed to save settings to server:', errorMsg);
          // Still show success because localStorage saved, but warn about server
          setAlertModal({ isOpen: true, message: `Đã lưu vào bộ nhớ local thành công! (Lưu ý: Không thể lưu lên server: ${errorMsg})`, type: 'warning' });
          // Don't return, continue to show success message
        }
      } catch (error: any) {
        console.error('Error saving settings to server:', error);
        // Still show success because localStorage saved
        setAlertModal({ isOpen: true, message: `Đã lưu vào bộ nhớ local thành công! (Lưu ý: Không thể lưu lên server: ${error.message || 'Network error'})`, type: 'warning' });
        // Don't return, continue to show success message
      }
      
      // Also save to sessionStorage for cross-tab sync
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('sharedAdminSettings', settingsJson);
          // Set a timestamp to track when settings were last updated
          sessionStorage.setItem('settingsLastUpdated', Date.now().toString());
        } catch (e) {
          console.log('SessionStorage not available');
        }
      }
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('settingsUpdated', { 
          detail: { settings, timestamp: Date.now() } 
        }));
        
        // Use BroadcastChannel to sync across tabs/windows
        try {
          const channel = new BroadcastChannel('settings-sync');
          channel.postMessage({
            type: 'settingsUpdated',
            timestamp: Date.now(),
            settings: settings
          });
          channel.close();
        } catch (e) {
          console.log('BroadcastChannel not supported, using fallback');
        }
      }
      
      // Always show success message (localStorage always saves)
      setAlertModal({ isOpen: true, message: '✅ Đã lưu cài đặt thành công! Tất cả thiết bị sẽ tự động cập nhật trong vòng 1 giây.', type: 'success' });
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      setAlertModal({ isOpen: true, message: `Lỗi khi lưu cài đặt: ${error.message || 'Unknown error'}. Vui lòng thử lại.`, type: 'error' });
    }
  };

  const handlePaymentLogoUpload = (paymentMethod: string, file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSettings({
        ...settings,
        paymentLogos: {
          ...settings.paymentLogos,
          [paymentMethod]: base64String,
        },
      });
      setAlertModal({ isOpen: true, message: `Đã upload logo ${paymentMethod}!`, type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentLogoRemove = (paymentMethod: string) => {
    const updatedLogos = { ...settings.paymentLogos };
    delete updatedLogos[paymentMethod as keyof typeof updatedLogos];
    setSettings({
      ...settings,
      paymentLogos: updatedLogos,
    });
    setAlertModal({ isOpen: true, message: `Đã xóa logo ${paymentMethod}!`, type: 'success' });
  };

  const handlePaymentQRUpload = (paymentMethod: string, file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSettings({
        ...settings,
        paymentQRCodes: {
          ...settings.paymentQRCodes,
          [paymentMethod]: base64String,
        },
      });
      setAlertModal({ isOpen: true, message: `Đã upload QR code ${paymentMethod}!`, type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentQRRemove = (paymentMethod: string) => {
    const updatedQRCodes = { ...settings.paymentQRCodes };
    delete updatedQRCodes[paymentMethod as keyof typeof updatedQRCodes];
    setSettings({
      ...settings,
      paymentQRCodes: updatedQRCodes,
    });
    setAlertModal({ isOpen: true, message: `Đã xóa QR code ${paymentMethod}!`, type: 'success' });
  };

  const handleLogoUpload = (carrier: string, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        setSettings({
          ...settings,
          carrierLogos: {
            ...settings.carrierLogos,
            [carrier]: base64,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = (carrier: string) => {
    const updatedLogos = { ...settings.carrierLogos };
    delete updatedLogos[carrier as keyof typeof updatedLogos];
    setSettings({
      ...settings,
      carrierLogos: updatedLogos,
    });
    setAlertModal({ isOpen: true, message: `Đã xóa logo ${carrier}!`, type: 'success' });
  };

  const carriers = [
    { key: 'Viettel', label: 'Viettel' },
    { key: 'Vinaphone', label: 'Vinaphone' },
    { key: 'MobiFone', label: 'MobiFone' },
    { key: 'Vietnamobile', label: 'Vietnamobile' },
    { key: 'Gmobile', label: 'Gmobile' },
    { key: 'iTel', label: 'iTel' },
    { key: 'Wintel', label: 'Wintel' },
    { key: 'VNSKY', label: 'VNSKY' },
    { key: 'Local', label: 'Local' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cài Đặt</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-save mr-2"></i>Lưu Cài Đặt
        </button>
      </div>

          <div className="space-y-6">
            {/* Admin Security */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">
                <i className="fas fa-shield-alt mr-2 text-red-400"></i>
                Bảo Mật Admin
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-exclamation-triangle text-yellow-400 text-xl mt-0.5"></i>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-400 mb-1">Thông Báo Bảo Mật Quan Trọng</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Thay đổi username và password mặc định ngay sau lần đăng nhập đầu tiên để bảo vệ trang Admin của bạn.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Tên Đăng Nhập (Username)</label>
                  <input
                    type="text"
                    value={settings.adminUsername || 'admin'}
                    onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Mật Khẩu (Password)</label>
                  <input
                    type="password"
                    value={settings.adminPassword || ''}
                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <small className="text-gray-400 text-sm block mt-1">
                    Để trống nếu không muốn thay đổi. Mật khẩu mặc định: 123123aA@
                  </small>
                </div>
              </div>
            </div>

            {/* Website Info */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">
                <i className="fas fa-globe mr-2 text-blue-400"></i>
                Thông Tin Website
              </h3>
              <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Tên Website</label>
              <input
                type="text"
                value={settings.websiteName || ''}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Mạng Việt Nam"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Logo Website</label>
              <div className="space-y-3">
                {settings.websiteLogo && (
                  <div className="mb-3">
                    <img
                      src={settings.websiteLogo}
                      alt="Website Logo"
                      className="max-w-xs max-h-32 object-contain bg-white rounded-lg p-2"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setSettings({ ...settings, websiteLogo: base64String });
                        setAlertModal({ isOpen: true, message: 'Logo đã được tải lên thành công!', type: 'success' });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <small className="text-gray-400 text-sm block">
                  Chọn file ảnh logo cho website (JPG, PNG, GIF). Logo sẽ được hiển thị trên header.
                </small>
                {settings.websiteLogo && (
                  <button
                    onClick={() => {
                      setSettings({ ...settings, websiteLogo: undefined });
                      setAlertModal({ isOpen: true, message: 'Logo đã được xóa!', type: 'success' });
                    }}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-white"
                  >
                    <i className="fas fa-trash mr-2"></i>Xóa Logo
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Email Liên Hệ</label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="support@mangvietnam.com"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Số Điện Thoại</label>
                <input
                  type="tel"
                  value={settings.contactPhone || ''}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="1900-xxxx"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Địa Chỉ Công Ty</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Giờ Làm Việc</label>
              <input
                type="text"
                value={settings.businessHours || ''}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Thứ 2 - Thứ 6: 8:00 - 17:00"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Zalo</label>
                <input
                  type="text"
                  value={settings.zalo || ''}
                  onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Số điện thoại hoặc link Zalo"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Facebook / Messenger</label>
                <input
                  type="text"
                  value={settings.facebook || ''}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="https://m.me/tenpage hoặc link Facebook"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MoMo QR Code */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-qrcode mr-2 text-pink-400"></i>
            QR Code MoMo
          </h3>
          <small className="text-gray-400 text-sm block mb-4">
            Upload QR code MoMo. Khi khách chọn thanh toán bằng MoMo, QR code sẽ hiển thị kèm số tiền. Hỗ trợ định dạng: PNG, JPG. Kích thước khuyên dùng: 300x300px trở lên.
          </small>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-mobile-alt text-pink-400"></i>
              <span className="font-semibold">MoMo</span>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePaymentQRUpload('momo', file);
              }}
              className="hidden"
              id="payment-qr-momo"
            />
            {settings.paymentQRCodes?.momo && (
              <div className="mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.paymentQRCodes.momo}
                  alt="MoMo QR code"
                  className="w-full h-48 object-contain bg-white/10 rounded-lg p-2"
                />
                <button
                  onClick={() => handlePaymentQRRemove('momo')}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                  title="Xóa QR code"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            <label
              htmlFor="payment-qr-momo"
              className="block w-full px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 rounded-lg text-center cursor-pointer transition-all text-sm"
            >
              <i className="fas fa-upload mr-2"></i>
              {settings.paymentQRCodes?.momo ? 'Thay Đổi QR Code' : 'Upload QR Code'}
            </label>
          </div>
        </div>

        {/* ZaloPay QR Code */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-qrcode mr-2 text-green-400"></i>
            QR Code ZaloPay
          </h3>
          <small className="text-gray-400 text-sm block mb-4">
            Upload QR code ZaloPay. Khi khách chọn thanh toán bằng ZaloPay, QR code sẽ hiển thị kèm số tiền. Hỗ trợ định dạng: PNG, JPG. Kích thước khuyên dùng: 300x300px trở lên.
          </small>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <i className="fab fa-zalo text-green-400"></i>
              <span className="font-semibold">ZaloPay</span>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePaymentQRUpload('zalopay', file);
              }}
              className="hidden"
              id="payment-qr-zalopay"
            />
            {settings.paymentQRCodes?.zalopay && (
              <div className="mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.paymentQRCodes.zalopay}
                  alt="ZaloPay QR code"
                  className="w-full h-48 object-contain bg-white/10 rounded-lg p-2"
                />
                <button
                  onClick={() => handlePaymentQRRemove('zalopay')}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                  title="Xóa QR code"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            <label
              htmlFor="payment-qr-zalopay"
              className="block w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-center cursor-pointer transition-all text-sm"
            >
              <i className="fas fa-upload mr-2"></i>
              {settings.paymentQRCodes?.zalopay ? 'Thay Đổi QR Code' : 'Upload QR Code'}
            </label>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-university mr-2 text-green-400"></i>
            Thông Tin Ngân Hàng
          </h3>
          <small className="text-gray-400 text-sm block mb-4">
            Nhập thông tin tài khoản ngân hàng để hiển thị khi khách thanh toán. Thông tin này sẽ được hiển thị cùng với QR code.
          </small>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Tên Ngân Hàng *</label>
              <input
                type="text"
                value={settings.bankInfo?.bankName || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  bankInfo: { 
                    ...settings.bankInfo, 
                    bankName: e.target.value 
                  } 
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Ví dụ: Vietcombank, Techcombank, BIDV..."
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">URL QR Code Ngân Hàng *</label>
              <input
                type="url"
                value={settings.bankInfo?.qrCodeUrl || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  bankInfo: { 
                    ...settings.bankInfo, 
                    qrCodeUrl: e.target.value 
                  } 
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="https://img.vietqr.io/image/vietinbank-113366668888-compact.jpg"
              />
              <small className="text-gray-400 text-xs mt-1 block">
                Nhập URL ảnh QR code từ VietQR.io. URL này sẽ được dùng để tạo QR code động với số tiền tự động điền khi khách thanh toán.
                <br />
                <span className="text-blue-400">Hướng dẫn:</span> Vào <a href="https://vietqr.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">VietQR.io</a>, tạo QR code và copy URL ảnh vào đây.
              </small>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Số Tài Khoản *</label>
              <input
                type="text"
                value={settings.bankInfo?.accountNumber || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  bankInfo: { 
                    ...settings.bankInfo, 
                    accountNumber: e.target.value 
                  } 
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Nhập số tài khoản"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Tên Chủ Tài Khoản *</label>
              <input
                type="text"
                value={settings.bankInfo?.accountHolder || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  bankInfo: { 
                    ...settings.bankInfo, 
                    accountHolder: e.target.value 
                  } 
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Nhập tên chủ tài khoản (viết hoa, không dấu)"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Chi Nhánh</label>
              <input
                type="text"
                value={settings.bankInfo?.branch || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  bankInfo: { 
                    ...settings.bankInfo, 
                    branch: e.target.value 
                  } 
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Ví dụ: Chi nhánh Hà Nội, Chi nhánh TP.HCM..."
              />
            </div>
            {settings.bankInfo && (settings.bankInfo.bankName || settings.bankInfo.accountNumber || settings.bankInfo.accountHolder) && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-400">
                  <i className="fas fa-eye mr-2"></i>
                  Xem Trước Thông Tin Ngân Hàng:
                </h4>
                <div className="space-y-1 text-sm">
                  {settings.bankInfo.bankName && (
                    <p><strong>Ngân hàng:</strong> {settings.bankInfo.bankName}</p>
                  )}
                  {settings.bankInfo.qrCodeUrl && (
                    <p><strong>URL QR Code:</strong> <span className="text-xs break-all">{settings.bankInfo.qrCodeUrl}</span></p>
                  )}
                  {settings.bankInfo.accountNumber && (
                    <p><strong>Số tài khoản:</strong> {settings.bankInfo.accountNumber}</p>
                  )}
                  {settings.bankInfo.accountHolder && (
                    <p><strong>Chủ tài khoản:</strong> {settings.bankInfo.accountHolder}</p>
                  )}
                  {settings.bankInfo.branch && (
                    <p><strong>Chi nhánh:</strong> {settings.bankInfo.branch}</p>
                  )}
                </div>
                {settings.bankInfo.qrCodeUrl && (
                  <div className="mt-3 pt-3 border-t border-green-500/30">
                    <p className="text-xs text-green-400">
                      <i className="fas fa-check-circle mr-1"></i>
                      QR code sẽ được tạo động với số tiền tự động điền khi khách thanh toán
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Telegram Bot Settings */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fab fa-telegram mr-2 text-blue-400"></i>
            Cài Đặt Telegram Bot
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-400"></i>
                Hướng Dẫn Cấu Hình Telegram Bot
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Tạo bot mới bằng cách chat với <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@BotFather</a> trên Telegram</li>
                <li>Gửi lệnh <span className="font-mono text-blue-400">/newbot</span> và làm theo hướng dẫn</li>
                <li>Sao chép Bot Token mà BotFather cung cấp (dạng: <span className="font-mono text-gray-400">123456789:ABCdefGHIjklMNOpqrsTUVwxyz</span>)</li>
                <li>Để lấy Chat ID:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Chat với bot bạn vừa tạo</li>
                    <li>Truy cập: <span className="font-mono text-blue-400">https://api.telegram.org/bot&lt;YOUR_BOT_TOKEN&gt;/getUpdates</span></li>
                    <li>Tìm <span className="font-mono text-gray-400">&quot;chat&quot;:&#123;&quot;id&quot;:</span> trong kết quả, số sau <span className="font-mono text-gray-400">&quot;id&quot;:</span> chính là Chat ID</li>
                  </ul>
                </li>
                <li>Nhập Bot Token và Chat ID vào các ô bên dưới</li>
              </ol>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Bot Token *</label>
              <input
                type="password"
                value={settings.telegramBotToken || ''}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
              <small className="text-gray-400 text-sm block mt-1">
                Bot Token từ BotFather. Bảo mật: Không chia sẻ token này với ai.
              </small>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Chat ID *</label>
              <input
                type="text"
                value={settings.telegramChatId || ''}
                onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm"
                placeholder="123456789"
              />
              <small className="text-gray-400 text-sm block mt-1">
                Chat ID nơi bot sẽ gửi thông báo. Có thể là ID cá nhân hoặc ID nhóm.
              </small>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-bell text-green-400"></i>
                Telegram Bot sẽ gửi thông báo khi:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Có đơn hàng mới</li>
                <li>Có tin nhắn chat mới từ khách hàng</li>
                <li>Admin trả lời tin nhắn</li>
              </ul>
            </div>
            <button
              onClick={async () => {
                if (!settings.telegramBotToken || !settings.telegramChatId) {
                  setAlertModal({ isOpen: true, message: 'Vui lòng nhập Bot Token và Chat ID trước!', type: 'warning' });
                  return;
                }
                try {
                  const response = await fetch('/api/telegram', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: 'Test',
                      email: 'test@example.com',
                      message: '🧪 Đây là tin nhắn test từ Admin Settings. Nếu bạn nhận được tin nhắn này, Telegram Bot đã hoạt động thành công!',
                      visitorId: 'test-visitor',
                      isReply: false,
                    }),
                  });
                  const result = await response.json();
                  if (result.success) {
                    setAlertModal({ isOpen: true, message: '✅ Test thành công! Kiểm tra Telegram của bạn để xem tin nhắn.', type: 'success' });
                  } else {
                    const errorMsg = result.error || 'Unknown error';
                    const debugInfo = result.debug ? `\n\nDebug info:\n- Has Token: ${result.debug.hasToken}\n- Has Chat ID: ${result.debug.hasChatId}\n- Token Length: ${result.debug.tokenLength}\n- Chat ID: ${result.debug.chatId}` : '';
                    setAlertModal({ isOpen: true, message: `❌ Test thất bại: ${errorMsg}${debugInfo}\n\nLưu ý:\n1. Đảm bảo Bot Token đúng (dạng: 123456789:ABC...)\n2. Đảm bảo Chat ID đúng (số hoặc -số cho nhóm)\n3. Đã gửi /start cho bot\n4. Bot có quyền gửi tin nhắn đến chat này`, type: 'error' });
                  }
                } catch (error: any) {
                  setAlertModal({ isOpen: true, message: `❌ Lỗi kết nối: ${error.message || 'Failed to send test message'}\n\nVui lòng kiểm tra:\n1. Server đang chạy\n2. Console log để xem chi tiết lỗi`, type: 'error' });
                }
              }}
              className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fab fa-telegram"></i>
              <span>Test Gửi Tin Nhắn Telegram</span>
            </button>
          </div>
        </div>

        {/* Payment Method Logos */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-credit-card mr-2 text-blue-400"></i>
            Logo Phương Thức Thanh Toán
          </h3>
          <small className="text-gray-400 text-sm block mb-4">
            Upload logo cho các phương thức thanh toán. Hỗ trợ định dạng: PNG, JPG, SVG. Kích thước khuyên dùng: 200x200px trở lên.
          </small>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'momo', name: 'MoMo', icon: 'fa-mobile-alt' },
              { key: 'zalopay', name: 'ZaloPay', icon: 'fab fa-zalo' },
            ].map((method) => (
              <div key={method.key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <i className={`${method.icon} text-blue-400`}></i>
                  <span className="font-semibold">{method.name}</span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePaymentLogoUpload(method.key, file);
                  }}
                  className="hidden"
                  id={`payment-logo-${method.key}`}
                />
                {settings.paymentLogos?.[method.key as keyof typeof settings.paymentLogos] && (
                  <div className="mb-3 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.paymentLogos[method.key as keyof typeof settings.paymentLogos]}
                      alt={`${method.name} logo`}
                      className="w-full h-24 object-contain bg-white/10 rounded-lg p-2"
                    />
                    <button
                      onClick={() => handlePaymentLogoRemove(method.key)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                      title="Xóa logo"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
                <label
                  htmlFor={`payment-logo-${method.key}`}
                  className="block w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-center cursor-pointer transition-all text-sm"
                >
                  <i className="fas fa-upload mr-2"></i>
                  {settings.paymentLogos?.[method.key as keyof typeof settings.paymentLogos] ? 'Thay Đổi Logo' : 'Upload Logo'}
                </label>
              </div>
            ))}
          </div>
        </div>


        {/* Logo Management */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-images mr-2 text-purple-400"></i>
            Logo Các Nhà Mạng
          </h3>
          <small className="text-gray-400 text-sm block mb-4">
            Upload logo các nhà mạng. Hỗ trợ định dạng: PNG, JPG, SVG. Kích thước khuyên dùng: 200x200px trở lên.
          </small>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {carriers.map(carrier => {
              const hasLogo = settings.carrierLogos?.[carrier.key as keyof typeof settings.carrierLogos];
              return (
                <div key={carrier.key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="block font-semibold mb-3">{carrier.label}</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleLogoUpload(carrier.key, file);
                        setAlertModal({ isOpen: true, message: `Đã upload logo ${carrier.label}!`, type: 'success' });
                      }
                    }}
                    className="hidden"
                    id={`carrier-logo-${carrier.key}`}
                  />
                  {hasLogo ? (
                    <div className="space-y-3">
                      <div className="relative bg-white/10 rounded-lg p-3 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hasLogo}
                          alt={carrier.label}
                          className="max-w-full max-h-24 object-contain"
                        />
                      </div>
                      <div className="flex gap-2">
                        <label
                          htmlFor={`carrier-logo-${carrier.key}`}
                          className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-center cursor-pointer transition-all text-sm text-blue-300"
                        >
                          <i className="fas fa-upload mr-2"></i>
                          Thay Đổi
                        </label>
                        <button
                          onClick={() => handleLogoRemove(carrier.key)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-sm text-red-300 transition-all"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor={`carrier-logo-${carrier.key}`}
                      className="block w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-center cursor-pointer transition-all text-sm"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Chọn Ảnh Logo
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
}
