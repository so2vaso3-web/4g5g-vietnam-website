'use client';

import { useState } from 'react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      location: 'Hà Nội',
      rating: 5,
      text: 'Dịch vụ tuyệt vời! Tôi đã kích hoạt gói Viettel trong vài phút. Hỗ trợ khách hàng rất hữu ích và giá cả không thể đánh bại.',
      avatar: 'fas fa-user-circle',
      carrier: 'Viettel',
    },
    {
      name: 'Trần Thị Bình',
      location: 'TP. Hồ Chí Minh',
      rating: 5,
      text: 'Chuyển từ nhà mạng cũ và tiết kiệm hơn 500.000đ/tháng. Gói Vinaphone Unlimited hoàn hảo cho gia đình tôi. Rất được khuyên dùng!',
      avatar: 'fas fa-user-circle',
      carrier: 'Vinaphone',
    },
    {
      name: 'Lê Văn Cường',
      location: 'Đà Nẵng',
      rating: 5,
      text: 'Phủ sóng 5G MobiFone rất xuất sắc ở khu vực của tôi. Thiết lập rất dễ dàng và quy trình thanh toán an toàn. Trải nghiệm tuyệt vời!',
      avatar: 'fas fa-user-circle',
      carrier: 'MobiFone',
    },
    {
      name: 'Phạm Thị Dung',
      location: 'Cần Thơ',
      rating: 5,
      text: 'Quyết định tốt nhất tôi đã làm trong năm nay! Gói năm Vietnamobile đã giúp tôi tiết kiệm hàng triệu đồng. Phủ sóng tuyệt vời ở mọi nơi tôi đến.',
      avatar: 'fas fa-user-circle',
      carrier: 'Vietnamobile',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 px-4 bg-white relative -mt-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đừng chỉ nghe lời chúng tôi - hãy nghe từ hàng nghìn khách hàng hài lòng
          </p>
        </div>

        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200 shadow-2xl relative overflow-hidden group">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              {/* Rating Stars */}
              <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400 text-lg sm:text-xl"></i>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 text-center mb-6 sm:mb-8 leading-relaxed italic px-2 sm:px-0">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-2xl sm:text-3xl text-white shadow-lg">
                    <i className={testimonials[currentIndex].avatar}></i>
                  </div>
                  <div>
                    <div className="font-bold text-base sm:text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                      <i className="fas fa-map-marker-alt"></i>
                      {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/20 rounded-lg sm:rounded-xl border border-blue-500/30">
                  <span className="text-xs sm:text-sm text-blue-400 font-semibold">
                    <i className="fas fa-check-circle mr-1"></i>
                    Khách Hàng {testimonials[currentIndex].carrier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 border border-gray-300 hover:bg-gray-300 text-gray-700 transition-all duration-300 flex items-center justify-center z-20 hover:scale-110 min-w-[44px] min-h-[44px]"
            aria-label="Previous testimonial"
          >
            <i className="fas fa-chevron-left text-sm sm:text-base"></i>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 border border-gray-300 hover:bg-gray-300 text-gray-700 transition-all duration-300 flex items-center justify-center z-20 hover:scale-110 min-w-[44px] min-h-[44px]"
            aria-label="Next testimonial"
          >
            <i className="fas fa-chevron-right text-sm sm:text-base"></i>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  idx === currentIndex
                    ? 'bg-blue-500 w-8 h-2 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12">
          <div className="text-center p-4 sm:p-5 md:p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              50K+
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Khách Hàng Hài Lòng</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              4.9★
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Đánh Giá Trung Bình</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              99.9%
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Thời Gian Hoạt Động</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              24/7
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">Hỗ Trợ</div>
          </div>
        </div>
      </div>
    </section>
  );
}

