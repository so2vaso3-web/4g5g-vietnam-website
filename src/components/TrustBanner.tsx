'use client';

import { useState, useEffect } from 'react';

export default function TrustBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Check if user has closed the banner before
    if (typeof window !== 'undefined') {
      const hasClosedBanner = localStorage.getItem('trustBannerClosed');
      if (!hasClosedBanner) {
        // Show banner after a short delay
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trustBannerClosed', 'true');
      // Dispatch event to notify header
      window.dispatchEvent(new Event('bannerClosed'));
    }
  };

  if (isClosed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-red-50 to-blue-50 backdrop-blur-md border-b border-gray-200 shadow-xl">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Trust Info */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-700">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-shield-check text-green-600 text-base sm:text-lg"></i>
                <span className="font-semibold whitespace-nowrap">Bảo Mật SSL</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-lock text-blue-600 text-base sm:text-lg"></i>
                <span className="font-semibold whitespace-nowrap">Tuân Thủ PCI</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-certificate text-yellow-600 text-base sm:text-lg"></i>
                <span className="font-semibold whitespace-nowrap hidden sm:inline">Đối Tác Được Chứng Nhận</span>
                <span className="font-semibold whitespace-nowrap sm:hidden">Đã Chứng Nhận</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-award text-purple-400 text-base sm:text-lg"></i>
                <span className="font-semibold whitespace-nowrap hidden sm:inline">Dịch Vụ Tốt Nhất 2025</span>
                <span className="font-semibold whitespace-nowrap sm:hidden">Tốt Nhất 2025</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
              aria-label="Close banner"
            >
              <i className="fas fa-times text-lg sm:text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

