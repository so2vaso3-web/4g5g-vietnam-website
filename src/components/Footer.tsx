'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadSettings = () => {
        const saved = localStorage.getItem('adminSettings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            
            const methods = [];
            if (parsed.paymentLogos?.momo || parsed.paymentQRCodes?.momo) {
              methods.push({
                name: 'MoMo',
                icon: 'fas fa-wallet',
                color: 'text-pink-600',
              });
            }
            if (parsed.paymentLogos?.zalopay || parsed.paymentQRCodes?.zalopay) {
              methods.push({
                name: 'ZaloPay',
                icon: 'fas fa-mobile-alt',
                color: 'text-blue-600',
              });
            }
            setPaymentMethods(methods);
          } catch (e) {
            console.error('Error loading settings:', e);
          }
        }
      };

      loadSettings();
      window.addEventListener('storage', loadSettings);
      window.addEventListener('settingsUpdated', loadSettings);
      
      const interval = setInterval(loadSettings, 1000);
      
      return () => {
        window.removeEventListener('storage', loadSettings);
        window.removeEventListener('settingsUpdated', loadSettings);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <footer className="bg-white border-t border-medium-gray text-dark-gray py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-medium-gray">
          {/* Brand section */}
          <div>
            <h3 className="text-2xl font-vietnam font-900 mb-4">
              <span className="gradient-text-primary">Mạng Việt Nam</span>
            </h3>
            <p className="text-text-light text-base leading-relaxed mb-6">
              Địa chỉ bán gói cước 4G/5G uy tín từ 9 nhà mạng hàng đầu Việt Nam. Chúng tôi cam kết cung cấp dịch vụ tốt nhất.
            </p>
            {settings.facebook && (
              <div className="flex gap-3">
                <a 
                  href={settings.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-light-gray hover:bg-gradient-primary text-dark-gray hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-soft hover:shadow-soft-blue"
                >
                  <i className="fab fa-facebook text-lg group-hover:scale-125 transition-transform"></i>
                </a>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-vietnam font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-primary rounded-full"></span>
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-text-light hover:text-primary-blue transition-colors font-medium">
                  ↗ Trang Chủ
                </a>
              </li>
              <li>
                <a href="#plans" className="text-text-light hover:text-primary-blue transition-colors font-medium">
                  ↗ Gói Cước
                </a>
              </li>
              <li>
                <a href="#about" className="text-text-light hover:text-primary-blue transition-colors font-medium">
                  ↗ Giới Thiệu
                </a>
              </li>
              <li>
                <a href="#contact" className="text-text-light hover:text-primary-blue transition-colors font-medium">
                  ↗ Liên Hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="text-lg font-vietnam font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-secondary rounded-full"></span>
              Hỗ Trợ
            </h4>
            <ul className="space-y-4">
              {settings.contactPhone && (
                <li className="text-text-light">
                  <span className="font-vietnam font-bold block text-dark-gray mb-1">Hotline</span>
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-primary-blue transition-colors">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className="text-text-light">
                  <span className="font-vietnam font-bold block text-dark-gray mb-1">Email</span>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary-blue transition-colors break-all">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.zalo && (
                <li className="text-text-light">
                  <span className="font-vietnam font-bold block text-dark-gray mb-1">Zalo</span>
                  <a href={settings.zalo} target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue transition-colors">
                    Chat ngay
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-vietnam font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent-teal rounded-full"></span>
              Thông Tin
            </h4>
            <p className="text-text-light text-sm mb-4">
              Nhận thông tin về các gói cước mới và khuyến mãi từ chúng tôi.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 px-4 py-2.5 bg-light-gray rounded-l-lg border border-medium-gray focus:outline-none focus:border-primary-blue transition-colors text-dark-gray placeholder-text-light"
              />
              <button className="px-4 py-2.5 bg-gradient-primary text-white rounded-r-lg hover:shadow-soft-blue transition-all font-vietnam font-bold">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        {paymentMethods.length > 0 && (
          <div className="mb-12 pb-12 border-b border-medium-gray">
            <h4 className="text-center text-xl font-vietnam font-bold mb-8">
              <span className="gradient-text-primary">Phương Thức Thanh Toán</span>
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="card-modern flex items-center gap-3 px-6 py-4 hover:shadow-soft-lg transition-all hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-lg bg-light-gray flex items-center justify-center">
                    <i className={`${method.icon} ${method.color} text-xl`}></i>
                  </div>
                  <span className="font-vietnam font-bold text-dark-gray">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom footer */}
        <div className="text-center pt-8">
          <div className="mb-6 flex items-center justify-center gap-2 text-text-light">
            <i className="fas fa-lock text-primary-blue"></i>
            <span className="text-sm font-medium">Bảo mật và riêng tư được bảo vệ</span>
          </div>
          <p className="text-text-light text-sm">
            &copy; {new Date().getFullYear()} <span className="font-vietnam font-bold text-dark-gray">Mạng Việt Nam</span>. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-text-light text-xs mt-2">
            Xây dựng với ❤️ cho cộng đồng Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
