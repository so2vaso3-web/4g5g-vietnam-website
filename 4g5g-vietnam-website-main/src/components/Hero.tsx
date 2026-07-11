'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [content, setContent] = useState({
    title: 'Gói Cước 4G & 5G Cao Cấp',
    subtitle: 'Mạng Lưới Phủ Sóng Tốt Nhất',
    description: 'Chọn từ 9 nhà mạng hàng đầu Việt Nam với giá cả và phủ sóng không thể đánh bại.',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const websiteContent = localStorage.getItem('websiteContent');
      if (websiteContent) {
        try {
          const parsed = JSON.parse(websiteContent);
          if (parsed.hero) {
            setContent(parsed.hero);
          }
        } catch (e) {
          console.error('Error parsing website content:', e);
        }
      }
    }
  }, []);

  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkBanner = () => {
        const hasClosedBanner = localStorage.getItem('trustBannerClosed');
        setBannerVisible(!hasClosedBanner);
      };
      checkBanner();
      window.addEventListener('bannerClosed', checkBanner);
      return () => window.removeEventListener('bannerClosed', checkBanner);
    }
  }, []);

  return (
    <section id="home" className={`${bannerVisible ? 'pt-44 md:pt-48' : 'pt-32'} pb-20 px-4 relative transition-all duration-300 overflow-hidden`}>
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-light-gray to-white -z-20"></div>
      
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-teal rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float -z-10" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        {/* Badge */}
        <div className="mb-6 sm:mb-8 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-light-gray border border-medium-gray hover:border-primary-blue transition-all">
          <span className="w-2 h-2 rounded-full bg-primary-blue animate-pulse"></span>
          <span className="text-sm font-vietnam font-semibold text-dark-gray">
            ✨ Được tin dùng bởi 50,000+ khách hàng trên toàn quốc
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-vietnam font-900 mb-6 sm:mb-8 text-dark-gray leading-tight animate-fade-in">
          <span className="gradient-text-primary">{content.title}</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl md:text-3xl text-dark-gray font-vietnam font-600 mb-4 sm:mb-6">
          {content.subtitle}
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-text-light max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          {content.description}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
          <a
            href="#plans"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-primary text-white rounded-2xl font-vietnam font-bold text-lg hover:shadow-soft-blue transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 min-h-[56px] group"
          >
            <i className="fas fa-mobile-alt text-xl group-hover:rotate-12 transition-transform"></i>
            <span>Xem Gói Cước</span>
            <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-2xl font-vietnam font-bold text-lg hover:bg-primary-blue hover:text-white hover:shadow-soft-blue transition-all duration-300 flex items-center justify-center gap-3 min-h-[56px] group"
          >
            <i className="fas fa-info-circle text-lg"></i>
            <span>Tìm Hiểu Thêm</span>
          </a>
        </div>
        
        {/* Trust indicators */}
        <div className="pt-8 sm:pt-10 border-t border-medium-gray">
          <p className="text-sm text-text-light mb-6 font-vietnam font-medium">Được bảo vệ bởi các chuẩn mực hàng đầu</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-dark-gray group hover:text-primary-blue transition-colors">
              <div className="w-8 h-8 rounded-lg bg-light-gray group-hover:bg-primary-blue/10 flex items-center justify-center transition-all">
                <i className="fas fa-shield-alt text-sm text-primary-blue"></i>
              </div>
              <span className="text-sm font-medium font-vietnam">Bảo Mật SSL</span>
            </div>
            <div className="flex items-center gap-2 text-dark-gray group hover:text-primary-blue transition-colors">
              <div className="w-8 h-8 rounded-lg bg-light-gray group-hover:bg-primary-blue/10 flex items-center justify-center transition-all">
                <i className="fas fa-certificate text-sm text-primary-blue"></i>
              </div>
              <span className="text-sm font-medium font-vietnam">Được Chứng Nhận</span>
            </div>
            <div className="flex items-center gap-2 text-dark-gray group hover:text-primary-blue transition-colors">
              <div className="w-8 h-8 rounded-lg bg-light-gray group-hover:bg-primary-blue/10 flex items-center justify-center transition-all">
                <i className="fas fa-check-circle text-sm text-primary-blue"></i>
              </div>
              <span className="text-sm font-medium font-vietnam">Tuân Thủ PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

