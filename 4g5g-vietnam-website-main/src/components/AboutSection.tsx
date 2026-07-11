'use client';

import { useEffect, useState } from 'react';

export default function AboutSection() {
  const [content, setContent] = useState({
    title: 'Về Chúng Tôi',
    content: 'Chúng tôi cung cấp các gói cước di động tốt nhất từ các nhà mạng lớn Việt Nam với giá cả cạnh tranh.',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const websiteContent = localStorage.getItem('websiteContent');
      if (websiteContent) {
        try {
          const parsed = JSON.parse(websiteContent);
          if (parsed.about) {
            setContent(parsed.about);
          }
        } catch (e) {
          console.error('Error parsing website content:', e);
        }
      }
    }
  }, []);

  const stats = [
    { label: 'Thành Lập', value: '2019', icon: 'fas fa-calendar' },
    { label: 'Khách hàng', value: '50,000+', icon: 'fas fa-users' },
    { label: 'Đánh giá', value: '4.9★', icon: 'fas fa-star' },
  ];

  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'An Toàn & Bảo Mật',
      description: 'Giao dịch an toàn với xử lý thanh toán được mã hóa và bảo mật SSL',
      color: 'text-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Kích Hoạt Nhanh',
      description: 'Thiết lập chỉ trong vài phút - bắt đầu sử dụng ngay lập tức',
      color: 'text-primary-blue',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      icon: 'fas fa-headset',
      title: 'Hỗ Trợ 24/7',
      description: 'Đội hỗ trợ khách hàng sẵn sàng giúp bạn mọi lúc, mọi nơi',
      color: 'text-accent-teal',
      bgColor: 'from-teal-500/20 to-teal-600/20',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-vietnam font-900 mb-6 text-dark-gray">
            {content.title}
          </h2>
          <p className="text-lg text-text-light max-w-3xl mx-auto leading-relaxed">
            {content.content}
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 p-6 sm:p-10 bg-gradient-to-br from-light-gray to-white rounded-3xl border border-medium-gray">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <i className={`${stat.icon} text-3xl text-primary-blue`}></i>
              </div>
              <div className="text-2xl sm:text-3xl font-vietnam font-900 gradient-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-light font-vietnam font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="card-modern group hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${feature.icon} text-2xl ${feature.color}`}></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-vietnam font-bold text-dark-gray mb-3 group-hover:text-primary-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-text-light leading-relaxed">
                {feature.description}
              </p>

              {/* Decoration line */}
              <div className="w-8 h-1 bg-gradient-primary rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

