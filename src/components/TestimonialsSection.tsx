'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MapPin, BadgeCheck } from 'lucide-react';
import Reveal from './ui/Reveal';

const TESTIMONIALS = [
  {
    name: 'Nguyễn Văn An',
    location: 'Hà Nội',
    rating: 5,
    text: 'Dịch vụ tuyệt vời! Tôi đã kích hoạt gói Viettel trong vài phút. Hỗ trợ khách hàng rất hữu ích và giá cả không thể đánh bại.',
    initials: 'NA',
    carrier: 'Viettel',
  },
  {
    name: 'Trần Thị Bình',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    text: 'Chuyển từ nhà mạng cũ và tiết kiệm hơn 500.000đ/tháng. Gói Vinaphone Unlimited hoàn hảo cho gia đình tôi. Rất được khuyên dùng!',
    initials: 'TB',
    carrier: 'Vinaphone',
  },
  {
    name: 'Lê Văn Cường',
    location: 'Đà Nẵng',
    rating: 5,
    text: 'Phủ sóng 5G MobiFone rất xuất sắc ở khu vực của tôi. Thiết lập rất dễ dàng và quy trình thanh toán an toàn. Trải nghiệm tuyệt vời!',
    initials: 'LC',
    carrier: 'MobiFone',
  },
  {
    name: 'Phạm Thị Dung',
    location: 'Cần Thơ',
    rating: 5,
    text: 'Quyết định tốt nhất tôi đã làm trong năm nay! Gói năm Vietnamobile đã giúp tôi tiết kiệm hàng triệu đồng. Phủ sóng tuyệt vời ở mọi nơi tôi đến.',
    initials: 'PD',
    carrier: 'Vietnamobile',
  },
];

const STATS = [
  { value: '50K+', label: 'Khách hàng hài lòng', from: 'from-brand-400', to: 'to-accent-400' },
  { value: '4.9★', label: 'Đánh giá trung bình', from: 'from-fuchsia-400', to: 'to-brand-400' },
  { value: '99.9%', label: 'Thời gian hoạt động', from: 'from-emerald-400', to: 'to-cyan-400' },
  { value: '24/7', label: 'Hỗ trợ', from: 'from-amber-400', to: 'to-orange-400' },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-app relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Star className="h-3.5 w-3.5" strokeWidth={2.2} />
              Khách hàng nói gì
            </span>
            <h2 className="section-title mt-5">
              <span className="text-gradient">Được khách hàng tin tưởng</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
              Đừng chỉ nghe lời chúng tôi — hãy nghe từ hàng nghìn khách hàng hài lòng trên
              toàn quốc.
            </p>
          </div>
        </Reveal>

        {/* Carousel */}
        <Reveal delay={120}>
          <div className="relative mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-6 backdrop-blur-md sm:p-8 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
              />
              <Quote
                className="absolute right-6 top-6 h-12 w-12 text-brand-500/15"
                strokeWidth={1.4}
                aria-hidden
              />

              <div className="relative">
                {/* Stars */}
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-6 sm:w-6"
                      strokeWidth={1.6}
                    />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="text-balance text-base leading-relaxed text-text-primary sm:text-lg md:text-xl">
                  &ldquo;{current.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-base font-bold text-white shadow-glow-blue sm:h-14 sm:w-14">
                      {current.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary sm:text-base">
                        {current.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {current.location}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Khách hàng {current.carrier}
                  </span>
                </div>
              </div>
            </div>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={prev}
              aria-label="Đánh giá trước"
              className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/80 text-text-secondary backdrop-blur-md transition-all hover:-translate-y-1/2 hover:scale-105 hover:border-brand-500/40 hover:text-text-primary sm:-left-5 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Đánh giá tiếp theo"
              className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/80 text-text-secondary backdrop-blur-md transition-all hover:-translate-y-1/2 hover:scale-105 hover:border-brand-500/40 hover:text-text-primary sm:-right-5 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Đánh giá ${idx + 1}`}
                  className={[
                    'h-2 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'w-8 bg-gradient-brand shadow-glow-blue'
                      : 'w-2 bg-white/20 hover:bg-white/30',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-6"
            >
              <div
                className={`bg-gradient-to-r ${stat.from} ${stat.to} bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl`}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-secondary sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
