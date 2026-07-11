'use client';

import { useState, useEffect } from 'react';

export default function IntroBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ngay lập tức check pathname - không chờ
      const currentPath = window.location.pathname;
      
      // KHÔNG hiển thị trên admin page - luôn luôn dismiss
      if (currentPath.startsWith('/admin')) {
        setIsDismissed(true);
        setIsVisible(false);
        return;
      }
      
      // Check if user chose to never show again
      const neverShow = localStorage.getItem('introBannerNeverShow');
      if (neverShow === 'true') {
        setIsDismissed(true);
        setIsVisible(false);
        return;
      }
      
      // TẠM THỜI TẮT INTROBANNER ĐỂ TEST - COMMENT LẠI SAU
      // Uncomment đoạn code dưới để bật lại IntroBanner
      /*
      // Listen for route changes
      const handleRouteChange = () => {
        const newPath = window.location.pathname;
        if (newPath.startsWith('/admin')) {
          setIsDismissed(true);
          setIsVisible(false);
        }
      };
      
      window.addEventListener('popstate', handleRouteChange);
      
      // Show banner on main pages only (after delay)
      if (!currentPath.startsWith('/admin')) {
        const timer = setTimeout(() => {
          // Double-check pathname before showing
          if (!window.location.pathname.startsWith('/admin')) {
            setIsVisible(true);
          }
        }, 500);
        
        return () => {
          clearTimeout(timer);
          window.removeEventListener('popstate', handleRouteChange);
        };
      }
      */
      
      // TẠM THỜI: Luôn dismiss để test
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    // Just close for this session, don't save to localStorage
    setIsVisible(false);
  };

  const handleNeverShow = () => {
    // Save preference to never show again
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('introBannerNeverShow', 'true');
      window.dispatchEvent(new Event('introBannerDismissed'));
    }
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-red-600/98 to-blue-600/98 backdrop-blur-xl rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg">
                <i className="fas fa-star text-3xl md:text-4xl text-yellow-300 animate-spin-slow"></i>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent">
                    Chào Mừng Đến Mạng Việt Nam!
                  </span>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold text-white animate-pulse">
                    MỚI
                  </span>
                </h3>
                <p className="text-white/80 text-sm md:text-base mt-1">
                  Đối tác đáng tin cậy của bạn cho các gói cước di động cao cấp
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 text-white"
              aria-label="Close banner"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Key Features */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-check-circle text-green-300"></i>
                Tại Sao Chọn Chúng Tôi?
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-white/90">
                <div className="flex items-start gap-3">
                  <i className="fas fa-mobile-alt text-blue-300 mt-1"></i>
                  <div>
                    <span className="font-semibold">Giá Tốt Nhất</span>
                    <p className="text-sm text-white/70">Viettel, Vinaphone, MobiFone & nhiều hơn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-bolt text-yellow-300 mt-1"></i>
                  <div>
                    <span className="font-semibold">Kích Hoạt Tức Thì</span>
                    <p className="text-sm text-white/70">Kích hoạt trong vài phút, không phải vài giờ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-shield-alt text-green-300 mt-1"></i>
                  <div>
                    <span className="font-semibold">100% An Toàn</span>
                    <p className="text-sm text-white/70">Thanh toán được mã hóa SSL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-headset text-purple-300 mt-1"></i>
                  <div>
                    <span className="font-semibold">Hỗ Trợ 24/7</span>
                    <p className="text-sm text-white/70">Hỗ trợ chuyên nghiệp luôn sẵn sàng</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
                <p className="text-yellow-200 font-semibold text-center">
                  💰 Tiết kiệm lên đến 50% hóa đơn hàng tháng!
                </p>
              </div>
            </div>

            {/* Refund Policy & Terms */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-file-contract text-blue-300"></i>
                Chính Sách & Điều Khoản
              </h4>
              <div className="space-y-3 text-white/90">
                <div className="flex items-start gap-3">
                  <i className="fas fa-undo text-green-300 mt-1"></i>
                  <div>
                    <span className="font-semibold block mb-1">Chính Sách Hoàn Tiền</span>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Hoàn tiền đầy đủ trong 30 ngày nếu không hài lòng. Không cần giải thích. Liên hệ đội ngũ hỗ trợ của chúng tôi để được hỗ trợ.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-gavel text-orange-300 mt-1"></i>
                  <div>
                    <span className="font-semibold block mb-1">Điều Khoản Dịch Vụ</span>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản của chúng tôi. Vui lòng xem lại các điều khoản dịch vụ đầy đủ trước khi mua.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-life-ring text-cyan-300"></i>
                Hỗ Trợ Khách Hàng
              </h4>
              <div className="space-y-3 text-white/90">
                <div className="flex items-start gap-3">
                  <i className="fas fa-sim-card text-purple-300 mt-1"></i>
                  <div>
                    <span className="font-semibold block mb-1">Vấn Đề SIM/eSIM?</span>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Gặp vấn đề với thẻ SIM hoặc eSIM của bạn? Đội ngũ hỗ trợ chuyên nghiệp của chúng tôi sẵn sàng 24/7 để giúp bạn giải quyết mọi vấn đề về kích hoạt hoặc kết nối. Liên hệ với chúng tôi qua email hoặc chat trực tuyến.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-question-circle text-yellow-300 mt-1"></i>
                  <div>
                    <span className="font-semibold block mb-1">Cần Hỗ Trợ?</span>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Đội ngũ hỗ trợ tận tâm của chúng tôi phản hồi trong vài phút. Có sẵn qua email, chat trực tuyến hoặc hỗ trợ điện thoại.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activation Guide */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-5 border border-green-400/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-magic text-green-300"></i>
                Cách Kích Hoạt Gói Cước Của Bạn
              </h4>
              <div className="space-y-3 text-white/90">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center font-bold text-green-300">
                    1
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Mua Gói Cước Của Bạn</span>
                    <p className="text-sm text-white/80">Chọn và mua gói cước di động ưa thích của bạn từ website của chúng tôi.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center font-bold text-green-300">
                    2
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Nhận Xác Nhận</span>
                    <p className="text-sm text-white/80">Bạn sẽ nhận được email xác nhận với chi tiết đơn hàng và hướng dẫn kích hoạt.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center font-bold text-green-300">
                    3
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Kích Hoạt SIM/eSIM</span>
                    <p className="text-sm text-white/80">Làm theo các bước kích hoạt đơn giản được gửi đến email của bạn. Đối với SIM vật lý, lắp vào thiết bị của bạn. Đối với eSIM, quét mã QR được cung cấp.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center font-bold text-green-300">
                    4
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Tận Hưởng Dịch Vụ</span>
                    <p className="text-sm text-white/80">Sau khi kích hoạt, gói cước của bạn sẽ hoạt động ngay lập tức. Bắt đầu sử dụng mạng 4G/5G tốc độ cao!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleDismiss}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl font-bold text-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-3 text-white"
              >
                <span>Bắt Đầu Ngay</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              <button
                onClick={handleNeverShow}
                className="w-full px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <i className="fas fa-eye-slash"></i>
                <span>Không hiển thị lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

